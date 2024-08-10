// import { corsHeaders } from '@/constants/corsHeader'
// import clientPromise from '@/lib/mongodb'
// import { getDbAndReqBody } from '@/lib/utils/api-routes'
// import { ObjectId } from 'mongodb'
// import { NextResponse } from 'next/server'

// export async function GET(req: Request) {
//   try {
//     const { db } = await getDbAndReqBody(clientPromise, null)
//     const url = new URL(req.url)
//     const ids = url.searchParams.get('ids')

//     if (!ids) {
//       return NextResponse.json(
//         {
//           status: 404,
//           message: 'ids required',
//         },
//         corsHeaders
//       )
//     }

//     const parsedIds = JSON.parse(ids) as string[]

//     const deleteManyFromCollection = async (collection: string) => {
//       // вызываем deleteMany у коллекции
//       // также удаляем по полю id, с помощью оператора $in, где эл массива это ObjectId(id)
//       await db.collection(collection).deleteMany({
//         _id: {
//           $in: parsedIds.map((id) => new ObjectId(id)),
//         },
//       })
//     }

//     await Promise.allSettled([
//       deleteManyFromCollection('microgreen'),
//       deleteManyFromCollection('sprouts'),
//     ])

//     return NextResponse.json(
//       {
//         status: 204,
//       },
//       corsHeaders
//     )
//   } catch (error) {
//     throw new Error((error as Error).message)
//   }
// }

import { corsHeaders } from '@/constants/corsHeader'
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { db } = await getDbAndReqBody(clientPromise, null)
    const url = new URL(req.url)
    const ids = url.searchParams.get('ids')

    if (!ids) {
      return NextResponse.json(
        {
          status: 404,
          message: 'ids required',
        },
        corsHeaders
      )
    }

    const parsedIds = JSON.parse(ids) as string[]

    const deleteManyFromCollection = async (collection: string) => {
      await db.collection(collection).deleteMany({
        _id: {
          $in: parsedIds.map((id) => new ObjectId(id)),
        },
      })
    }

    await Promise.allSettled([
      deleteManyFromCollection('microgreen'),
      deleteManyFromCollection('sprouts'),
    ])

    return NextResponse.json(
      {
        status: 204,
      },
      corsHeaders
    )
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const dynamic = 'force-dynamic'
