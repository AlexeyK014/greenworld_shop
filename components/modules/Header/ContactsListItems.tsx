import { useLang } from '@/hooks/useLang'
import Link from 'next/link'
import React from 'react'

const ContactsListItems = () => {
  const { lang, translations } = useLang()
  return (
    <>
      <li className='nav-menu__accordion__item'>
        <a href='tel:+79134575425' className='nav-menu__accordion__item__link'>
          +7 (913) 457 54 25
        </a>
      </li>
      <li className='nav-menu__accordion__item'>
        <a
          href='mailto:microgreen@.com'
          className='nav-menu__accordion__item__link'
        >
          Email
        </a>
      </li>
      <li className='nav-menu__accordion__item'>
        <Link href='/dvejer' className='nav-menu__accordion__item__link'>
          {translations[lang].main_menu.tg}
        </Link>
      </li>
    </>
  )
}

export default ContactsListItems
