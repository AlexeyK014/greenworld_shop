'use client'
import {
  closeCatalogMenu,
  closeMenu,
  openCatalogMenu,
  openMenu,
  // openProfile,
} from '@/context/modals'
import { useLang } from '@/hooks/useLang'
import { addOverflowHiddenToBody } from '@/lib/utils/common'
import Link from 'next/link'
import React from 'react'
import CatalogMenu from '../Header/CatalogMenu'
import { $cart, $cartFromLs } from '@/context/cart'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import { $favorites, $favoritesFromLS } from '@/context/favorites'
// import Profile from '../Profile/Profile'

const MobileNavbar = () => {
  const { lang, translations } = useLang()
  const currentCartByAuth = useGoodsByAuth($cart, $cartFromLs)
  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS)

  const handleOpenMenu = () => {
    addOverflowHiddenToBody()
    openMenu()
    closeCatalogMenu()
  }

  const handleOpenCatalogMenu = () => {
    addOverflowHiddenToBody('0')
    openCatalogMenu()
    closeMenu()
  }

  // const handleOpenProfile = () => {
  //   addOverflowHiddenToBody()
  //   openProfile()
  //   closeMenu()
  // }

  return (
    <>
      <CatalogMenu />
      {/* <Profile /> */}
      <div className='mobile-navbar'>
        <Link href='/' className='mobile-navbar__btn'>
          {translations[lang].breadcrumbs.main}
        </Link>
        <button
          className='btn-reset mobile-navbar__btn'
          onClick={handleOpenCatalogMenu}
        >
          {translations[lang].breadcrumbs.catalog}
        </button>
        <Link href='/favorites' className='btn-reset mobile-navbar__btn'>
          {!!currentFavoritesByAuth.length && (
            <span className='not-empty not-empty-mobile-favorite' />
          )}
          {translations[lang].breadcrumbs.favorites}
        </Link>
        <Link href='/cart' className='btn-reset mobile-navbar__btn'>
          {!!currentCartByAuth.length && (
            <span className='not-empty not-empty-mobile' />
          )}
          {translations[lang].breadcrumbs.cart}
        </Link>
        <button
          className='btn-reset mobile-navbar__btn'
          onClick={handleOpenMenu}
        >
          {translations[lang].common.more}
        </button>
      </div>
    </>
  )
}

export default MobileNavbar
