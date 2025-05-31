/* eslint-disable prettier/prettier */
import { $sizeTableSizes } from '@/context/sizeTable/state';
import { useCartAction } from '@/hooks/useCartAction';
import { useUnit } from 'effector-react';
import styles from '@/styles/size-table/index.module.scss';
import { $showQuickModal } from '@/context/modals/state';
import { closeSizeTableByCheck, isUserAuth } from '@/lib/utils/common';
import { useLang } from '@/hooks/useLang';
import AddToCartBtn from '../ProductListItem/AddToCartBtn';
import ProductCountBySize from '../ProductListItem/ProductCountBySize';
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth';
import { addFavoriteItemToLs } from '@/lib/utils/favorites';
import toast from 'react-hot-toast';
import { useFavoritesAction } from '@/hooks/useFavoritesAction';
import { addProductToFavorites } from '@/context/favorites/index';
import { $isAddToFavorites, $favorites, $favoritesFromLS } from '@/context/favorites/state';

const SizeTable = () => {
  const { lang, translations } = useLang();
  const showQuickViewModal = useUnit($showQuickModal);

  // говорит о том что мы работаем с логикой добавления товара в избранное
  const isAddToFavorites = useUnit($isAddToFavorites);

  // cartItemBySize - чтобы учитывать что мы можем открыть товар который уже в корзине
  const {
    selectedSize,
    setSelectedSize,
    handleAddToCart,
    cartItemBySize,
    addToCartSpinner,
    currentCartItems,
    updateCountSpinner,
    product,
  } = useCartAction(true);

  const { addToFavoritesSpinner, setAddToFavoritesSpinner } = useFavoritesAction(product);

  // условие дизайбла кнопки добавления товара в корзину
  // пока юзер не выберет какой то размер, кнопка не становиться активной

  const productSizes = useUnit($sizeTableSizes);
  const isAgroType = productSizes.type === 'agrovata';
  const isBoxType = productSizes.type === 'box';
  const isLampsType = productSizes.type === 'lamps';
  const isShelfType = productSizes.type === 'shelf';

  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS);
  const currentFavoriteItems = currentFavoritesByAuth.filter(
    (item) => item.productId === product._id,
  );

  // находим конкретный товар из избранных товаров
  // если совпадают и рамер и id
  const favoritesItemBySize = currentFavoriteItems.find((item) => item.size === selectedSize);

  const handleSelectSSizeBox = () => setSelectedSize('190 mm X 114 mm X 35 mm');
  const handleSelectMSizeBox = () => setSelectedSize('190 mm X 114 mm X 55 mm');
  const handleSelectLSizeBox = () => setSelectedSize('190 mm X 114 mm X 75 mm');

  //  проверяем выбранный рамер
  const isSizeSelected = (size: string) => selectedSize === size;

  const checkInFavorites = (size: string) =>
    currentFavoriteItems.find((item) => item.size === size);

  // const agroSize = [
  //   {
  //     id: 1,
  //     manufacturerSize: 'маленький',
  //     length: '160',
  //     width: '110',
  //     height: '10',
  //     selectHandler: handleSelectSSize,
  //     isSelected: isSizeSelected('маленький'), //для выделения столбца
  //     isAvailable: productSizes.sizes.маленький,
  //     isInFavorites: checkInFavorites('маленький'),
  //   },
  //   {
  //     id: 2,
  //     manufacturerSize: 'средний',
  //     length: '160',
  //     width: '110',
  //     height: '15',
  //     selectHandler: handleSelectMSize,
  //     isSelected: isSizeSelected('средний'),
  //     isAvailable: productSizes.sizes.средний,
  //     isInFavorites: checkInFavorites('средний'),
  //   },
  //   {
  //     id: 3,
  //     manufacturerSize: 'большой',
  //     length: '160',
  //     width: '110',
  //     height: '20',
  //     selectHandler: handleSelectLSize,
  //     isSelected: isSizeSelected('большой'),
  //     isAvailable: productSizes.sizes.большой, // доступен ли размер
  //     isInFavorites: checkInFavorites('большой'), // есть ли товар в избранном
  //   },
  // ];

  // const boxSize = [
  //   {
  //     id: 1,
  //     manufacturerSize: '190 mm X 114 mm X 35 mm',
  //     selectHandler: handleSelectSSizeBox,
  //     isSelected: isSizeSelected('190 mm X 114 mm X 35 mm'),
  //     isAvailable: productSizes.sizes[0],
  //     isInFavorites: checkInFavorites('190 mm X 114 mm X 35 mm'),
  //   },
  //   {
  //     id: 2,
  //     manufacturerSize: '190 mm X 114 mm X 55 mm',
  //     selectHandler: handleSelectMSizeBox,
  //     isSelected: isSizeSelected('190 mm X 114 mm X 55 mm'),
  //     isAvailable: productSizes.sizes[1],
  //     isInFavorites: checkInFavorites('190 mm X 114 mm X 55 mm'),
  //   },
  //   {
  //     id: 3,
  //     manufacturerSize: '190 mm X 114 mm X 75 mm',
  //     selectHandler: handleSelectLSizeBox,
  //     isSelected: isSizeSelected('190 mm X 114 mm X 75 mm'),
  //     isAvailable: productSizes.sizes[2],
  //     isInFavorites: checkInFavorites('190 mm X 114 mm X 75 mm'),
  //   },
  // ];

  // const lampsSize = [
  //   {
  //     id: 1,
  //     manufacturerSize: 'маленький',
  //     length: '1200',
  //     power: '10',
  //     colorTemperature: '6000',
  //     spectrum: 'white',
  //     selectHandler: handleSelectSSize,
  //     isSelected: isSizeSelected('маленький'),
  //     isAvailable: productSizes.sizes.маленький,
  //     isInFavorites: checkInFavorites('маленький'),
  //   },
  //   {
  //     id: 2,
  //     manufacturerSize: 'средний',
  //     length: '573',
  //     power: '14',
  //     colorTemperature: '4000',
  //     spectrum: 'red-blue',
  //     selectHandler: handleSelectMSize,
  //     isSelected: isSizeSelected('средний'),
  //     isAvailable: productSizes.sizes.средний,
  //     isInFavorites: checkInFavorites('средний'),
  //   },
  //   {
  //     id: 3,
  //     manufacturerSize: 'большой',
  //     length: '873',
  //     power: '18',
  //     colorTemperature: '4500',
  //     spectrum: 'red-blue',
  //     selectHandler: handleSelectLSize,
  //     isSelected: isSizeSelected('большой'),
  //     isAvailable: productSizes.sizes.большой,
  //     isInFavorites: checkInFavorites('большой'),
  //   },
  // ];

  // const shelfSize = [
  //   {
  //     id: 1,
  //     manufacturerSize: 'маленький',
  //     height: '2000',
  //     length: '1000',
  //     width: '500',
  //     selectHandler: handleSelectSSize,
  //     isSelected: isSizeSelected('маленький'),
  //     isAvailable: productSizes.sizes.маленький,
  //     isInFavorites: checkInFavorites('маленький'),
  //   },
  //   {
  //     id: 2,
  //     manufacturerSize: 'средний',
  //     height: '1800',
  //     length: '1220',
  //     width: '600',
  //     selectHandler: handleSelectMSize,
  //     isSelected: isSizeSelected('средний'),
  //     isAvailable: productSizes.sizes.средний,
  //     isInFavorites: checkInFavorites('средний'),
  //   },
  //   {
  //     id: 3,
  //     manufacturerSize: 'большой',
  //     height: '2000',
  //     length: '1000',
  //     width: '630',
  //     selectHandler: handleSelectLSize,
  //     isSelected: isSizeSelected('большой'),
  //     isAvailable: productSizes.sizes.большой,
  //     isInFavorites: checkInFavorites('большой'),
  //   },
  // ];

  // передаем начальный count или тот что был у товара
  // если он не был добавлен то начальный count = 1
  const addToCart = () => handleAddToCart(+(cartItemBySize?.count || 1));

  const trProps = (
    item:
      | {
          id: number;
          manufacturerSize: string;
          length: string;
          width: string;
          height: string;
          selectHandler: () => void;
          isSelected: boolean;
          isAvailable: boolean;
        }
      | {
          id: number;
          manufacturerSize: string;
          length: string;
          power: string;
          colorTemperature: string;
          spectrum: string;
          selectHandler: () => void;
          isSelected: boolean;
          isAvailable: boolean;
        },
  ) => ({
    onClick: item.selectHandler,
    style: {
      backgroundColor:
        item.isSelected || selectedSize === item.manufacturerSize.toLowerCase()
          ? '#3CB371'
          : 'transparent',
      pointerEvents: item.isAvailable ? 'auto' : 'none',
      opacity: item.isAvailable ? 1 : 0.5,
      color: item.isAvailable ? '#fff' : 'rgba(255, 255, 255, .2)',
    },
  });

  const handleCloseSizeTable = () => closeSizeTableByCheck(showQuickViewModal);

  // когда товар с размером
  const handleAddProductToFavorites = () => {
    // если не авторизован
    if (!isUserAuth()) {
      addFavoriteItemToLs(product, selectedSize);
      return;
    }

    // иначе, получаем данные из LS и проверяем добавлен он УЖЕ в избранное
    if (favoritesItemBySize) {
      toast.success('Добавлено в избранное!');
      return;
    }

    const auth = JSON.parse(localStorage.getItem('auth') as string);

    const clientId = addFavoriteItemToLs(product, selectedSize, false);
    addProductToFavorites({
      jwt: auth.accessToken,
      productId: product._id,
      setSpinner: setAddToFavoritesSpinner,
      size: selectedSize,
      category: product.category,
      clientId,
    });
  };

  return (
    <div className={styles.size_table}>
      <button className={`btn-reset ${styles.size_table__close}`} onClick={handleCloseSizeTable} />
      <h2 className={styles.size_table__title}>{translations[lang].size_table.title}</h2>
      <div className={styles.size_table__inner}>
        <table className={styles.size_table__table}>
          <thead>
            {isLampsType ? (
              <tr>
                <th>Длина, мм</th>
                <th>Мощность, W</th>
                <th>Цветовая температура, K</th>
                <th>Спектр</th>
              </tr>
            ) : (
              <tr>
                <th>Размер</th>
                {/* <th>Длина, </th>
                <th>Ширина, мм</th>
                <th>Высота, мм</th> */}
              </tr>
            )}
          </thead>
          <tbody>


          </tbody>
        </table>
      </div>
      <AddToCartBtn
        handleAddToCart={isAddToFavorites ? handleAddProductToFavorites : addToCart}
        addToCartSpinner={addToCartSpinner || updateCountSpinner || addToFavoritesSpinner}
        btnDisabled={!!!selectedSize || addToCartSpinner || updateCountSpinner}
        className={`${styles.size_table__btn} ${styles.size_table__btn_favorite}`}
        text={
          isAddToFavorites
            ? translations[lang].product.to_favorite
            : translations[lang].product.to_cart
        }
      />
    </div>
  );
};

export default SizeTable;

// const SizeTable = () => {
//   const { lang, translations } = useLang()
//   const showQuickViewModal = useUnit($showQuickModal)

//   // говорит о том что мы работаем с логикой добавления товара в избранное
//   const isAddToFavorites = useUnit($isAddToFavorites)

//   // cartItemBySize - чтобы учитывать что мы можем открыть товар который уже в корзине
//   const {
//     selectedSize,
//     setSelectedSize,
//     handleAddToCart,
//     cartItemBySize,
//     addToCartSpinner,
//     currentCartItems,
//     updateCountSpinner,
//     product,
//   } = useCartAction(true)

//   const { addToFavoritesSpinner, setAddToFavoritesSpinner } = useFavoritesAction(product)

//   // условие дизайбла кнопки добавления товара в корзину
//   // пока юзер не выберет какой то размер, кнопка не становиться активной

//   const productSizes = useUnit($sizeTableSizes)
//   // const isRadishType = productSizes.type === 'radish'

//   const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS)
//   const currentFavoriteItems = currentFavoritesByAuth.filter(
//     (item) => item.productId === product._id
//   )

//   // находим конкретный товар из избранных товаров
//   // если совпадают и рамер и id
//   const favoritesItemBySize = currentFavoriteItems.find(
//     (item) => item.size === selectedSize
//   )

//   const handleSelectSSize = () => setSelectedSize('s')
//   const handleSelectMSize = () => setSelectedSize('m')
//   const handleSelectLSize = () => setSelectedSize('l')
//   const handleSelectXLSize = () => setSelectedSize('xl')
//   const handleSelectXXLSize = () => setSelectedSize('xxl')

//   //  проверяем выбранный рамер
//   const isSizeSelected = (size: string) => selectedSize === size

//   const checkInFavorites = (size: string) => currentFavoriteItems.find((item) => item.size === size)

//   const dressSizes = [
//     {
//       id: 1,
//       russianSize: '44-46',
//       manufacturerSize: 'S',
//       bust: '78-82',
//       waist: '58-62',
//       hipGirth: '86-90',
//       selectHandler: handleSelectSSize,
//       isSelected: isSizeSelected('s'),
//       isAvailable: productSizes.sizes.s,
//       isInFavorites: checkInFavorites('s'),
//     },
//     {
//       id: 2,
//       russianSize: '48-50',
//       manufacturerSize: 'M',
//       bust: '82-86',
//       waist: '62-66',
//       hipGirth: '90-94',
//       selectHandler: handleSelectMSize,
//       isSelected: isSizeSelected('m'),
//       isAvailable: productSizes.sizes.m,
//       isInFavorites: checkInFavorites('m'),
//     },
//     {
//       id: 3,
//       russianSize: '50',
//       manufacturerSize: 'L',
//       bust: '86-90',
//       waist: '66-70',
//       hipGirth: '94-98',
//       selectHandler: handleSelectLSize,
//       isSelected: isSizeSelected('l'),
//       isAvailable: productSizes.sizes.l,
//       isInFavorites: checkInFavorites('l'),
//     },
//     {
//       id: 4,
//       russianSize: '52-54',
//       manufacturerSize: 'XL',
//       bust: '90-94',
//       waist: '70-74',
//       hipGirth: '98-102',
//       selectHandler: handleSelectXLSize,
//       isSelected: isSizeSelected('xl'),
//       isAvailable: productSizes.sizes.xl,
//       isInFavorites: checkInFavorites('xl'),
//     },
//     {
//       id: 5,
//       russianSize: '56',
//       manufacturerSize: 'XXL',
//       bust: '94-98',
//       waist: '74-78',
//       hipGirth: '102-106',
//       selectHandler: handleSelectXXLSize,
//       isSelected: isSizeSelected('xxl'),
//       isAvailable: productSizes.sizes.xxl,
//       isInFavorites: checkInFavorites('xxl'),
//     },
//   ]

//   // передаем начальный count или тот что был у товара
//   // если он не был добавлен то начальный count = 1
//   const addToCart = () => handleAddToCart(+(cartItemBySize?.count || 1))

//   const trProps = (
//     item:
//       | {
//           id: number
//           russianSize: string
//           manufacturerSize: string
//           bust: string
//           waist: string
//           hipGirth: string
//           selectHandler: () => void
//           isSelected: boolean
//           isAvailable: boolean
//         }
//       | {
//           id: number
//           headCircumference: string
//           manufacturerSize: string
//           selectHandler: () => void
//           isSelected: boolean
//           isAvailable: boolean
//         }
//   ) => ({
//     onClick: item.selectHandler,
//     style: {
//       backgroundColor:
//         item.isSelected || selectedSize === item.manufacturerSize.toLowerCase()
//           ? '#9466FF'
//           : 'transparent',
//       pointerEvents: item.isAvailable ? 'auto' : 'none',
//       opacity: item.isAvailable ? 1 : 0.5,
//       color: item.isAvailable ? '#fff' : 'rgba(255, 255, 255, .2)',
//     },
//   })

//   const handleCloseSizeTable = () => closeSizeTableByCheck(showQuickViewModal)

//   // когда товар с размером
//   const handleAddProductToFavorites = () => {
//     // если не авторизован
//     if (!isUserAuth()) {
//       addFavoriteItemToLs(product, selectedSize)
//       return
//     }

//     // иначе, получаем данные из LS и проверяем добавлен он УЖЕ в избранное
//     if (favoritesItemBySize) {
//       toast.success('Добавлено в избранное!')
//       return
//     }

//     const auth = JSON.parse(localStorage.getItem('auth') as string)

//     const clientId = addFavoriteItemToLs(product, selectedSize, false)
//     addProductToFavorites({
//       jwt: auth.accessToken,
//       productId: product._id,
//       setSpinner: setAddToFavoritesSpinner,
//       size: selectedSize,
//       category: product.category,
//       clientId,
//     })
//   }

//   return (
//     <div
//       // className={`${styles.size_table} ${
//       //   isRadishType ? styles.size_table_headdress : ''
//       // }`}
//       className={`${styles.size_table}`}
//     >
//       <button
//         className={`btn-reset ${styles.size_table__close}`}
//         onClick={handleCloseSizeTable}
//       />
//       <h2 className={styles.size_table__title}>
//         {translations[lang].size_table.title}
//       </h2>
//       <div className={styles.size_table__inner}>
//         <table className={styles.size_table__table}>
//           <thead>
//             {/* {isRadishType ? (
//               <tr>
//                 <th>{translations[lang].size_table.head_circumference}</th>
//                 <th>{translations[lang].size_table.size}</th>
//               </tr>
//             ) : ( */}
//             <tr>
//               <th>{translations[lang].size_table.russian_size}</th>
//               <th>{translations[lang].size_table.manufacturer_size}</th>
//               <th>{translations[lang].size_table.chest_circumference}</th>
//               <th>{translations[lang].size_table.waist_circumference}</th>
//               <th>{translations[lang].size_table.hip_circumference}</th>
//             </tr>
//             {/* )} */}
//           </thead>
//           <tbody>
//             {dressSizes.map((item) => (
//               <tr
//                 key={item.id}
//                 {...(trProps(
//                   item
//                 ) as React.HTMLAttributes<HTMLTableRowElement>)}
//               >
//                 <td>
//                   {item.isInFavorites && (
//                     <span className={styles.size_table__favorite} />
//                   )}
//                   {item.russianSize}</td>
//                 <td>{item.manufacturerSize}</td>
//                 <td>{item.bust}</td>
//                 <td>{item.waist}</td>
//                 <td>
//                   <ProductCountBySize
//                     size={item.manufacturerSize}
//                     products={currentCartItems}
//                   />
//                   {item.hipGirth}
//                 </td>
//               </tr>
//             ))}
//             {/* } */}
//           </tbody>
//         </table>
//       </div>
//       <AddToCartBtn
//         handleAddToCart={isAddToFavorites ? handleAddProductToFavorites : addToCart}
//         addToCartSpinner={addToCartSpinner || updateCountSpinner || addToFavoritesSpinner}
//         btnDisabled={!!!selectedSize || addToCartSpinner || updateCountSpinner}
//         className={`${styles.size_table__btn} ${styles.size_table__btn_favorite}`}
//         text={isAddToFavorites ? translations[lang].product.to_favorite : translations[lang].product.to_cart}
//       />
//     </div>
//   )
// }

// export default SizeTable
