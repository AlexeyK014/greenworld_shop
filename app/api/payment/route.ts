import clientPromise from '@/lib/mongodb';
import { getAuthRouteData } from '@/lib/utils/api-routes';
import axios from 'axios';
import { NextResponse } from 'next/server';

//reqBody получаем сумму к покупки

export async function POST(req: Request) {
  try {
    // полуаем из фун-ии
    const { validatedTokenResult, reqBody } = await getAuthRouteData(clientPromise, req);

    // проверка токена на валидацию
    if (validatedTokenResult.status !== 200) {
      return NextResponse.json(validatedTokenResult);
    }

    //получаем поле data
    const { data } = await axios({
      method: 'post',
      url: 'https://api.yookassa.ru/v3/payments',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': Date.now(),
      },
      auth: {
        username: '487368', // id магазина из личного кабинета
        password: 'test_n7CH4KsBHhMAvRRDMnopHYwILrKKttDOrhfXYX1_BC0',
      },
      data: {
        amount: {
          value: reqBody.amount,
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: 'https://greenworld-shop.vercel.app/payment-success',
        },
        description: reqBody.description,
        metadata: reqBody.metadata,
      },
    });

    return NextResponse.json({ result: data });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
