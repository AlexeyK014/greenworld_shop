'use client'
import { loadOneProduct, loadOneProductFx } from '@/context/goods/index'
import { IProductPageProps } from '@/types/product'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUnit } from 'effector-react'
import { notFound } from 'next/navigation'
import { useEffect } from 'react'
import styles from '@/styles/product/index.module.scss'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import { useLang } from '@/hooks/useLang'
import ProductPageContent from '@/components/modules/ProductPage/ProductPageContent'
import { $currentProduct } from '@/context/goods/state'

const ProductPage = ({ productId, category }: IProductPageProps) => {
  const product = useUnit($currentProduct)
  const productSpinner = useUnit(loadOneProductFx.pending)
  usePageTitle(category, product.name)
  const { breadcrumbs } = useBreadcrumbs('category')
  const { lang, translations } = useLang()

  console.log(product)

  // загрузка товароа на первый рейтинг
  useEffect(() => {
    loadOneProduct({
      productId,
      category,
    })
  }, [])

  // логика для хлебных крошек
  useEffect(() => {
    if (breadcrumbs) {
      // получаем последнюю хлебную крошку
      const lastCrumb =
        breadcrumbs.children[breadcrumbs.children.length - 1].children[0]

      // динамическое изменение предпоследней хлебной крошки
      breadcrumbs.children[
        breadcrumbs.children.length - 2
      ].children[0].textContent = (
        translations[lang].breadcrumbs as { [index: string]: string }
      )[category]

      // динамическое изменение последней хлебной крошки
      lastCrumb.textContent = productSpinner
        ? translations[lang].common.loading
        : product.name
    }
  }, [breadcrumbs, category, lang, product.name, productSpinner, translations])

  if (product?.errorMessage) {
    notFound()
  }

  return (
    <div className={styles.product}>
      {productSpinner ? (
        <div className={styles.product__preloader}>
          <FontAwesomeIcon icon={faSpinner} spin size='8x' color='green' />
        </div>
      ) : (
        product.name && <ProductPageContent />
      )}
    </div>
  )
}

export default ProductPage
