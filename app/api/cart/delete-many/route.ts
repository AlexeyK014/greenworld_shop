import clientPromise from '@/lib/mongodb';
import { getAuthRouteData, parseJwt } from '@/lib/utils/api-routes';
import { NextResponse } from 'next/server';

//для удаление товаров корзины
export async function DELETE(req: Request) {
  try {
    const { db, validatedTokenResult, token } = await getAuthRouteData(clientPromise, req, false);

    if (validatedTokenResult.status !== 200) {
      return NextResponse.json(validatedTokenResult);
    }

    // парсим jwt-токен, таким образом находим юзера
    const user = await db.collection('users').findOne({ email: parseJwt(token as string).email });

    //обращаемся к коллекции 'cart', вызываем к deleteMany и удаляем те товары у которых есть userId этого user
    await db.collection('cart').deleteMany({ userId: user?._id });

    return NextResponse.json({ status: 204 });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
