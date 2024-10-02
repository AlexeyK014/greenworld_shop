/* eslint-disable prettier/prettier */
import { alowedCollectionsCategories } from '@/constants/product'
import { loadProductsByFilter } from '@/context/goods/index'
import React, { useEffect } from 'react'
import styles from '@/styles/product/index.module.scss'
import AllLink from '@/components/elements/AllLink/AllLink'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import { basePropsForMotion } from '@/constants/motion'
import { motion } from 'framer-motion'
import ProductListItem from '../ProductListItem/ProductListItem'
import { useProductsByCollection } from '@/hooks/useProductsByCollection'

const ProductsByCollection = ({ collection }: { collection: string }) => {
  const { title, capitalizeCollection, products, spinner } = useProductsByCollection(collection)
  const currentCategory = alowedCollectionsCategories[
    Math.floor(Math.random() * alowedCollectionsCategories.length)
  ]

  useEffect(() => {
    loadProductsByFilter({
      limit: 4,
      offset: 0,
      category:
        alowedCollectionsCategories[
          Math.floor(Math.random() * alowedCollectionsCategories.length)
        ],
      additionalParam: `collection=${collection}`,
    })
  }, [])

  console.log(products)

  if (!products.items?.length) {
    return null
  }

  return (
    <div className={styles.product__collection}>
      <span className={styles.product__collection__bg}>
        {capitalizeCollection}
      </span>
      <h2 className={styles.product__collection__title}>{title}</h2>
      <div className={styles.product__collection__inner}>
        <AllLink link={`/collection-products?collection=${collection}&category=${currentCategory}`} />
        {spinner && (
          <motion.ul
            className={skeletonStyles.skeleton}
            {...basePropsForMotion}
          >
            {Array.from(new Array(4)).map((_, i) => (
              <li key={i} className={skeletonStyles.skeleton__item}>
                <div className={skeletonStyles.skeleton__item__light} />
              </li>
            ))}
          </motion.ul>
        )}
        {!spinner && (
          <motion.ul
            className={`list-reset ${styles.product__collection__list}`}
            {...basePropsForMotion}
          >
            {(products.items || []).map((item) => (
              <ProductListItem key={item._id} item={item} title={title} />
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  )
}

export default ProductsByCollection
