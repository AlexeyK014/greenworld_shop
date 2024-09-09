/* eslint-disable prettier/prettier */
/* eslint-disable indent */
'use client'
import { useProductFilters } from '@/hooks/useProductFilters'
import { IProductsPage } from '@/types/catalog'
import styles from '@/styles/catalog/index.module.scss'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import ReactPaginate from 'react-paginate'
import { motion } from 'framer-motion'
import { basePropsForMotion } from '@/constants/motion'
import ProductListItem from '@/components/modules/ProductListItem/ProductListItem'
import { useLang } from '@/hooks/useLang'
import HeadeingWithCount from '@/components/elements/HeadingWithCount/HeadeingWithCount'
import { useEffect } from 'react'
import { setCatalogCategoryOptions } from '@/context/catalog'
import CatalogFilters from '@/components/modules/CatalogFilters/CatalogFilters'

const ProductsPage = ({ searchParams, pageName }: IProductsPage) => {
  const { lang, translations } = useLang()

  // pageName === 'catalog' делаем проверку, если мы находимся на каталоге, передаём переменную в хук

  // получаем доступ к хуку
  const {
    products,
    productsSpinner,
    paginationProps,
    handlePageChange,
    handleApplyFiltersWithCategory,
    handleApplyFiltersWithPrice,
    handleApplyFiltersWithSizes,
    handleApplyFiltersWithColors,
    handleApplyFiltersBySort,
  } = useProductFilters(searchParams, pageName, pageName === 'catalog')

  useEffect(() => {
    // pageName на какой странице мы сейчас находимся
    switch (pageName) {
      case 'catalog':
        setCatalogCategoryOptions({
          rootCategoryOptions: [
            {
              id: 2,
              title: translations[lang].main_menu.microgreen,
              href: '/catalog/microgreen',
            },
            {
              id: 3,
              title: translations[lang].main_menu.sprouts,
              href: '/catalog/sprouts',
            },
            {
              id: 4,
              title: translations[lang].main_menu.seeds,
              href: '/catalog/seeds',
            },
            {
              id: 5,
              title: translations[lang].main_menu.equipment,
              href: '/catalog/equipment',
            },
          ],
        })
        break
      case 'microgreen':
        setCatalogCategoryOptions({
          microgreenCategoryOptions: [
            {
              id: 1,
              title: translations[lang].comparison.peas,
              filterHandler: () => handleApplyFiltersWithCategory('peas'),
            },
            {
              id: 2,
              title: translations[lang].comparison.radish,
              filterHandler: () => handleApplyFiltersWithCategory('radish'),
            },
            {
              id: 3,
              title: translations[lang].comparison.cabbage,
              filterHandler: () => handleApplyFiltersWithCategory('cabbage'),
            },
            {
              id: 4,
              title: translations[lang].comparison.sunflower,
              filterHandler: () => handleApplyFiltersWithCategory('sunflower'),
            },
            {
              id: 5,
              title: translations[lang].comparison.arugulas,
              filterHandler: () => handleApplyFiltersWithCategory('arugulas'),
            },
          ],
        })
        break
      case 'sprouts':
        setCatalogCategoryOptions({
          sproutsCategoryOptions: [
            {
              id: 1,
              title: translations[lang].comparison.peas,
              filterHandler: () => handleApplyFiltersWithCategory('peas'),
            },
            {
              id: 2,
              title: translations[lang].comparison.buckwheat,
              filterHandler: () => handleApplyFiltersWithCategory('buckwheat'),
            },
            {
              id: 3,
              title: translations[lang].comparison.chickpeas,
              filterHandler: () => handleApplyFiltersWithCategory('chickpeas'),
            },
            {
              id: 4,
              title: translations[lang].comparison.wheat,
              filterHandler: () => handleApplyFiltersWithCategory('wheat'),
            },
          ],
        })
        break
      case 'seeds':
        setCatalogCategoryOptions({
          seedsCategoryOptions: [
            {
              id: 1,
              title: translations[lang].comparison.peas,
              filterHandler: () => handleApplyFiltersWithCategory('peas'),
            },
            {
              id: 2,
              title: translations[lang].comparison.radish,
              filterHandler: () => handleApplyFiltersWithCategory('radish'),
            },
            {
              id: 3,
              title: translations[lang].comparison.chickpeas,
              filterHandler: () => handleApplyFiltersWithCategory('chickpeas'),
            },
            {
              id: 4,
              title: translations[lang].comparison.sunflower,
              filterHandler: () => handleApplyFiltersWithCategory('sunflower'),
            },
            {
              id: 5,
              title: translations[lang].comparison.arugulas,
              filterHandler: () => handleApplyFiltersWithCategory('arugulas'),
            },
          ],
        })
        break
      case 'equipment':
        setCatalogCategoryOptions({
          equipmentCategoryOptions: [
            {
              id: 1,
              title: translations[lang].comparison.box,
              filterHandler: () => handleApplyFiltersWithCategory('box'),
            },
            {
              id: 2,
              title: translations[lang].comparison.lamps,
              filterHandler: () => handleApplyFiltersWithCategory('lamps'),
            },
            {
              id: 3,
              title: translations[lang].comparison.shelf,
              filterHandler: () => handleApplyFiltersWithCategory('shelf'),
            },
            {
              id: 4,
              title: translations[lang].comparison.agrovata,
              filterHandler: () => handleApplyFiltersWithCategory('agrovata'),
            },
          ],
        })
        break
      default:
        break
    }
  }, [lang])

  console.log(products)

  return (
    <>
      <HeadeingWithCount
        count={products.count}
        title={
          (translations[lang].breadcrumbs as { [index: string]: string })[
            pageName
          ]
        }
        spinner={productsSpinner}
      />
      <CatalogFilters
        handleApplyFiltersWithSizes={handleApplyFiltersWithSizes}
        handleApplyFiltersWithPrice={handleApplyFiltersWithPrice}
        handleApplyFiltersWithColors={handleApplyFiltersWithColors}
        handleApplyFiltersBySort={handleApplyFiltersBySort}
      />
      {productsSpinner && (
        <motion.ul
          {...basePropsForMotion}
          className={skeletonStyles.skeleton}
          style={{ marginBottom: 60 }}
        >
          {Array.from(new Array(12)).map((_, i) => (
            <li key={i} className={skeletonStyles.skeleton__item}>
              <div className={skeletonStyles.skeleton__item__light} />
            </li>
          ))}
        </motion.ul>
      )}
      {!productsSpinner && (
        <motion.ul
          {...basePropsForMotion}
          className={`list- reset ${styles.catalog__list}`}
        >
          {/* items могут появится не сразу, поэтому делаем провеку "products.items" */}
          {(products.items || []).map((item) => (
            <ProductListItem key={item._id} item={item} />
          ))}
        </motion.ul>
      )}
      {!products.items?.length && !productsSpinner && (
        <div className={styles.catalog__list__empty}>
          {translations[lang].common.nothing_is_found}
        </div>
      )}
      <div className={styles.catalog__bottom}>
        <ReactPaginate
          {...paginationProps}
          nextLabel={<span>{translations[lang].catalog.next_page}</span>}
          previousLabel={
            <span>{translations[lang].catalog.previous_page}</span>
          }
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default ProductsPage
