// получаем торы корзины только для определённого пользователя - по userId

import clientPromise from '@/lib/mongodb'
import { getDataFromDBByCollection } from '@/lib/utils/api-routes'

export async function GET(req: Request) {
  try {
    // вызываем фун-ю, передаём коллекцию cart, получаем товары корзины данного пользователя
    return getDataFromDBByCollection(clientPromise, req, 'cart')
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
