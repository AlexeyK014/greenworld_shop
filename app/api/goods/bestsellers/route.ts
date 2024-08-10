//  возвращаем бестселлеры

import clientPromise from '@/lib/mongodb'
import {
  getDbAndReqBody,
  getNewAndBestsellerGoods,
} from '@/lib/utils/api-routes'
import { NextResponse } from 'next/server'

export async function GET() {
  // получае доступ к базе данных
  const { db } = await getDbAndReqBody(clientPromise, null)

  return NextResponse.json(await getNewAndBestsellerGoods(db, 'isBestseller'))
}
