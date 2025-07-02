export const dynamic = 'force-dynamic';

import clientPromise from '@/lib/mongodb';
import { getDbAndReqBody, getNews } from '@/lib/utils/api-routes';
import { NextResponse } from 'next/server';

export async function GET() {
  // получае доступ к базе данных
  const { db } = await getDbAndReqBody(clientPromise, null);
  const news = await getNews(db)
  return new NextResponse(JSON.stringify(news), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
}
