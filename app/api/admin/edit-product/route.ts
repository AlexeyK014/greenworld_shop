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
    let newImages = []

    // для старых картинок
    const oldImages = reqBody.oldImages

    // делаем проверку правильности id
    if (!isValidId) {
      return NextResponse.json(
        {
          message: 'Wrong product id',
          status: 400,
        },
        corsHeaders
      )
    }

    // получаем конкретный товар
    const product = await db
      .collection(reqBody.category)
      .findOne({ _id: new ObjectId(reqBody.id) })

    if (!product) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Пользователя не существует',
        },
        corsHeaders
      )
    }

    // проверка, если будут новые картинки
    if (reqBody.newImages.length) {
      newImages = reqBody.newImages.map(
        (img: { dataUrl: string; title: string }) => ({
          ...img,
          imgId: idGenerator(),
        })
      )

      // сетим новую картинку. если картинка есть, сохраняем на хостинг
      await db.collection('images').insertMany(newImages)
    }

    // удаляем те картинки вместо которых у нас пришли новые
    // но сначала делаем проверку на старые картинки и в зависимости от того какие отсутсвуют
    if (oldImages.length) {
      const oldImagesUrls = oldImages.map((img: { url: string }) => img.url)

      // проверям картинки, чтобы те картинки которые были заменены на новый удалить
      const deletedImages = product.images.filter(
        // вернутся картинки которые были заменены
        (img: { url: string }) => !oldImagesUrls.includes(img.url)
      )

      if (deletedImages.length) {
        await db.collection('images').deleteMany({
          url: { //по url находим картинки
            // передаём массив и преобразовываем его в строчку с url
            $in: deletedImages.map((img: { url: string }) => img.url),
          },
        })
      }
    }

    // удаляем ненужные поля
    delete reqBody.newImages
    delete reqBody.oldImages
    delete reqBody._id

    // обновляем
    await db.collection(reqBody.category).updateOne(
      { _id: new ObjectId(reqBody.id) },
      {
        $set: {
          ...reqBody,
          images: [
            ...oldImages,
            ...newImages.map((img: { imgId: string }) => ({
              url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}?id=${img.imgId}`,
              desc: reqBody.name,
            })),
          ],
        },
      }
    )

    const updatedItem = await db
      .collection(reqBody.category)
      .findOne({ _id: new ObjectId(reqBody.id) })

    return NextResponse.json(
      {
        status: 200,
        updatedItem,
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
