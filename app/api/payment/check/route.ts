//для проерке успешности оплаты

import axios from 'axios';
import { NextResponse } from 'next/server';

//reqBody получаем сумму к покупки

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    //получаем поле data
    const { data } = await axios({
      method: 'get',
      url: `https://api.yookassa.ru/v3/payments/${reqBody.paymentId}`,
      auth: {
        username: '487368',
        password: 'test_n7CH4KsBHhMAvRRDMnopHYwILrKKttDOrhfXYX1_BC0',
      },
    });

    return NextResponse.json({ result: data });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
