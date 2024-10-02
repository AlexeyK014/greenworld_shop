// import { getBestsellerProductsFx } from '@/api/main-page'
import { useLang } from '@/hooks/useLang'
import { useUnit } from 'effector-react'
import React from 'react'
import MainPageSection from './MainPageSection'
import { $bestsellerProducts } from '@/context/goods/state'
import { getBestsellerProductsFx } from '@/context/goods/index'

const BestsellersGoods = () => {
  const goods = useUnit($bestsellerProducts)
  console.log(goods)
  const spinner = useUnit(getBestsellerProductsFx.pending)
  const { lang, translations } = useLang()

  return (
    <MainPageSection
      title={translations[lang].main_page.bestsellers_title}
      goods={goods}
      spinner={spinner}
    />
  )
}

export default BestsellersGoods
