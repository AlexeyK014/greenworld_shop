import { useLang } from '@/hooks/useLang'
import { IProductListItemProps } from '@/types/modules'
import styles from '@/styles/product-list-item/index.module.scss'
import ProductLabel from './ProductLabel'
import ProductItemActionBtn from '@/components/elements/ProductItemActionBtn/ProductItemActionBtn'
import Image from 'next/image'
import Link from 'next/link'
import ProductAvailable from '@/components/elements/ProductAvailable/ProductAvailable'
import {
  addOverflowHiddenToBody,
  formatPrice,
  isItemInList,
} from '@/lib/utils/common'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { setCurrentProduct } from '@/context/goods/index'
import { productsWithoutSizes } from '@/constants/product'
import { useCartAction } from '@/hooks/useCartAction'
import { addProductToCartBySizeTable } from '@/lib/utils/cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { setIsAddToFavorites } from '@/context/favorites/index'
import { useFavoritesAction } from '@/hooks/useFavoritesAction'
import { useComparisonAction } from '@/hooks/useComparisonAction'
import { showQuickModal } from '@/context/modals/index'

const ProductListItem = ({ item, title }: IProductListItemProps) => {
  const { lang, translations } = useLang()
  const isTitleForNew = title === translations[lang].main_page.new_title
  const isMedia800 = useMediaQuery(800)
  const { addToCartSpinner, currentCartByAuth, setAddToCartSpinner } =
    useCartAction()
  const isProductInCart = isItemInList(currentCartByAuth, item._id)
  const {
    addToFavoritesSpinner,
    isProductInFavorites,
    handleAddProductToFavorites,
  } = useFavoritesAction(item)

  const handleShowQuickViewModal = () => {
    addOverflowHiddenToBody()
    showQuickModal()
    setCurrentProduct(item)
  }

  const {
    handleAddToComparison,
    isProductInComparison,
    addToComparisonSpinner,
  } = useComparisonAction(item)

  const addToCart = () => {
    setIsAddToFavorites(false)
    addProductToCartBySizeTable(item, setAddToCartSpinner, 1)
  }

  return (
    <>
      <li className={styles.list__item}>
        {title ? (
          <span
            className={`${styles.list__item__label} ${
              isTitleForNew
                ? styles.list__item__new
                : styles.list__item__bestseller
            }`}
          >
            {isTitleForNew
              ? translations[lang].main_page.is_new
              : translations[lang].main_page.is_bestseller}
          </span>
        ) : !item.isNew && !item.isBestseller ? (
          ''
        ) : (
          <ProductLabel isBestseller={item.isBestseller} isNew={item.isNew} />
        )}
        <div className={styles.list__item__actions}>
          <ProductItemActionBtn
            spinner={addToFavoritesSpinner}
            text={translations[lang].product.add_to_favorites}
            iconClass={`${
              addToFavoritesSpinner
                ? 'actions__btn_spinner'
                : isProductInFavorites
                  ? 'actions__btn_favorite_checked'
                  : 'actions__btn_favorite'
            }`}
            callback={handleAddProductToFavorites}
          />
          <ProductItemActionBtn
            spinner={addToComparisonSpinner}
            text={translations[lang].product.add_to_comparison}
            callback={handleAddToComparison}
            iconClass={`${
              addToComparisonSpinner
                ? 'actions__btn_spinner'
                : isProductInComparison
                  ? 'actions__btn_comparison_checked'
                  : 'actions__btn_comparison'
            }`}
          />
          {!isMedia800 && (
            <ProductItemActionBtn
              text={translations[lang].product.quick_view}
              iconClass='actions__btn_quick_view'
              callback={handleShowQuickViewModal}
            />
          )}
        </div>
        <Link
          href={`/catalog/${item.category}/${item._id}`}
          className={styles.list__item__img}
        >
          <Image src={item.images[0]} alt={item.name} fill />
        </Link>

        <div className={styles.list__item__inner}>
          <h3 className={styles.list__item__title}>
            <Link href={`/catalog/${item.category}/${item._id}`}>
              {item.name}
            </Link>
          </h3>
          <ProductAvailable
            vendorCode={item.vendorCode}
            inStock={+item.inStock}
          />
          <span className={styles.list__item__price}>
            {formatPrice(+item.price)} P
          </span>
        </div>

        {productsWithoutSizes.includes(item.type) ? (
          <button
            onClick={addToCart}
            className={`btn-reset ${styles.list__item__cart} ${
              isProductInCart ? styles.list__item__cart_added : ''
            }`}
            disabled={addToCartSpinner}
            style={addToCartSpinner ? { minWidth: 125, height: 48 } : {}}
          >
            {addToCartSpinner ? (
              <FontAwesomeIcon icon={faSpinner} spin color='fff' />
            ) : isProductInCart ? (
              translations[lang].product.in_cart
            ) : (
              translations[lang].product.to_cart
            )}
          </button>
        ) : (
          <button
            className={`btn-reset ${styles.list__item__cart}`}
            onClick={addToCart}
          >
            {translations[lang].product.to_cart}
          </button>
        )}
      </li>
    </>
  )
}

export default ProductListItem
