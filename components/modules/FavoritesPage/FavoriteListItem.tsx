import { IFavoriteItem } from '@/types/favorites'
import styles from '@/styles/favorites/index.module.scss'
import { useState } from 'react'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import DeleteItemBtn from '@/components/elements/DeleteCartItemBtn/DeleteCartItemBtn'
import AddToCArtIcon from '@/components/elements/AddToCartIcon/AddToCArtIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Image from 'next/image'
import { useLang } from '@/hooks/useLang'
import {
  deleteProductFromLS,
  formatPrice,
  isUserAuth,
} from '@/lib/utils/common'
import { addCartItemToLS } from '@/lib/utils/cart'
import { IProduct } from '@/types/common'
import {
  deleteProductFromFavorites,
  setFavoritesFromLS,
  setShouldShowEmptyFavorites,
} from '@/context/favorites/index'
import { useProductDelete } from '@/hooks/useProductDelete'
import { addProductToCart } from '@/context/cart/index'
import { $cart, $cartFromLs } from '@/context/cart/state'

const FavoriteListItem = ({ item }: { item: IFavoriteItem }) => {
  // для добавления товара в корзину
  const [addToCartSpinner, setAddToCartSpinner] = useState(false)

  // состояние корзины, чтобы понимать есть ли этот товар уже корзине или нет
  const currentCartByAuth = useGoodsByAuth($cart, $cartFromLs)

  // находим конкретный товар их корзины
  // ищем, есть ли избранный товар в корзине, делая проверку по productId и по размеру
  const isProductInCart = currentCartByAuth.find(
    (cartItem) =>
      cartItem.productId === item.productId && cartItem.size === item.size
  )

  const isMedia485 = useMediaQuery(485)
  const imgSize = isMedia485 ? 132 : 160
  const { lang, translations } = useLang()
  const { handleDelete, deleteSpinner } = useProductDelete(
    item._id || item.clientId,
    deleteProductFromFavorites
  )

  // добавление товара в корзину
  const addToCart = () => {
    // объект товара корзины
    const cartItem = {
      ...item,
      // берём id самого товара, потому что при добавление в корзину мы принимаем product и у него есть id
      _id: item.productId,
      images: [item.image],
      characteristics: { color: item.color },
    }

    // если юзер не авторизован
    if (!isUserAuth()) {
      addCartItemToLS(cartItem as unknown as IProduct, item.size, 1)
      return
    }

    // получаем данные из LS
    const auth = JSON.parse(localStorage.getItem('auth') as string)

    // делаем добавление товара на клиенте
    // и синхронизируемся с сервером
    const clientId = addCartItemToLS(
      cartItem as unknown as IProduct,
      item.size,
      1,
      false
    )

    addProductToCart({
      jwt: auth.accessToken,
      setSpinner: setAddToCartSpinner,
      productId: item.productId,
      category: item.category,
      count: 1,
      size: item.size,
      clientId,
    })
  }

  // удаление из избранного
  const handleDeleteFavorite = () => {
    // если юзер не авторизован
    if (!isUserAuth()) {
      deleteProductFromLS(
        item.clientId,
        'favorites',
        setFavoritesFromLS,
        setShouldShowEmptyFavorites,
        'Удалено из избранного!'
      )
      return
    }

    // если юзер авторизован
    handleDelete()
    // добавляем товар на клиенте
    deleteProductFromLS(
      item.clientId,
      'favorites',
      setFavoritesFromLS,
      setShouldShowEmptyFavorites,
      '',
      false
    )
  }

  return (
    <>
      <DeleteItemBtn
        btnDisabled={deleteSpinner}
        callback={handleDeleteFavorite}
        className={styles.favorites__list__item__delete}
      />
      <AddToCArtIcon
        isProductInCart={!!isProductInCart}
        addToCartSpinner={addToCartSpinner}
        callback={addToCart}
        className={styles.favorites__list__item__cart}
        addedClassName={styles.favorites__list__item__cart_added}
      />

      <div className={styles.favorites__list__item__img}>
        <Image
          src={item.image}
          alt={item.name}
          width={imgSize}
          height={imgSize}
        />
      </div>
      <p className={styles.favorites__list__item__info}>
        <span className={styles.favorites__list__item__info__name}>
          {item.name}
        </span>
        <span className={styles.favorites__list__item__info__size}>
          {/* если товар с размером, показываем размер */}
          {item.size.length
            ? `${translations[lang].catalog.size}: ${item.size.toUpperCase()}`
            : ''}
        </span>
        <span className={styles.favorites__list__item__info__price}>
          {formatPrice(+item.price)} P
        </span>
      </p>
    </>
  )
}

export default FavoriteListItem
