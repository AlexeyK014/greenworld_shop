import { ICartItem } from './cart'
import { IProduct } from './common'

export interface ILoadOneProductFx {
  productId: string
  category: string
  setSpinner?: (arg0: boolean) => void
  withShowingSizeTable?: boolean
}

export interface IProductSizesItemProps {
  currentSize: [string, boolean]
  selectedSize: string
  setSelectedSize: (arg0: string) => void
  currentCartItems: ICartItem[]
}

export interface IProductCounterProps {
  className: string
  count: number
  initialCount?: number
  totalCount?: number
  setCount: (arg0: number) => void
  increasePrice?: VoidFunction
  decreasePrice?: VoidFunction
  cartItem: ICartItem
  updateCountAsync: boolean
}

export interface IAddToCartBtnProps {
  handleAddToCart: VoidFunction
  addToCartSpinner: boolean
  text: string
  btnDisabled?: boolean
  className?: string
}

export interface IProductCountBySizeProps {
  products: ICartItem[]
  size: string
  withCartIcon?: boolean
}

export interface ILoadProductsByFilterFx {
  limit: number
  offset: number
  category: string
  additionalParam?: string
  isCatalog?: boolean
}

export interface IProducts {
  count: number
  items: IProduct[]
}

export interface ILoadWatchedProductsFx {
  payload: { _id: string; category: string }[]
}
