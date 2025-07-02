import toast from 'react-hot-toast';
import { useState } from 'react';
import { IProduct } from '@/types/common';
import { useGoodsByAuth } from './useGoodsByAuth';
import { productsWithoutSizes } from '@/constants/product';
import { handleShowSizeTable, isUserAuth } from '@/lib/utils/common';
import { addFavoriteItemToLs } from '@/lib/utils/favorites';
import { $favorites, $favoritesFromLS } from '@/context/favorites/state';
import { addProductToFavorites, setIsAddToFavorites } from '@/context/favorites/index';

// для добавления товара в избранное
export const useFavoritesAction = (product: IProduct) => {
  // создаём локальный state для спиннера
  const [addToFavoritesSpinner, setAddToFavoritesSpinner] = useState(false);

  // результат хука useGoodsByAuth
  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS);

  // получаем уже существующий товар из списка избранных товаров
  const existingItem = currentFavoritesByAuth.find((item) => item.productId === product._id);

  // фун-я которая возвр из хука
  const handleAddProductToFavorites = () => {
    // проверка, добавляем мы товар с размером или нет
    if (productsWithoutSizes.includes(product.type)) {
      if (existingItem) {
        // если товар без размеров
        toast.success('Добавлено в избранное!');
        return;
      }

      // если товара не было в избранном, тогда просто на клиенте добавляем товар в избранное
      // передавая туда пустой размер и сам товар
      if (!isUserAuth()) {
        addFavoriteItemToLs(product,
          // ''
        );
        return;
      }

      // если юзер авторизован
      // получаем то что в LS
      // получаем clientId при добавление товара в избранное для синронизации с сервером
      const auth = JSON.parse(localStorage.getItem('auth') as string);
      const clientId = addFavoriteItemToLs(
        product,
        // '',
        false);

      addProductToFavorites({
        jwt: auth.accessToken,
        productId: product._id,
        setSpinner: setAddToFavoritesSpinner,
        // size: '',
        category: product.category,
        clientId,
      });
      return;
    }

    // если есть размеры, тогда будет открывать таблица размеров
    setIsAddToFavorites(true);
    handleShowSizeTable(product);
  };

  return {
    handleAddProductToFavorites,
    addToFavoritesSpinner,
    setAddToFavoritesSpinner,
    isProductInFavorites: existingItem,
  };
};
