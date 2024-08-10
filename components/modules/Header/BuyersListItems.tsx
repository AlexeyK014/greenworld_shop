import { useLang } from '@/hooks/useLang'
import Link from 'next/link'
import React from 'react'

const BuyersListItems = () => {
  const { lang, translations } = useLang()
  return (
    <>
      <li className='nav-menu__accordion__item'>
        <Link href='/about' className='nav-menu__accordion__item__link'>
          {translations[lang].main_menu.about}
        </Link>
      </li>
      <li className='nav-menu__accordion__item'>
        <Link href='/blog' className='nav-menu__accordion__item__link'>
          {translations[lang].main_menu.blog}
        </Link>
      </li>
      <li className='nav-menu__accordion__item'>
        <Link
          href='/purchase-returns'
          className='nav-menu__accordion__item__link'
        >
          {translations[lang].main_menu.returns}
        </Link>
      </li>
    </>
  )
}

export default BuyersListItems
