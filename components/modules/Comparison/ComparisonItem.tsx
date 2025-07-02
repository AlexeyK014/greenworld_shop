/* eslint-disable prettier/prettier */
import { IComparisonItem } from '@/types/comparison';
import styles from '@/styles/comparison/index.module.scss';
import { motion } from 'framer-motion';
import { basePropsForMotion } from '@/constants/motion';
import DeleteItemBtn from '@/components/elements/DeleteCartItemBtn/DeleteCartItemBtn';
import AddToCArtIcon from '@/components/elements/AddToCartIcon/AddToCArtIcon';
import Image from 'next/image';
import { useProductDelete } from '@/hooks/useProductDelete';
import {
  deleteProductFromComparison,
  setComparisonFromLS,
  setShouldShowEmptyComparison,
} from '@/context/comparison/index';
import { deleteProductFromLS, isUserAuth } from '@/lib/utils/common';
import { productsWithoutSizes } from '@/constants/product';
import { addCartItemToLS } from '@/lib/utils/cart';
import { IProduct } from '@/types/common';
import { useMemo, useState } from 'react';
import { loadOneProduct } from '@/context/goods/index';
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth';
import { addProductToCart } from '@/context/cart/index';
import { $cart, $cartFromLs } from '@/context/cart/state';
import { useLang } from '@/hooks/useLang';

const ComparisonItem = ({ item }: { item: IComparisonItem }) => {
  const { lang, translations } = useLang();
  const currentCartByAuth = useGoodsByAuth($cart, $cartFromLs);

  const [addToCartSpinner, setAddToCartSpinner] = useState(false);
  const [loadProductSpinner, setLoadProductSpinner] = useState(false);
  const { handleDelete, deleteSpinner } = useProductDelete(item._id, deleteProductFromComparison);

  // если товар без размера, ищем по условию на id, без проверки на размер
  // иначе, образаемся к массиву товаров из корзины, получаем cartItem
  // и сравниваем равен ли cartItem.productId и item.productId(из сравнения)
  // чтобы понимать находится ли такой размер у этого товара преобразовываем объект(item.sizes) в массив

  const isProductInCart = useMemo(
    () => currentCartByAuth.find((cartItem) => cartItem.productId === item.productId),
    [currentCartByAuth, item.productId]
  );

  const addToCart = () => {
    // проверка, добавлен ли товар в сравнение БЕЗ РАЗМЕРА
    if (productsWithoutSizes.includes(item.category)) {
      // тогда добавляем товар не вызывая Таблицу размеров
      const product = {
        ...item, // разворачиваем comparisonItem
        _id: item.productId, // добавляем поле id с картинкой
        //@ts-ignore
        images: [item.image.url],
      } as unknown as IProduct;

      if (!isUserAuth()) {
        addCartItemToLS(
          product,
          // '',
          1);
        return;
      }

      // если юзер авторизован
      // получаем данные из LS
      const auth = JSON.parse(localStorage.getItem('auth') as string);

      // создаём переменную, вызывая фун-ю добавления в LS
      const clientId = addCartItemToLS(
        product,
        // '',
        1,
        false);

      addProductToCart({
        jwt: auth.accessToken,
        setSpinner: setAddToCartSpinner,
        productId: item.productId,
        category: item.category,
        count: 1,
        // size: '',
        clientId,
      });
      return;
    }

    // добавление товара С РАЗМЕРОМ
    loadOneProduct({
      productId: item.productId, // для образения к коллекции на БД
      category: item.category,
      withShowingSizeTable: true, // чтобы появилась модалка с таблицей размеров
      setSpinner: setLoadProductSpinner,
    });
  };

  const handleDeleteComparisonItem = () => {
    if (!isUserAuth()) {
      deleteProductFromLS(
        item.clientId,
        'comparison', // ключ для LS, удаляем под этим ключом
        setComparisonFromLS,
        setShouldShowEmptyComparison,
        'Удалено из сравнения!',
      );
      return;
    }
    handleDelete();
    deleteProductFromLS(
      item.clientId,
      'comparison',
      setComparisonFromLS,
      setShouldShowEmptyComparison,
      '',
      false,
    );
  };

  const excludedKeys = ['productId', 'image', 'clientId'];
  const displayedProductKeys = [
    'name',
    'price',
    'inStock',
    'category',
  ];

  return (
    <motion.li className={styles.comparison__list__item} {...basePropsForMotion}>
      <DeleteItemBtn
        btnDisabled={deleteSpinner}
        callback={handleDeleteComparisonItem}
        className={styles.comparison__list__item__delete}
      />

      {/* компонент добавления в корзину */}
      <AddToCArtIcon
        isProductInCart={!!isProductInCart} // значение, добавлен ли элемент в корзину или нет
        addToCartSpinner={addToCartSpinner || loadProductSpinner}
        callback={addToCart}
        className={styles.comparison__list__item__cart}
        addedClassName={styles.comparison__list__item__cart_added}
      />

      {/* блок для картинки */}
      <div className={styles.comparison__list__item__img}>
        <Image
          // src={item.image.url}
          src={typeof item.image === 'string' ? item.image : item.image.url}
          alt={item.name}
          width={160}
          height={160}
        />
      </div>

      {/* список с характеристиками */}
      <ul className={`list-reset ${styles.comparison__list__item__inner_list}`}>
        {/* преобразуем массив */}
        {Object.entries(item)
        .filter(([key]) => !excludedKeys.includes(key) && displayedProductKeys.includes(key)) // ⬅️ исключаем нужные поля
        .map(([key, value], i) => {
          let valueFromArray = null;
          let valueByBool = null;
          let valueFromObject = null;

          if (Array.isArray(value)) {
            valueFromArray = value.join(', ');
          } else if (typeof value === 'boolean') {
            valueByBool = value ? 'Есть' : 'Нет';
          } else if (typeof value === 'object' && value !== null) {
            // Преобразуем объект в строку для вывода (например: "desc: ..., url: ...")
            valueFromObject = Object.entries(value)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ');
          }
          //@ts-ignore
          const label = translations[lang].fields?.[key] || key;

          return (
            <li key={i} className={styles.comparison__list__item__inner_list__item}>
              <span>{label}</span>
              <span>{valueByBool || valueFromArray || valueFromObject || value}</span>
            </li>
          );
        })}
      </ul>
    </motion.li>
  );
};

export default ComparisonItem;
