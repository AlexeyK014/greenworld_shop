/* eslint-disable prettier/prettier */
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { idGenerator } from '@/lib/utils/common'
import { corsHeaders } from '@/constants/corsHeader'

export async function POST(req: Request) {
  try {
    // полуаем из фун-ии
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req)
    let images = null

    if (reqBody.images.every((img: { dataUrl: string }) => img.dataUrl)) {
      // в переменную записываем объект
      images = reqBody.images.map(
        (img: { dataUrl: string; title: string }) => ({
          ...img,
          imgId: idGenerator(),
        })
      )

      // если картинка есть, сохраняем на хостинг
      await db.collection('images').insertMany(images)
    }

    const newNews = {
      ...reqBody,
      images: images
        ? images.map((img: { imgId: string }) => ({
          url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}?id=${img.imgId}`,
          desc: reqBody.name,
        }))
        : reqBody.images,

    }

    const { insertedId } = await db.collection('news').insertOne(newNews)

    return NextResponse.json(
      {
        status: 201,
        newItem: { id: insertedId, ...newNews },
      },
      corsHeaders
    )
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { ...corsHeaders, status: 200 }
  )
}
