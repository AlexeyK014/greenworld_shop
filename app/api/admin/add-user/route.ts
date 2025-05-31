import bcrypt, { hashSync } from 'bcryptjs'
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuthRouteData, getDbAndReqBody, parseJwt } from '@/lib/utils/api-routes';
import { corsHeaders } from '@/constants/corsHeader';
import { idGenerator } from '@/lib/utils/common';

export async function POST(req: Request) {
  try {
    // полуаем из фун-ии
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req);

    // при создание юзера в первую очередь хэшим пароль
    // передаём число, на основе этого числе генерирует
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(reqBody.password, salt)

    let image = null

    // проверка, чтобы при создание не было пользователей с одинаковыми email
    const user = await db.collection('users').findOne({ email: reqBody.email })
    if (user) {
      return NextResponse.json({
        status: 400,
        message: 'Пользователь с таким email уже существует'
      }, corsHeaders)
    }

    if (reqBody.image) {
      // в переменную записываем объект
      image = {
        ...reqBody.image,
        imgId: idGenerator() // присваеваем уникальный id
      }

      // если картинка есть, сохраняем на хостинг
      await db.collection('images').insertOne(image)
    }

    const newUser = {
      ...reqBody,
      image: {
        // если картинка есть, тогда задаём ей специальные url
        url: image ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}?id=${image.imgId}`
        : '',
        desc: image ? reqBody.name : ''
      },
      password: hash,
    }

    const { insertedId } = await db.collection('users').insertOne(newUser)

    return NextResponse.json({
      status: 201,
      newUser: { id: insertedId, ...newUser },
    }, corsHeaders);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}


export async function OPTIONS() {
  return new NextResponse(null, { ...corsHeaders, status: 200 })
}
