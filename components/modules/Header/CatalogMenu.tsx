'use client';

import { useLang } from '@/hooks/useLang';
import { useMenuAnimation } from '@/hooks/useMenuAnimation';
import { removeOverflowHiddenFromBody } from '@/lib/utils/common';
import { useUnit } from 'effector-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Header from './Header';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import CatalogMenuButton from './CatalogMenuButton';
import CatalogMenuList from './CatalogMenuList';
import Accordion from '../Accordion/Accordion';
import Link from 'next/link';
import { closeCatalogMenu } from '@/context/modals/index';
import { $catalogMenuIsOpen } from '@/context/modals/state';

const CatalogMenu = () => {
  const catalogMenuIsOpen = useUnit($catalogMenuIsOpen);

  // id 0 - ничего непоказывает
  const [activeListId, setActiveListId] = useState(0);

  const { lang, translations } = useLang();
  const { itemVariants, sideVariants, popupZIndex } = useMenuAnimation(2, catalogMenuIsOpen);
  const isMedia450 = useMediaQuery(450);

  const handleCloseMenu = () => {
    removeOverflowHiddenFromBody();
    closeCatalogMenu();
    setActiveListId(0);
  };

  const isActiveList = (id: number) => activeListId === id;

  const items = [
    {
      name: translations[lang].main_menu.microgreen,
      id: 1,
      items: [
        {
          title: translations[lang].comparison.peas,
          href: '/catalog/microgreen?offset=0&type=peas',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.radish,
          href: '/catalog/microgreen?offset=0&type=radish',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.cabbage,
          href: '/catalog/microgreen?offset=0&type=cabbage',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.sunflower,
          href: '/catalog/microgreen?offset=0&type=sunflower',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.arugulas,
          href: '/catalog/microgreen?offset=0&type=arugulas',
          handleCloseMenu
        },
      ],
      // при выполнение хэндлера у нас сетится id = 1, для этого списка
      handler: () => setActiveListId(1),
    },
    {
      name: translations[lang].main_menu.sprouts,
      id: 2,
      items: [
        {
          title: translations[lang].comparison.peas,
          href: '/catalog/sprouts?offset=0&type=peas',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.radish,
          href: '/catalog/sprouts?offset=0&type=radish',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.chickpeas,
          href: '/catalog/sprouts?offset=0&type=chickpeas',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.wheat,
          href: '/catalog/sprouts?offset=0&type=sunflower',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.arugulas,
          href: '/catalog/sprouts?offset=0&type=arugulas',
          handleCloseMenu
        },
      ],
      handler: () => setActiveListId(2),
    },
    {
      name: translations[lang].main_menu.seeds,
      id: 3,
      items: [
        {
          title: translations[lang].comparison.peas,
          href: '/catalog/seeds?offset=0&type=peas',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.radish,
          href: '/catalog/seeds?offset=0&type=radish',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.chickpeas,
          href: '/catalog/seeds?offset=0&type=chickpeas',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.sunflower,
          href: '/catalog/seeds?offset=0&type=sunflower',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.arugulas,
          href: '/catalog/seeds?offset=0&type=arugulas',
          handleCloseMenu
        },
      ],
      handler: () => setActiveListId(3),
    },
    {
      name: translations[lang].main_menu.equipment,
      id: 4,
      items: [
        {
          title: translations[lang].comparison.box,
          href: '/catalog/equipment?offset=0&type=box',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.lamps,
          href: '/catalog/equipment?offset=0&type=lamps',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.shelf,
          href: '/catalog/equipment?offset=0&type=shelf',
          handleCloseMenu
        },
        {
          title: translations[lang].comparison.agrovata,
          href: '/catalog/equipment?offset=0&type=agrovata',
          handleCloseMenu
        },
      ],
      handler: () => setActiveListId(4),
    },
  ];

  return (
    <div className="catalog-menu" style={{ zIndex: popupZIndex }}>
      <AnimatePresence>
        {catalogMenuIsOpen && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{
              width: '100%',
            }}
            exit={{
              width: 0,
              transition: { delay: 0.7, duration: 0.3 },
            }}
            className="catalog-menu__aside"
          >
            <div className="catalog-menu__header">
              <Header />
            </div>
            <motion.div
              className="catalog-menu__inner"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sideVariants}
            >
              <motion.button
                className="btn-reset catalog-menu__close"
                variants={itemVariants}
                onClick={handleCloseMenu}
              />
              <motion.h2 variants={itemVariants} className="catalog-menu__title">
                {translations[lang].main_menu.catalog}
              </motion.h2>
              <ul className="list-reset catalog-menu__list">
                {items.map(({ id, name, items, handler }) => {
                  const buttonProps = (isActive: boolean) => ({
                    handler: handler as VoidFunction,
                    name,
                    isActive,
                  });

                  // делаем проверку для показа нужного списка
                  const isCurrentList = (showList: boolean, currentId: number) =>
                    showList && id === currentId;

                  return (
                    <motion.li
                      key={id}
                      variants={itemVariants}
                      className="catalog-menu__list__item"
                    >
                      {!isMedia450 && (
                        <>
                          {id === 1 && <CatalogMenuButton {...buttonProps(isActiveList(1))} />}
                          {id === 2 && <CatalogMenuButton {...buttonProps(isActiveList(2))} />}
                          {id === 3 && <CatalogMenuButton {...buttonProps(isActiveList(3))} />}
                          {id === 4 && <CatalogMenuButton {...buttonProps(isActiveList(4))} />}
                        </>
                      )}
                      {!isMedia450 && (
                        <AnimatePresence>
                          {isCurrentList(isActiveList(1), 1) && <CatalogMenuList items={items} />}
                          {isCurrentList(isActiveList(2), 2) && <CatalogMenuList items={items} />}
                          {isCurrentList(isActiveList(3), 3) && <CatalogMenuList items={items} />}
                          {isCurrentList(isActiveList(4), 4) && <CatalogMenuList items={items} />}
                        </AnimatePresence>
                      )}
                      {isMedia450 && (
                        <Accordion
                          title={name}
                          titleClass="btn-reset nav-menu__accordion__item__title"
                        >
                          <ul className="list-reset catalog__accordion__list">
                            {items.map((item, i) => (
                              <li key={i} className="catalog__accordion__list__item">
                                <Link
                                  href={item.href}
                                  className="nav-menu__accordion__item__list__item__link"
                                  onClick={item.handleCloseMenu}
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Accordion>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogMenu;
