import { CustomArrowProps } from 'react-slick'

export interface IProductItemActionBtnProps {
  text: string
  iconClass: string
  callback?: VoidFunction
  withTooltip?: boolean
  marginBottom?: number
  spinner?: boolean
}

export interface IProductAvailableProps {
  vendorCode: string
  inStock: number
}

export interface IQuickViewModalSliderArrowProps extends CustomArrowProps {
  directionClassName: string
}

export interface IHeadingWithCount {
  count: number
  title: string
  spinner?: boolean
}

export interface IAddToCartIconProps {
  isProductInCart: boolean
  addedClassName: string
  className: string
  addToCartSpinner: boolean
  callback: VoidFunction
}
