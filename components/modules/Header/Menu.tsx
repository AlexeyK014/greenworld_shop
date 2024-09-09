import { AllowedLangs } from '@/constants/lang'
import { setLang } from '@/context/lang'
import { $menuIsOpen, closeMenu } from '@/context/modals'
import { useLang } from '@/hooks/useLang'
import { removeOverflowHiddenFromBody } from '@/lib/utils/common'
import { useUnit } from 'effector-react'
import React, { useState } from 'react'
import Logo from '../../elements/Logo/logo'
import { AnimatePresence, motion } from 'framer-motion'
import Accordion from '../Accordion/Accordion'
import { usePathname } from 'next/navigation'
import MenuLinkItem from './MenuLinkItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import BuyersListItems from './BuyersListItems'
import ContactsListItems from './ContactsListItems'

const Menu = () => {
  // id 0 - ничего непоказывает
  const [activeListId, setActiveListId] = useState(0)

  const { lang, translations } = useLang()
  const pathname = usePathname()

  const menuIsOpen = useUnit($menuIsOpen)

  const isMedia800 = useMediaQuery(800)
  const isMedia640 = useMediaQuery(640)

  // переключение языка
  const handleSwitchLang = (lang: string) => {
    setLang(lang as AllowedLangs)
    localStorage.setItem('lang', JSON.stringify(lang))
  }

  const handleSwitchLangToRu = () => handleSwitchLang('ru')
  const handleSwitchLangToEn = () => handleSwitchLang('en')

  const handleShowCatalogList = () => setActiveListId(1)
  const handleShowBuyersList = () => setActiveListId(2)
  const handleShowContactsList = () => setActiveListId(3)

  const handleCloseMenu = () => {
    removeOverflowHiddenFromBody()
    closeMenu()
    setActiveListId(0)
  }

  const handleRedirectToCatalog = (path: string) => {
    // если pathname содержит 'catalog', делаем обновление с помощью объекта window
    if (pathname.includes('/catalog')) {
      window.history.pushState({ path }, '', path)
      window.location.reload()
    }

    handleCloseMenu()
  }

  const microgreenLinks = [
    {
      id: 1,
      text: translations[lang].comparison.peas,
      href: '/catalog/microgreen?offset=0&type=peas',
    },
    {
      id: 2,
      text: translations[lang].comparison.radish,
      href: '/catalog/microgreen?offset=0&type=radish',
    },
    {
      id: 3,
      text: translations[lang].comparison.cabbage,
      href: '/catalog/microgreen?offset=0&type=cabbage',
    },
    {
      id: 4,
      text: translations[lang].comparison.sunflower,
      href: '/catalog/microgreen?offset=0&type=sunflower',
    },
    {
      id: 5,
      text: translations[lang].comparison.arugulas,
      href: '/catalog/microgreen?offset=0&type=arugulas',
    },
  ]

  const sproutsLinks = [
    {
      id: 1,
      text: translations[lang].comparison.peas,
      href: '/catalog/sprouts?offset=0&type=peas',
    },
    {
      id: 2,
      text: translations[lang].comparison.radish,
      href: '/catalog/sprouts?offset=0&type=radish',
    },
    {
      id: 3,
      text: translations[lang].comparison.chickpeas,
      href: '/catalog/sprouts?offset=0&type=chickpeas',
    },
    {
      id: 4,
      text: translations[lang].comparison.sunflower,
      href: '/catalog/sprouts?offset=0&type=sunflower',
    },
    {
      id: 5,
      text: translations[lang].comparison.arugulas,
      href: '/catalog/sprouts?offset=0&type=arugulas',
    },
  ]

  const seedsLinks = [
    {
      id: 1,
      text: translations[lang].comparison.peas,
      href: '/catalog/seeds?offset=0&type=peas',
    },
    {
      id: 2,
      text: translations[lang].comparison.radish,
      href: '/catalog/seeds?offset=0&type=promotional-souvenirs',
    },
    {
      id: 3,
      text: translations[lang].comparison.chickpeas,
      href: '/catalog/seeds?offset=0&type=chickpeas',
    },
    {
      id: 4,
      text: translations[lang].comparison.sunflower,
      href: '/catalog/seeds?offset=0&type=sunflower',
    },
    {
      id: 5,
      text: translations[lang].comparison.arugulas,
      href: '/catalog/seeds?offset=0&type=arugulas',
    },
  ]

  const equipmentsLinks = [
    {
      id: 1,
      text: translations[lang].comparison.box,
      href: '/catalog/equipment?offset=0&type=box',
    },
    {
      id: 2,
      text: translations[lang].comparison.lamps,
      href: '/catalog/equipment?offset=0&type=lamps',
    },
    {
      id: 3,
      text: translations[lang].comparison.shelf,
      href: '/catalog/equipment?offset=0&type=shelf',
    },
    {
      id: 2,
      text: translations[lang].comparison.agrovata,
      href: '/catalog/equipment?offset=0&type=agrovata',
    },
  ]

  return (
    <nav className={`nav-menu ${menuIsOpen ? 'open' : 'close'}`}>
      <div className='container nav-menu__container'>
        <div className={`nav-menu__logo ${menuIsOpen ? 'open' : ''}`}>
          <Logo />
        </div>
        <button
          className={`btn-reset nav-menu__close ${menuIsOpen ? 'open' : ''}`}
          onClick={handleCloseMenu}
        />
        <div className={`nav-menu__lang ${menuIsOpen ? 'open' : ''}`}>
          <button
            className={`btn-reset nav-menu__lang__btn ${
              lang === 'ru' ? 'lang-active' : ''
            }`}
            onClick={handleSwitchLangToRu}
          >
            RU
          </button>
          <button
            className={`btn-reset nav-menu__lang__btn ${
              lang === 'en' ? 'lang-active' : ''
            }`}
            onClick={handleSwitchLangToEn}
          >
            EN
          </button>
        </div>
        <ul className={`list-reset nav-menu__list ${menuIsOpen ? 'open' : ''}`}>
          {!isMedia800 && (
            <li className='nav-menu__list__item'>
              <button
                className='btn-reset nav-menu__list__item__btn'
                onMouseEnter={handleShowCatalogList}
              >
                {translations[lang].main_menu.catalog}
              </button>
              <AnimatePresence>
                {activeListId === 1 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='list-reset nav-menu__accordion'
                  >
                    <li className='nav-menu__accordion__item'>
                      <Accordion
                        title={translations[lang].main_menu.microgreen}
                        titleClass='btn-reset nav-menu__accordion__item__title'
                      >
                        <ul className='list-reset nav-menu__accordion__item__list'>
                          {microgreenLinks.map((item) => (
                            <MenuLinkItem
                              key={item.id}
                              item={item}
                              handleRedirectToCatalog={handleRedirectToCatalog}
                            />
                          ))}
                        </ul>
                      </Accordion>
                    </li>
                    <li className='nav-menu__accordion__item'>
                      <Accordion
                        title={translations[lang].main_menu.sprouts}
                        titleClass='btn-reset nav-menu__accordion__item__title'
                      >
                        <ul className='list-reset nav-menu__accordion__item__list'>
                          {sproutsLinks.map((item) => (
                            <MenuLinkItem
                              key={item.id}
                              item={item}
                              handleRedirectToCatalog={handleRedirectToCatalog}
                            />
                          ))}
                        </ul>
                      </Accordion>
                    </li>
                    <li className='nav-menu__accordion__item'>
                      <Accordion
                        title={translations[lang].main_menu.seeds}
                        titleClass='btn-reset nav-menu__accordion__item__title'
                      >
                        <ul className='list-reset nav-menu__accordion__item__list'>
                          {seedsLinks.map((item) => (
                            <MenuLinkItem
                              key={item.id}
                              item={item}
                              handleRedirectToCatalog={handleRedirectToCatalog}
                            />
                          ))}
                        </ul>
                      </Accordion>
                    </li>
                    <li className='nav-menu__accordion__item'>
                      <Accordion
                        title={translations[lang].main_menu.equipment}
                        titleClass='btn-reset nav-menu__accordion__item__title'
                      >
                        <ul className='list-reset nav-menu__accordion__item__list'>
                          {equipmentsLinks.map((item) => (
                            <MenuLinkItem
                              key={item.id}
                              item={item}
                              handleRedirectToCatalog={handleRedirectToCatalog}
                            />
                          ))}
                        </ul>
                      </Accordion>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          )}
          <li className='nav-menu__list__item'>
            {!isMedia640 && (
              <button
                className='btn-reset nav-menu__list__item__btn'
                onMouseEnter={handleShowBuyersList}
              >
                {translations[lang].main_menu.buyers}
              </button>
            )}
            {!isMedia640 && (
              <AnimatePresence>
                {activeListId === 2 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='list-reset nav-menu__accordion'
                  >
                    <BuyersListItems />
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
            {isMedia640 && (
              <Accordion
                title={translations[lang].main_menu.buyers}
                titleClass='btn-reset nav-menu__list__item__btn'
              >
                <ul className='list-reset nav-menu__accordion__item__list'>
                  <BuyersListItems />
                </ul>
              </Accordion>
            )}
          </li>
          <li className='nav-menu__list__item'>
            {!isMedia640 && (
              <button
                className='btn-reset nav-menu__list__item__btn'
                onMouseEnter={handleShowContactsList}
              >
                {translations[lang].main_menu.contacts}
              </button>
            )}
            {!isMedia640 && (
              <AnimatePresence>
                {activeListId === 3 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='list-reset nav-menu__accordion'
                  >
                    <ContactsListItems />
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
            {isMedia640 && (
              <Accordion
                title={translations[lang].main_menu.contacts}
                titleClass='btn-reset nav-menu__list__item__btn'
              >
                <ul className='list-reset nav-menu__accordion__item__list'>
                  <ContactsListItems />
                </ul>
              </Accordion>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Menu
