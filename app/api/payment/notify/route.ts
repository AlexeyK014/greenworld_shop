//для того чтобы отправлять данные оплаты юзеру на почту

import { sendMail } from '@/service/mailService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    //принимаем с клиента email, message
    //отправляем в емайл данные о доставке
    await sendMail('Greenworld Shop', reqBody.email, reqBody.message);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
