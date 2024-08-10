'use client'
import React from 'react'
import Hero from '../../modules/MainPage/Hero/Hero'
import Categories from '@/components/modules/MainPage/Categories/Categories'
import { useGate } from 'effector-react'
import { MainPageGate } from '@/context/goods'
import BestsellersGoods from '@/components/modules/MainPage/BestsellersGoods'
import NewGoods from '@/components/modules/MainPage/NewGoods'
import BrandLife from '@/components/modules/MainPage/BrandLife'
import { usePageTitle } from '@/hooks/usePageTitle'

const MainPage = () => {
  useGate(MainPageGate)
  usePageTitle('main')

  return (
    <main>
      <Hero />
      <Categories />
      <NewGoods />
      <BestsellersGoods />
      <BrandLife />
    </main>
  )
}

export default MainPage
