import clientPromise from '@/lib/mongodb';
import { deleteProduct, getAuthRouteData } from '@/lib/utils/api-routes';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    // полуаем из фун-ии
    const { db, validatedTokenResult } = await getAuthRouteData(clientPromise, req, false);

    if (validatedTokenResult.status !== 200) {
      return NextResponse.json(validatedTokenResult);
    }

    // получаем id юзера которы1 будем удалять
    const id = req.url.split('id=')[1]

    await db.collection('users').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      status: 204,
      id,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
