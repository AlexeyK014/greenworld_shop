import { CustomArrowProps } from 'react-slick'

export interface IProductItemActionBtnProps {
  text: string
  iconClass: string
  callback?: VoidFunction
  withTooltip?: boolean
  marginBottom?: number
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
