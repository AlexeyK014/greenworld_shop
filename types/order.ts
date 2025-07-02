import { ICartItem } from './cart';
import { IImage } from './comparison';

export interface IOrderTitleProps {
  orderNumber: string;
  text: string;
}

export interface IOrderCartItemProps {
  item: ICartItem;
  position: number;
  url?: string;
}

export interface IGetGreenworldShopByCityFx {
  city: string;
  lang: string;
}

export interface IGreenworldAddressData {
  address_line1: string;
  address_line2: string;
  city: string;
  place_id: string;
  bbox: IAddressBBox;
  lat: number;
  lon: number;
}

export interface ITabControlsProps {
  handleTab1: VoidFunction;
  handleTab2: VoidFunction;
  tab1Active: boolean;
  tab2Active: boolean;
  tab1Text: string;
  tab2Text: string;
}

export interface IAddressPosition {
  lat: number;
  lon: number;
}

export interface IAddressBBox {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
}

export interface IPickupAddressItemProps {
  addressItem: IGreenworldAddressData;
  handleSelectAddress: (arg0: IAddressBBox, arg1: IAddressPosition) => void;
  handleChosenAddressData: (arg0: Partial<IGreenworldAddressData>) => void;
}

export interface IAddressesListProps {
  listClassName: string;
  handleSelectAdressByMarkers?: (
    arg0: IAddressBBox,
    arg1: IAddressPosition,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg2?: any,
  ) => void;
}

export interface IMakePaymentFx {
  amount: string;
  description: string;
  jwt: string;
  metadata?: IOrderDetailsValues;
}

export interface IPaymentData {
  authorization_details: { rrn: string }; //для отображения номера заказа
  amount: { value: string };
  description: string;
  metadata?: IOrderDetailsValues;
}

export interface IPaymentNotifyFx {
  email: string;
  message: string;
}

export interface IOrderDetailsValues {
  name_label: string;
  surname_label: string;
  phone_label: string;
  email_label: string;
  message_label: string;
  isValid: boolean; // получаем из react-hook-form
}
