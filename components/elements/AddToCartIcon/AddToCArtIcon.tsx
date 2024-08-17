import { IAddToCartIconProps } from '@/types/elements'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const AddToCArtIcon = ({
  isProductInCart,
  addedClassName,
  className,
  addToCartSpinner,
  callback,
}: IAddToCartIconProps) => (
  <>
    {/* если продукт в корзине, показываем иконку иначе показываем кнопку с помощью которой добавляем в корзину */}
    {isProductInCart ? (
      <span className={`${className} ${addedClassName}`} />
    ) : (
      <button className={`btn-reset ${className}`} onClick={callback}>
        {addToCartSpinner ? (
          <FontAwesomeIcon icon={faSpinner} spin color='#fff' />
        ) : (
          <span />
        )}
      </button>
    )}
  </>
)

export default AddToCArtIcon
