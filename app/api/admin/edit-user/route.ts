import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { idGenerator } from '@/lib/utils/common'
import { ObjectId } from 'mongodb'
import { corsHeaders } from '@/constants/corsHeader'

export async function POST(req: Request) {
  try {
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req)
    const isValidId = ObjectId.isValid(reqBody.id as string)

    // есть ли новая картинка при редактирование или нет
    let newImage = null

    // делаем проверку правильности id
    if (!isValidId) {
      return NextResponse.json(
        {
          message: 'Wrong user id',
          status: 400,
        },
        corsHeaders
      )
    }

    // поиск по id
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(reqBody.id) })

    if (!user) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Пользователя не существует',
        },
        corsHeaders
      )
    }

    // reqBody.image.dataUrl-означает что картинка старая сброшена
    if (reqBody.image && reqBody.image.dataUrl) {
      // в переменную записываем объект
      newImage = {
        ...reqBody.image,
        imgId: idGenerator(), // присваеваем уникальный id
      }

      // сетим новую картинку. если картинка есть, сохраняем на хостинг
      await db.collection('images').insertOne(newImage)

      // удаляем старую картинку
      // у юзера по полю url удаляем его картинку
      await db.collection('images').deleteOne({ url: user.image.url })
    }

    // обновляем юзера в коллекции
    await db.collection('users').updateOne(
      { _id: new ObjectId(reqBody.id) },
      {
        $set: {
          // передаём поля заного
          name: reqBody.name,
          email: reqBody.email,
          role: reqBody.role,
          // динамически обновляем картинку
          ...(newImage && { // если newImage, в поле image записываем новую картинку
            image: {
              url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}?id=${newImage.imgId}`,
              desc: reqBody.name,
            },
          }),
        },
      }
    )

    const updatedUser = await db
      .collection('users')
      .findOne({ _id: new ObjectId(reqBody._id) })

    return NextResponse.json(
      {
        status: 200,
        updatedUser: { id: updatedUser?._id, ...updatedUser },
      },
      corsHeaders
    )
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { ...corsHeaders, status: 200 })
}
