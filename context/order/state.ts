'use client';

import { IGreenworldAddressData, IOrderDetailsValues } from '@/types/order';
import {
  getGreenworldShopByCityFx,
  order,
  setCashPaymentTb,
  setChosenCourierAdressData,
  setChosenPickupAdressData,
  setCourierAdressData,
  setCourierTab,
  setMapInstance,
  setOnlinePaymentTb,
  setOrderDetailsValues,
  setPickupTab,
  setShouldLoadGreenworldData,
  setShouldShowCourierAdressData,
} from '.';

export const $greenworldDataByCity = order
  .createStore<IGreenworldAddressData[]>([])
  .on(getGreenworldShopByCityFx.done, (_, { result }) => result);

export const $pickupTab = order.createStore<boolean>(true).on(setPickupTab, (_, value) => value);

export const $courierTab = order.createStore<boolean>(false).on(setCourierTab, (_, value) => value);

export const $mapInstance = order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .createStore<any>({})
  .on(setMapInstance, (_, map) => map);

export const $shouldLoadGreenworldData = order
  .createStore(false)
  .on(setShouldLoadGreenworldData, (_, value) => value);

export const $chosenPickupAdressData = order
  .createStore<Partial<IGreenworldAddressData>>({})
  .on(setChosenPickupAdressData, (_, value) => value);

export const $chosenCourierAdressData = order
  .createStore<Partial<IGreenworldAddressData>>({})
  .on(setChosenCourierAdressData, (_, value) => value);

export const $shouldShowCourierAdressData = order
  .createStore(false)
  .on(setShouldShowCourierAdressData, (_, value) => value);

export const $courierAdressData = order
  .createStore<IGreenworldAddressData>({} as IGreenworldAddressData)
  .on(setCourierAdressData, (_, value) => value);

export const $onlinePaymentTab = order
  .createStore<boolean>(true)
  .on(setOnlinePaymentTb, (_, value) => value);

export const $cashPaymentTab = order
  .createStore<boolean>(false)
  .on(setCashPaymentTb, (_, value) => value);

export const $orderDetailsValues = order
  .createStore<IOrderDetailsValues>({} as IOrderDetailsValues)
  .on(setOrderDetailsValues, (_, value) => value);
