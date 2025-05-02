import { sample } from 'effector';
import { getGreenworldShopByCity, getGreenworldShopByCityFx, makePayment, makePaymentFx } from '.';

sample({
  clock: getGreenworldShopByCity,
  source: {},
  fn: (_, data) => data,
  target: getGreenworldShopByCityFx,
});

sample({
  clock: makePayment,
  source: {},
  fn: (_, data) => data,
  target: makePaymentFx,
});
