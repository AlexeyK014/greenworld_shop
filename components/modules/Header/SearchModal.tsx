import { basePropsForMotion } from '@/constants/motion';
import { loadProductBySearch, loadProductBySearchFx, resetProductBySearch } from '@/context/goods';
import { $productBySearch } from '@/context/goods/state';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { useLang } from '@/hooks/useLang';
import { handleCloseSearchModal } from '@/lib/utils/common';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUnit } from 'effector-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState, useTransition } from 'react';

const SearchModal = () => {
  const { lang, translations } = useLang();
  const [searchValue, setSearchValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const delayCallback = useDebounceCallback(1000) // чтобы только через 1 сек после печатанья отправлялся запрос на сервер
  const productsBySearch = useUnit($productBySearch)
  const spinner = useUnit(loadProductBySearchFx.pending)

  // для категорий
  const searchedProductsCategory = useMemo(
    () =>
      productsBySearch.items?.length
        ? [...new Set(productsBySearch.items.map((item) => item.category))] //создам массив уникальных значений
        : [],
    [productsBySearch.items])

  // для типов
  // при нажатие на тип мы отправляемся в каталог, там применяется фильтр и для этого нужна категория
  const searchedProductsType = useMemo(
    () =>
      productsBySearch.items?.length
        // чтобы не дублировались объекты у которых одно и тоже поле
        ? [
          ...new Map(
            productsBySearch.items.map((item) => [item.type, item])
          ).values()
        ]
        : [],
    [productsBySearch.items])

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    // когда делаем фокус на инпут, добавляется класс 'with_value'
    e.target.classList.add('with_value');
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    // когда убираем фокус, делаем проверку.
    if (e.target.value) {
      return;
    }

    e.target.classList.remove('with_value');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // обновляем состояние без блокировки во генерации списка предложиений в поиски
    startTransition(() => setSearchValue(e.target.value))

    if (!e.target.value.length) {
      delayCallback(() => '')
      resetProductBySearch()
      return
    }

    delayCallback(() => loadProductBySearch({ search: e.target.value.trim() }))
  }

  return (
    <div className="search-modal">
      <button className="btn-reset search-modal__close" onClick={handleCloseSearchModal} />
      <h3 className="search-modal__title">{translations[lang].header.search_products}</h3>
      <div className="search-modal__top">
        <label className="search-modal__label">
          <input
            type="text"
            className="search-modal__input"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleSearchInputChange}
          />
          <span className="search-modal__floating_label">
            {translations[lang].header.search_infos}
          </span>
        </label>

        {!!searchedProductsCategory.length && (
          <motion.ul {...basePropsForMotion} className='lest-reset search-modal__links'>
            {searchedProductsCategory.map((category) => (
              <li key={category}>
                <Link
                  href={`/catalog/${category}`}
                  onClick={handleCloseSearchModal}
                >
                  {(translations[lang].breadcrumbs as { [index: string]: string })[category]}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}

        {/* для типов */}
        {!!searchedProductsType.length && (
          <motion.ul {...basePropsForMotion} className='lest-reset search-modal__links search-modal__categories'>
            {searchedProductsType.map((item) => (
              <li key={item.type}>
                <Link
                  href={`/catalog/${item.category}?type=${item.type}`}
                  onClick={handleCloseSearchModal}
                >
                  {(translations[lang].comparison as { [index: string]: string })[item.type]}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}

        <div className='search-modal__bottom'>
          {(spinner) && (
            <motion.span className='search-modal__spinner' {...basePropsForMotion}>
              <FontAwesomeIcon icon={faSpinner} spin color='#489765' size='3x' />
            </motion.span>
          )}
          {!spinner && (
            <motion.ul {...basePropsForMotion} className='list-reset search-modal__results'>
              {(productsBySearch.items || []).map((item) => (
                <li key={item._id} className='search-modal__results__item'>
                  <Link
                    href={`/catalog/${item.category}/${item._id}`}
                    className='search-modal__results__item__link'
                    onClick={handleCloseSearchModal}
                  >
                    <div className='search-modal__results__item__left'>
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        width={150}
                        height={150}
                        className='search-modal__results__item__img'
                      />
                    </div>
                    <div className='search-modal__results__item__inner'>
                      <p>{item.name}</p>
                      <p>{item.category}</p>
                      <p>{item.type}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
