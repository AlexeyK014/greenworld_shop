import { IDeleteCartItembtnProps } from '@/types/cart'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const DeleteCartItemBtn = ({
  btnDisabled, // дизайбл кнопки между запросом и удалением
  callback,
  className,
}: IDeleteCartItembtnProps) => (
  <button
    className={`btn-reset cart-list__item__delete ${className}`}
    onClick={callback}
    disabled={btnDisabled}
  >
    {btnDisabled ? (
      <FontAwesomeIcon icon={faSpinner} spin color='fff' />
    ) : (
      <span />
    )}
  </button>
)

export default DeleteCartItemBtn
