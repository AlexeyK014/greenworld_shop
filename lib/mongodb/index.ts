import { MongoClient } from 'mongodb'

//  из mongodb импортируем класс MongoClient, из него создаём инстанс. передаём URL
const clientPromise = MongoClient.connect(
  process.env.NEXT_PUBLIC_DB_URL as string,
  {
    maxPoolSize: 10,
  }
)

export default clientPromise
