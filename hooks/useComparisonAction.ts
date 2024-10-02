import { IProduct } from '@/types/common'
import { useState } from 'react'
import { useGoodsByAuth } from './useGoodsByAuth'
import { isUserAuth } from '@/lib/utils/common'
import { addComparisonItemToLs } from '@/lib/utils/comparison'
import toast from 'react-hot-toast'
import { addProductToComparison } from '@/context/comparison/index'
import { $comparison, $comparisonFromLS } from '@/context/comparison/state'

export const useComparisonAction = (product: IProduct) => {
  const [addToComparisonSpinner, setAddToComparisonSpinner] = useState(false)
  const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS)

  // проверка есть ли товары в сравнение
  // ищем в массиве currentComparisonByAuth
  const isProductInComparison = currentComparisonByAuth.some(
    (item) => item.productId === product._id
  )

  // фун-я добавление товара в сравнение
  const handleAddToComparison = () => {
    if (!isUserAuth()) {
      addComparisonItemToLs(product)
      return
    }

    if (isProductInComparison) {
      toast.success('Добавлено в сравнение!')
      return
    }

    const auth = JSON.parse(localStorage.getItem('auth') as string)
    const clientId = addComparisonItemToLs(product, false)

    addProductToComparison({
      jwt: auth.accessToken,
      productId: product._id,
      setSpinner: setAddToComparisonSpinner,
      category: product.category,
      clientId,
    })
  }

  return {
    handleAddToComparison,
    addToComparisonSpinner,
    isProductInComparison,
  }
}
