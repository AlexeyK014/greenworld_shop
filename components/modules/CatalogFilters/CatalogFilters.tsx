import styles from '@/styles/catalog/index.module.scss';
import CategorySelect from './CategorySelect';
import PriceSelect from './PriceSelect';
import { ICatalogFiltersProps } from '@/types/catalog';
import SizesSelect from './SizesSelect';
import SortSelect from './SortSelect';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { useUnit } from 'effector-react';
import { motion } from 'framer-motion';
import { basePropsForMotion } from '@/constants/motion';
import SelectInfoItem from './SelectInfoItem';
import FiltersPopup from './FiltersPopup/FiltersPopup';
import { addOverflowHiddenToBody } from '@/lib/utils/common';
import { setSizesOptions, setSizes, setFiltersPopup } from '@/context/catalog/index';
import { $sizeOptions } from '@/context/catalog/state';

const CatalogFilters = ({
  handleApplyFiltersWithPrice,
  handleApplyFiltersWithSizes,
  handleApplyFiltersWithColors,
  handleApplyFiltersBySort,
}: ICatalogFiltersProps) => {
  const isMedia910 = useMediaQuery(910);
  const isMedia610 = useMediaQuery(610);
  const sizesOptions = useUnit($sizeOptions);

  // удаляются и обновляются items
  const handleRemoveSizeOption = (id: number) => {
    // обновление item который удаляем
    const updatedOptions = sizesOptions.map((item) =>
      item.id === id ? { ...item, checked: false } : item,
    );
    // чтобы обновлись внизу иконки с размерами. передаём обновившиеся options
    setSizesOptions(updatedOptions);

    // с помощью метода filter получаем обновлённые options, без тех на которых мы уже кликнули
    const updatedSizes = updatedOptions.filter((item) => item.checked).map((item) => item.size); // получаем обновлённый массив с items

    setSizes(updatedSizes);
    handleApplyFiltersWithSizes(updatedSizes);
  };

  // для открытия попап
  const handleOpenPopup = () => {
    addOverflowHiddenToBody();
    setFiltersPopup(true);
  };
  return (
    <>
      <FiltersPopup
        handleApplyFiltersWithPrice={handleApplyFiltersWithPrice}
        handleApplyFiltersWithSizes={handleApplyFiltersWithSizes}
        handleApplyFiltersWithColors={handleApplyFiltersWithColors}
      />
      <div className={styles.catalog__filters}>
        <div className={styles.catalog__filters__top}>
          <div className={styles.catalog__filters__top__container}>
            {!isMedia610 && (
              <>
                <div className={styles.catalog__filters__top__left}>
                  <CategorySelect />
                  {isMedia910 && (
                    <SizesSelect handleApplyFiltersWithSizes={handleApplyFiltersWithSizes} />
                  )}
                  <PriceSelect handleApplyFiltersWithPrice={handleApplyFiltersWithPrice} />
                </div>
                {!isMedia910 && (
                  <SizesSelect handleApplyFiltersWithSizes={handleApplyFiltersWithSizes} />
                )}
                <div className={styles.catalog__filters__top__right}>
                  {/* <ColorsSelect
                  handleApplyFiltersWithColors={handleApplyFiltersWithColors}
                /> */}
                  <SortSelect handleApplyFiltersBySort={handleApplyFiltersBySort} />
                </div>
              </>
            )}
            {isMedia610 && (
              <>
                <SortSelect handleApplyFiltersBySort={handleApplyFiltersBySort} />
                <button
                  onClick={handleOpenPopup}
                  className={`btn-reset ${styles.catalog__filters__top__filter_btn}`}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.catalog__filters__bottom}>
          <motion.ul
            className={`list-reset ${styles.catalog__filters__bottom__list}`}
            {...basePropsForMotion}
          >
            {sizesOptions
              .filter((item) => item.checked)
              .map((item) => (
                <SelectInfoItem
                  key={item.id}
                  id={item.id}
                  text={item.size}
                  handleRemoveItem={handleRemoveSizeOption}
                />
              ))}
          </motion.ul>
        </div>
      </div>
    </>
  );
};

export default CatalogFilters;
