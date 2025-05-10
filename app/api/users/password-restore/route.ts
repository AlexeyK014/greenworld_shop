import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req) // получаем доступ к body
    const user = await db.collection('users').findOne({ email: reqBody.email }) // по email находим юзера
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(reqBody.password, salt)

    await db.collection('users').updateOne(
      {
        _id: new ObjectId(user?._id)
      },
      {
        $set: {
          password: hash //сохраняем новый пароль
        }
      }
    )

    return NextResponse.json({ status: 200 })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
