import { IBaseEffectProps, ISizes } from './common';

export interface IAddProductToComparisonFx {
  productId: string;
  category: string;
  jwt: string;
  clientId: string;
  setSpinner: (arg0: boolean) => void;
}

export interface IImage {
  url: string;        // ссылка на картинку
  desc?: string;      // опционально: подпись/описание
}

export interface IComparisonItem {
  _id: string;
  userId: string;
  clientId: string;
  productId: string;
  image: string |  IImage;
  name: string;
  sizes: ISizes;
  size: string;
  price: string;
  category: string;
  inStock: string;
  characteristics: { [index: string]: string };
}

export interface IAddProductsFromLSToComparisonFx {
  jwt: string;
  comparisonItems: IComparisonItem[];
}

export interface IComparisonLinksListProps {
  links: {
    href: string;
    title: string;
    itemsCount: number;
    isActive: boolean;
  }[];
  className?: string;
}

export type IDeleteComparisonItemsFx = IBaseEffectProps;
