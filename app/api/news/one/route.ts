// получаем саму новость с базы данных
import clientPromise from '@/lib/mongodb';
import { getDbAndReqBody } from '@/lib/utils/api-routes';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req);
    const isValidId = ObjectId.isValid(reqBody.newsId);

    if (!isValidId) {
      return NextResponse.json({
        message: 'Wrong news id',
        status: 404,
      });
    }

    const newsItem = await db
      .collection('news')
      .findOne({ _id: new ObjectId(reqBody.newsId) });

    return NextResponse.json({
      status: 200, newsItem,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
