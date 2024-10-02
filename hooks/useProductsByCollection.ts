/* eslint-disable prettier/prettier */

import { capitalizeFirstLetter } from '@/lib/utils/common'
import { useLang } from './useLang'
import { loadProductsByFillterFx } from '@/context/goods/index'
import { useUnit } from 'effector-react'
import { $products } from '@/context/goods/state'

export const useProductsByCollection = (collection: string) => {
  const products = useUnit($products)
  const spinner = useUnit(loadProductsByFillterFx.pending)
  const { lang, translations } = useLang()
  const langText = translations[lang].product.collection_goods
  const capitalizeCollection = capitalizeFirstLetter(collection)
  const title =
    lang === 'ru'
      ? `${langText} «${capitalizeCollection}»`
      : [
        langText.slice(0, 17),
        ` «${capitalizeCollection}»`,
        langText.slice(17),
      ].join('')

  return { title, capitalizeCollection, products, spinner }
}
