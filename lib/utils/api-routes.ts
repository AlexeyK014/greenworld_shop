// общая фун-я для подключения к базам данных

import { Db, MongoClient, ObjectId } from 'mongodb'
import { shuffle } from './common'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export const getDbAndReqBody = async (
  clientPromise: Promise<MongoClient>,
  req: Request | null
) => {
  const db = (await clientPromise).db(process.env.NEXT_PUBLIC_DB_NAME)

  if (req) {
    const reqBody = await req.json()
    return { db, reqBody }
  }

  return { db }
}

export const getNewAndBestsellerGoods = async (db: Db, fieldName: string) => {
  const microgreen = await db.collection('microgreen').find().toArray()
  const sprouts = await db.collection('sprouts').find().toArray()

  return shuffle([
    ...microgreen
      .filter(
        (item) =>
          item[fieldName] && Object.values(item.sizes).some((value) => value)
      )
      .slice(0, 2),
    ...sprouts
      .filter(
        (item) => item[fieldName] && !Object.values(item.sizes).length
        // (item) =>
        //   item[fieldName] && Object.values(item.sizes).some((value) => value)
      )
      .slice(0, 2),
  ])
}

export const generateTokens = (name: string, email: string) => {
  const accessToken = jwt.sign(
    // берём данные юзера и на их основе генерируем токен
    {
      name,
      email,
    },
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY as string,
    {
      expiresIn: '10m',
    }
  )

  const refreshToken = jwt.sign(
    {
      email,
    },
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY as string,
    { expiresIn: '10d' }
  )

  return { accessToken, refreshToken }
}

export const createUserAndGenerateTokens = async (
  db: Db, //обращаемся к БД
  reqBody: { name: string; password: string; email: string } // это приходит с регистрации
) => {
  // дальше берём пароль и создаём переменную salt - кол-во иттераций хеширования(10)
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(reqBody.password, salt) // хешируем пароль, передаём маи пароль и salt

  // создаём юзер
  await db.collection('users').insertOne({
    name: reqBody.name,
    password: hash,
    email: reqBody.email,
    image: '',
    role: 'user',
  })

  return generateTokens(reqBody.name, reqBody.email)
}

// нахождение юзера по email
export const findUserByEmail = async (db: Db, email: string) =>
  db.collection('users').findOne({ email })

// для передачи в заголовках токена
export const getAuthRouteData = async (
  clientPromise: Promise<MongoClient>,
  req: Request,
  withReqBody = true
) => {
  const { db, reqBody } = await getDbAndReqBody(
    clientPromise,
    withReqBody ? req : null
  )
  const token = req.headers.get('authorization')?.split(' ')[1]
  const validatedTokenResult = await isValidAccessToken(token)

  return { db, reqBody, validatedTokenResult, token }
}

// фун-я проверка токена
// принимает токен
export const isValidAccessToken = async (token: string | undefined) => {
  const baseError = {
    message: 'Unauthorized',
    status: 401,
  }
  let jwtError = null

  // если токен некоректный возвращаем ошибку
  if (!token) {
    return {
      ...baseError,
      error: { message: 'jwt is required' },
    }
  }

  await jwt.verify(
    token,
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY as string,
    async (err: VerifyErrors | null) => {
      if (err) {
        // если токен неправильный, записываем ошибку в jwtError
        jwtError = err
      }
    }
  )

  // и если есть ошибка, возвращаем ошибку на клиент и показываем что мы не авторизованы
  if (jwtError) {
    return {
      ...baseError,
      error: jwtError,
    }
  }

  return { status: 200 }
}

// разбиваем токен с помощбю метода split(), получаем середину токена - вторую секцию
//  эту секцию преобразовываем в объект, где у нас будет email
export const parseJwt = (token: string) =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

// получаем торы корзины только для определённого пользователя - по userId
export const getDataFromDBByCollection = async (
  clientPromise: Promise<MongoClient>,
  req: Request,
  collection: string
) => {
  const { db, validatedTokenResult, token } = await getAuthRouteData(
    clientPromise,
    req,
    false
  )

  // проверяем правильность токена
  if (validatedTokenResult.status !== 200) {
    return NextResponse.json(validatedTokenResult)
  }

  // если токен правильный, находим юзера по емайл
  // и фильтруем корзину по userId
  const user = await findUserByEmail(db, parseJwt(token as string).email)
  const items = await db
    .collection(collection)
    .find({ userId: user?._id })
    .toArray()

  // возвращаем товар имеено для этого пользователя
  return NextResponse.json(items)
}

// обновляем товары в коллекции
// для того чтобы когда юзер НЕ авторизованный добавляет товары в корзину, после авторизации
// эти же товары оставались в его профиле
export const replaceProductsInCollection = async (
  clientPromise: Promise<MongoClient>,
  req: Request,
  collection: string
) => {
  const { db, validatedTokenResult, reqBody, token } = await getAuthRouteData(
    clientPromise,
    req
  )

  // проверка на валидацию токена
  if (validatedTokenResult.status !== 200) {
    return NextResponse.json(validatedTokenResult)
  }

  // проверка передаются ли с клиента элементы товара которые мы хотим заменить
  if (!reqBody.items) {
    return NextResponse.json({
      // если не передаются, отправляем сообщение что нужно это поле передать
      message: 'items fields is requires',
      status: 404,
    })
  }

  // находим юзера, для того чтобы его id прикрепляли к элементам корзины которые доб на клиенте
  // парсим токен и по его емайлу назодим юзера в БД
  const user = await db
    .collection('users')
    .findOne({ email: parseJwt(token as string).email })

  // создаём новый массив обработанных items(товаров), где мы прикрепляли userId для каждого
  // элемента корзины, который приходи с клиента
  // с помощью map проходимся по reqBody.items возвращаем объект
  // преобразовываем в новый объект new ObjectId(item.productId)
  const items = (reqBody.items as { productId: string }[]).map((item) => ({
    userId: user?._id,
    ...item,
    productId: new ObjectId(item.productId),
  }))

  // удаляем у коллекции cart те товары у которых есть userId
  // для того чтобы полностью удалять то что было на БД
  // и заменяем их на последние данные
  await db.collection(collection).deleteMany({ userId: user?._id })

  // проверка, если у юзера в корзине ничего нет
  // тогода возвращием пустой массив, не обновляя его
  if (!items.length) {
    return NextResponse.json({
      status: 201,
      items: [],
    })
  }
  // иначе деалем кладём в БД уже обновлённые items
  await db.collection(collection).insertMany(items)

  // и возвращаем их обратно на клиент, чтобы обновить стор
  return NextResponse.json({
    status: 201,
    items,
  })
}

// общая фун-я удаления товаров
export const deleteProduct = async (
  clientPromise: Promise<MongoClient>,
  req: Request,
  id: string,
  collection: string
) => {
  const { db, validatedTokenResult } = await getAuthRouteData(
    clientPromise,
    req,
    false
  )

  // проверка валидации токена
  if (validatedTokenResult.status !== 200) {
    return NextResponse.json(validatedTokenResult)
  }

  //  при успехе вызывать deleteOne
  //  и по id удаляем товар
  await db.collection(collection).deleteOne({ _id: new ObjectId(id) })

  // возвращаем id удалённого товара
  return NextResponse.json({ status: 204, id })
}
