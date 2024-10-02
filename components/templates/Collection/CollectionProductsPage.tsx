'use client'

import React, { useEffect, useState } from 'react'
import styles from '@/styles/watched-products-page/index.module.scss'
import { useProductsByCollection } from '@/hooks/useProductsByCollection'
import ProductListItem from '@/components/modules/ProductListItem/ProductListItem'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import { basePropsForMotion } from '@/constants/motion'
import { motion } from 'framer-motion'
import { getSearchParamUrl } from '@/lib/utils/common'
import { notFound } from 'next/navigation'
import {
  allowedCollections,
  alowedCollectionsCategories,
} from '@/constants/product'
import { loadProductsByFilter } from '@/context/goods/index'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

const CollectionProductsPage = () => {
  const { getDefaultTextGenerator, getTextGenerator } = useBreadcrumbs(
    'collection_products'
  )
  const [currentCollection, setCurrentCollection] = useState('')
  const { title, products, spinner } =
    useProductsByCollection(currentCollection)

  useEffect(() => {
    const urlParams = getSearchParamUrl()
    const categoryParam = urlParams.get('category')
    const collectionParam = urlParams.get('collection')

    // делаем провекрку
    if (
      categoryParam &&
      collectionParam &&
      alowedCollectionsCategories.includes(categoryParam) &&
      allowedCollections.includes(collectionParam)
    ) {
      setCurrentCollection(collectionParam)
      loadProductsByFilter({
        limit: 12,
        offset: 0,
        category: categoryParam,
        additionalParam: urlParams.toString(),
      })

      return
    }

    notFound()
  }, [])

  return (
    <main>
      <Breadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
        getTextGenerator={getTextGenerator}
      />
      <section className={styles.watched_products}>
        <div className='container'>
          <h1 className={`side-title ${styles.watched_products__title}`}>
            {title}
          </h1>
          {spinner && (
            <motion.ul
              className={skeletonStyles.skeleton}
              style={{ marginBottom: 40 }}
              {...basePropsForMotion}
            >
              {Array.from(new Array(12)).map((_, i) => (
                <li key={i} className={skeletonStyles.skeleton__item}>
                  <div className={skeletonStyles.skeleton__item__light} />
                </li>
              ))}
            </motion.ul>
          )}
          {!spinner && (
            <ul className={`list-reset ${styles.watched_products__list}`}>
              {(products.items || []).map((item) => (
                <ProductListItem key={item._id} item={item} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default CollectionProductsPage
