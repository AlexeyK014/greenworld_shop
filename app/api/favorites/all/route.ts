// получаем товары избранное только для определённого пользователя - по userId

import clientPromise from '@/lib/mongodb'
import { getDataFromDBByCollection } from '@/lib/utils/api-routes'

export async function GET(req: Request) {
  try {
    // вызываем фун-ю, передаём коллекцию favorites, получаем товары избранные данного пользователя
    return getDataFromDBByCollection(clientPromise, req, 'favorites')
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
