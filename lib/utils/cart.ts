/* eslint-disable indent */
import { ICartItem } from '@/types/cart'
import { IProduct } from '@/types/common'
import { handleShowSizeTable, idGenerator, isUserAuth } from './common'
import toast from 'react-hot-toast'
import {
  addProductToCart,
  setCartFromLS,
  setShouldShowEmpty,
} from '@/context/cart'
import { productsWithoutSizes } from '@/constants/product'

// добавление товара в корзину с запросом на сервер
export const addItemToCart = (
  product: IProduct,
  setSpinner: (arg0: boolean) => void,
  count: number,
  selectedSize = ''
) => {
  // если не авторизован, просто добавляем товар в LS на клиенте
  if (!isUserAuth()) {
    addCartItemToLS(product, selectedSize, count)
    return
  }

  // если авторизован, получаем токен из LS
  const auth = JSON.parse(localStorage.getItem('auth') as string)

  // добавляем товар в LS на клиенте
  const clientId = addCartItemToLS(product, selectedSize, count, false)
  addProductToCart({
    jwt: auth.accessToken, // чтобы найти юзера и прикрепить id
    setSpinner,
    productId: product._id,
    category: product.category,
    count,
    size: selectedSize,
    clientId,
  })
}

// добавление товара в ЛС
export const addCartItemToLS = (
  product: IProduct,
  selectedSize: string,
  count: number,
  withToast = true
) => {
  // получение товаров которые были добавлены прежде в ЛС
  let cartFromLS: ICartItem[] = JSON.parse(
    // получаем массив под ключом cart
    localStorage.getItem('cart') as string
  )
  // генерируем уникальный id для каждого товара в корзине
  const clientId = idGenerator()

  //проверяем, если ничего нет в ЛС - присваеваем пустой массив
  if (!cartFromLS) {
    cartFromLS = []
  }
  setShouldShowEmpty(false)

  /////// если товар уже существует в корзине, тогда увеличиваем его counts  ////////////
  const existingItem = cartFromLS.find(
    (item) => item.productId === product._id && item.size === selectedSize
  )

  // условие обновления count в ЛС
  if (existingItem) {
    // если существующий count не равен тому count который поступает к нам
    const updatedCountWithSize =
      existingItem.count !== count ? count : +existingItem.count + 1

    // проходимся по корзине методом map
    // ищем нужный товар, если товар найдем обновляем count иначе пропускам item
    const updatedCart = cartFromLS.map((item) =>
      item.productId === existingItem.productId && item.size === selectedSize
        ? {
            ...existingItem,
            count: selectedSize.length
              ? updatedCountWithSize // делаем проверкку, если был выбран размер то устанавливаем обновлённую переменную
              : +existingItem.count + 1,
          }
        : item
    )

    // устанавливаем обновлённую корзину в LS с обновлённым count
    // обновляем state
    // возвращаем id товара(existingItem.clientId)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartFromLS(updatedCart)
    toast.success('Добавлено в корзину')
    return existingItem.clientId
  }

  ///////////  если товара не было в корзине  //////////////////
  const cart = [
    // создаём новый массив, разворачиваем туда предыдущие item
    ...cartFromLS,
    {
      clientId,
      productId: product._id,
      size: selectedSize,
      count,
      image: product.images[0],
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      category: product.category,
      color: product.characteristics.color,
    },
  ]
  localStorage.setItem('cart', JSON.stringify(cart))
  setCartFromLS(cart as ICartItem[])
  withToast && toast.success('Добавлено в корзину')
  return clientId
}

// добавление товаров в корзину согласно таблице размеров
export const addProductToCartBySizeTable = (
  product: IProduct,
  setSpinner: (arg0: boolean) => void,
  count: number,
  selectedSize = ''
) => {
  // если это товар у которого нет размера,
  // тогда сразу его добавляем в корину без вызова таблицы размеров
  if (productsWithoutSizes.includes(product.type)) {
    addItemToCart(product, setSpinner, count)
    return
  }

  if (selectedSize) {
    addItemToCart(product, setSpinner, count, selectedSize)
    return
  }

  handleShowSizeTable(product)
}

export const updateCartItemCountInLS = (cartItemId: string, count: number) => {
  let cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') as string)

  if (!cart) {
    cart = []
  }

  // обновляем count по cartItemId
  const updatedCart = cart.map((item) =>
    item.clientId === cartItemId ? { ...item, count } : item
  )

  localStorage.setItem('cart', JSON.stringify(updatedCart))
  setCartFromLS(updatedCart as ICartItem[])
}

// фун-я для подсчёта общего кол-ва товара в корзине
export const countWholeCartItemsAmount = (cart: ICartItem[]) =>
  cart.reduce((defaultCount, item) => defaultCount + +item.count, 0)
