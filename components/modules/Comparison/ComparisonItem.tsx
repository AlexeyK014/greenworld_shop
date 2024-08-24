/* eslint-disable prettier/prettier */
import { IComparisonItem } from '@/types/comparison'
import styles from '@/styles/comparison/index.module.scss'
import { motion } from 'framer-motion'
import { basePropsForMotion } from '@/constants/motion'
import DeleteItemBtn from '@/components/elements/DeleteCartItemBtn/DeleteCartItemBtn'
import AddToCArtIcon from '@/components/elements/AddToCartIcon/AddToCArtIcon'
import Image from 'next/image'
import { useProductDelete } from '@/hooks/useProductDelete'
import {
  deleteProductFromComparison,
  setComparisonFromLS,
  setShouldShowEmptyComparison,
} from '@/context/comparison'
import { deleteProductFromLS, isUserAuth } from '@/lib/utils/common'
import { productsWithoutSizes } from '@/constants/product'
import { addCartItemToLS } from '@/lib/utils/cart'
import { IProduct } from '@/types/common'
import { useMemo, useState } from 'react'
import { $cart, $cartFromLs, addProductToCart } from '@/context/cart'
import { loadOneProduct } from '@/context/goods'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'

const ComparisonItem = ({ item }: { item: IComparisonItem }) => {
  const currentCartByAuth = useGoodsByAuth($cart, $cartFromLs)

  const [addToCartSpinner, setAddToCartSpinner] = useState(false)
  const [loadProductSpinner, setLoadProductSpinner] = useState(false)
  const { handleDelete, deleteSpinner } = useProductDelete(
    item._id,
    deleteProductFromComparison
  )

  // если товар без размера, ищем по условию на id, без проверки на размер
  // иначе, образаемся к массиву товаров из корзины, получаем cartItem
  // и сравниваем равен ли cartItem.productId и item.productId(из сравнения)
  // чтобы понимать находится ли такой размер у этого товара преобразовываем объект(item.sizes) в массив
  const isProductInCart = useMemo(
    () =>
      productsWithoutSizes.includes(item.characteristics.type)
        ? currentCartByAuth.find(
          (cartItem) => cartItem.productId === item.productId
        )
        : currentCartByAuth.find(
          (cartItem) =>
            cartItem.productId === item.productId &&
              Object.entries(item.sizes)
                .filter(([, value]) => value)
                .map(([key]) => key) // проверяем что нужный товар из сравнения находится и в корзине
                .includes(cartItem.size)
        ),
    [currentCartByAuth, item.characteristics.type, item.productId, item.sizes]
  )

  const addToCart = () => {
    // проверка, добавлени ли товар БЕЗ РАЗМЕРА
    if (productsWithoutSizes.includes(item.characteristics.type)) {
      // тогда добавляем товар не вызывая Таблицу размеров
      const product = {
        ...item, // разворачиваем comparisonItem
        _id: item.productId, // добавляем поле id с картинкой
        images: [item.image],
      } as unknown as IProduct

      if (!isUserAuth()) {
        addCartItemToLS(product, '', 1)
        return
      }

      // получаем данные из LS
      const auth = JSON.parse(localStorage.getItem('auth') as string)

      // создаём переменную, вызывая фун-ю добавления в LS
      const clientId = addCartItemToLS(product, '', 1, false)

      addProductToCart({
        jwt: auth.accessToken,
        setSpinner: setAddToCartSpinner,
        productId: item.productId,
        category: item.category,
        count: 1,
        size: '',
        clientId,
      })
      return
    }

    // добавление товара С РАЗМЕРОМ
    loadOneProduct({
      productId: item.productId, // для образения к коллекции на БД
      category: item.category,
      withShowingSizeTable: true, // чтобы появилась модалка с таблицей размеров
      setSpinner: setLoadProductSpinner,
    })
  }

  const handleDeleteComparisonItem = () => {
    if (!isUserAuth()) {
      deleteProductFromLS(
        item.clientId,
        'comparison',
        setComparisonFromLS,
        setShouldShowEmptyComparison,
        'Удалено из сравнения!'
      )
      return
    }
    handleDelete()
    deleteProductFromLS(
      item.clientId,
      'comparison',
      setComparisonFromLS,
      setShouldShowEmptyComparison,
      '',
      false
    )
  }

  return (
    <motion.li
      className={styles.comparison__list__item}
      {...basePropsForMotion}
    >
      <DeleteItemBtn
        btnDisabled={deleteSpinner}
        callback={handleDeleteComparisonItem}
        className={styles.comparison__list__item__delete}
      />

      {/* компонент добавления в корзину */}
      <AddToCArtIcon
        isProductInCart={!!isProductInCart} // значение, добавлен ли элемент в корзину или нет
        addToCartSpinner={addToCartSpinner || loadProductSpinner}
        callback={addToCart}
        className={styles.comparison__list__item__cart}
        addedClassName={styles.comparison__list__item__cart_added}
      />

      {/* блок для картинки */}
      <div className={styles.comparison__list__item__img}>
        <Image src={item.image} alt={item.name} width={160} height={160} />
      </div>

      {/* список с характеристиками */}
      <ul className={`list-reset ${styles.comparison__list__item__inner_list}`}>
        {/* преобразуем массив */}
        {Object.entries(item.characteristics).map(([key, value], i) => {
          // value - может быть boolean или массив
          // если массив - достаём из массив и перечисляем чурез запятую
          let valueFromArray = null
          let valueByBool = null

          if (Array.isArray(value)) {
            valueFromArray = value.join(', ')
          }

          if (typeof value == 'boolean') {
            if (value) {
              valueByBool = 'Есть'
            } else {
              valueByBool = 'Нет'
            }
          }

          return (
            <li
              key={i}
              className={styles.comparison__list__item__inner_list__item}
            >
              {/* название хар-ки */}
              <span>{key}</span>

              {/* значение хар-ки */}
              <span>{valueByBool || valueFromArray || value}</span>
            </li>
          )
        })}
      </ul>
    </motion.li>
  )
}

export default ComparisonItem
