import ProductImages from './ProductImages';
import styles from '@/styles/product/index.module.scss';
import { useUnit } from 'effector-react';
import { useLang } from '@/hooks/useLang';
import {
  addOverflowHiddenToBody,
  capitalizeFirstLetter,
  formatPrice,
  getWatchedProductFromLS,
} from '@/lib/utils/common';
import { useFavoritesAction } from '@/hooks/useFavoritesAction';
import ProductItemActionBtn from '@/components/elements/ProductItemActionBtn/ProductItemActionBtn';
import ProductAvailable from '@/components/elements/ProductAvailable/ProductAvailable';
import ProductColor from '../ProductListItem/ProductColor';
import { useCartAction } from '@/hooks/useCartAction';
import ProductSizesItem from '../ProductListItem/ProductSizesItem';
import ProductSizeTableBtn from '../ProductListItem/ProductSizeTableBtn';
import ProductCounter from '../ProductListItem/ProductCounter';
import { ICartItem } from '@/types/cart';
import AddToCartBtn from '../ProductListItem/AddToCartBtn';
import { setIsAddToFavorites } from '@/context/favorites/index';
import ProductInfoAccordion from './ProductInfoAccordion';
import ProductsByCollection from './ProductsByCollection';
import { $currentProduct } from '@/context/goods/state';
import { useEffect } from 'react';
import WatchedProducts from '../WatchedProducts/WatchedProducts';
import { useWatchedProducts } from '@/hooks/useWatchedProducts';
import { openShareModal } from '@/context/modals/index';

const ProductPageContent = () => {
  const {
    selectedSize,
    setSelectedSize,
    handleAddToCart,
    addToCartSpinner,
    updateCountSpinner,
    allCurrentCartItemCount,
    currentCartItems,
    existingItem,
    count,
    setCount,
  } = useCartAction();
  const product = useUnit($currentProduct);
  console.log(product);

  const displayedProductKeys = [
  'height',
  'power',
  'spectrum',
  'color',
  'colortemperature',
  'width',
  'length',
  'shelves',
];

  // добавляем товар в просмотренные
  useEffect(() => {
    const watchedProducts = getWatchedProductFromLS(); // фун-я получаем продукты с LS

    // необходимо убдиться нет ли товара в LS( не просматривали его ранее)
    // проходимся по переменной с помощью метода find
    const isWatched = watchedProducts.find((item) => item._id === product._id);
    // если такой товар найден
    if (isWatched) {
      return;
    }

    //а иначе
    localStorage.setItem(
      'watched',
      JSON.stringify([
        ...watchedProducts, // разваорачиваем прежние продукты
        { category: product.category, _id: product._id }, // добавляем новый продукт
      ]),
    );
  }, [product._id, product.category]);

  const { lang, translations } = useLang();
  const { handleAddProductToFavorites, addToFavoritesSpinner, isProductInFavorites } =
    useFavoritesAction(product);

  const handleProductShare = () => {
    addOverflowHiddenToBody();
    openShareModal();
  };

  const addToCart = () => {
    handleAddToCart(count);
    setIsAddToFavorites(false);
  };

  const { watchedProducts } = useWatchedProducts(product._id);

  return (
    <>
      <div className={styles.product__top}>
        <ProductImages />
        <div className={styles.product__top__right}>
          {(product.isBestseller || product.isNew) && (
            <div className={styles.product__top__label}>
              {product.isNew && (
                <span className={styles.product__top__label__new}>
                  {translations[lang].main_page.is_new}
                </span>
              )}
              {product.isBestseller && (
                <span className={styles.product__top__label__new}>
                  {translations[lang].main_page.is_bestseller}
                </span>
              )}
            </div>
          )}
          <h1 className={styles.product__top__title}>{product.name}</h1>
          <div className={styles.product__top__price}>
            <h3 className={styles.product__top__price__title}>{formatPrice(product.price)} P</h3>
            <div className={styles.product__top__price__inner}>
              <div className={styles.product__top__price__favorite}>
                <ProductItemActionBtn
                  spinner={addToFavoritesSpinner}
                  text={translations[lang].product.add_to_favorites}
                  iconClass={`${addToFavoritesSpinner
                    ? 'actions__btn_spinner'
                    : isProductInFavorites
                      ? 'actions__btn_favorite_checked'
                      : 'actions__btn_favorite'
                    }`}
                  withTooltip={false}
                  callback={handleAddProductToFavorites}
                />
              </div>
              <button
                className={`btn-reset ${styles.product__top__price__share}`}
                onClick={handleProductShare}
              />
            </div>
          </div>
          <div className={styles.product__top__available}>
            <ProductAvailable vendorCode={product.vendorCode} inStock={+product.inStock} />
          </div>

          <div className={styles.product__top__bottom}>
            <span className={styles.product__top__count}>{translations[lang].product.count}:</span>
            <div className={styles.product__top__inner}>
              {!!selectedSize ? (
                <ProductCounter
                  className={`counter ${styles.product__top__counter}`}
                  count={count}
                  totalCount={+product.inStock}
                  initialCount={+(existingItem?.count || 1)}
                  setCount={setCount}
                  cartItem={existingItem as ICartItem}
                  updateCountAsync={false}
                />
              ) : (
                <div
                  className={`counter ${styles.product__top__counter}`}
                  style={{ justifyContent: 'center' }}
                >
                  <span>
                    {translations[lang].product.total_in_cart} {allCurrentCartItemCount}
                  </span>
                </div>
              )}
              <AddToCartBtn
                className={styles.product__top__add}
                text={translations[lang].product.to_cart}
                handleAddToCart={addToCart}
                addToCartSpinner={addToCartSpinner || updateCountSpinner}
                btnDisabled={
                  addToCartSpinner ||
                  updateCountSpinner ||
                  allCurrentCartItemCount === +product.inStock
                }
              />
            </div>
          </div>
          <div className={styles.product__top__description}>
            <ProductInfoAccordion title={translations[lang].product.description}>
              <p className={styles.product__top__description__text}>{product.description}</p>
            </ProductInfoAccordion>
            <ProductInfoAccordion title={translations[lang].product.characteristics}>
              <ul className={`list-reset ${styles.product__top__description__characteristics}`}>
                {displayedProductKeys.map((key) => {
                  // @ts-ignore
                  const value = product[key];
                  if (value === undefined || value === null || value === '') return null;

                  // @ts-ignore
                  const label = translations[lang].fields?.[key] || key;

                  return (
                    <li key={key} className={styles.product__top__description__text}>
                      {label}: {value}
                    </li>
                  );
                })}
              </ul>
            </ProductInfoAccordion>
          </div>
        </div>
      </div>
      {!!watchedProducts.items?.length && <WatchedProducts watchedProducts={watchedProducts} />}
    </>
  );
};

export default ProductPageContent;
