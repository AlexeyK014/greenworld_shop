import styles from '@/styles/catalog/index.module.scss'
import CategorySelect from './CategorySelect'
import PriceSelect from './PriceSelect'
import { ICatalogFiltersProps } from '@/types/catalog'
import SizesSelect from './SizesSelect'
import ColorsSelect from './ColorsSelect'
import SortSelect from './SortSelect'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import { useUnit } from 'effector-react'
import { motion } from 'framer-motion'
import { basePropsForMotion } from '@/constants/motion'
import SelectInfoItem from './SelectInfoItem'
import FiltersPopup from './FiltersPopup/FiltersPopup'
import { addOverflowHiddenToBody } from '@/lib/utils/common'
import {
  setSizesOptions,
  setSizes,
  setColorsOptions,
  setColors,
  setFiltersPopup,
} from '@/context/catalog/index'
import { $sizeOptions, $colorsOptions } from '@/context/catalog/state'

const CatalogFilters = ({
  handleApplyFiltersWithPrice,
  handleApplyFiltersWithSizes,
  handleApplyFiltersWithColors,
  handleApplyFiltersBySort,
}: ICatalogFiltersProps) => {
  const isMedia910 = useMediaQuery(910)
  const isMedia610 = useMediaQuery(610)
  const sizesOptions = useUnit($sizeOptions)
  const colorsOptions = useUnit($colorsOptions)

  // обновление options
  const handleRemoveSizeOption = (id: number) => {
    const updatedOptions = sizesOptions.map((item) =>
      item.id === id ? { ...item, checked: false } : item
    )
    // чтобы обновлись внизу иконки с размерами. передаём обновившиеся options
    setSizesOptions(updatedOptions)

    // с помощью метода filter получаем обновлённые options, без тех на которых мы уже кликнули
    const updatedSizes = updatedOptions
      .filter((item) => item.checked)
      .map((item) => item.size)
    setSizes(updatedSizes)
    handleApplyFiltersWithSizes(updatedSizes)
  }
  const handleRemoveColorOption = (id: number) => {
    const updatedOptions = colorsOptions.map((item) =>
      item.id === id ? { ...item, checked: false } : item
    )
    // чтобы обновлись внизу иконки с размерами. передаём обновившиеся options
    setColorsOptions(updatedOptions)

    // с помощью метода filter получаем обновлённые options, без тех на которых мы уже кликнули
    const updatedColorsByText = updatedOptions
      // сначала проходим по updatedOptions, фильтруем их как checked
      .filter((item) => item.checked)
      .map(({ colorText }) => colorText) // через диструктуризацию достаём colorText
    const updatedColorsByCode = updatedOptions
      .filter((item) => item.checked)
      .map(({ colorCode }) => colorCode) // через диструктуризацию достаём colorText

    setColors(updatedColorsByText)
    handleApplyFiltersWithColors(updatedColorsByCode)
  }

  // для открытия попап
  const handleOpenPopup = () => {
    addOverflowHiddenToBody()
    setFiltersPopup(true)
  }
  return (
    <>
      <FiltersPopup
        handleApplyFiltersWithPrice={handleApplyFiltersWithPrice}
        handleApplyFiltersWithSizes={handleApplyFiltersWithSizes}
        handleApplyFiltersWithColors={handleApplyFiltersWithColors}
      />
      <div className={styles.catalog__filters}>
        <div className={styles.catalog__filters__top}>
          {!isMedia610 && (
            <>
              <div className={styles.catalog__filters__top__left}>
                <CategorySelect />
                {isMedia910 && (
                  <SizesSelect
                    handleApplyFiltersWithSizes={handleApplyFiltersWithSizes}
                  />
                )}
                <PriceSelect
                  handleApplyFiltersWithPrice={handleApplyFiltersWithPrice}
                />
              </div>
              {!isMedia910 && (
                <SizesSelect
                  handleApplyFiltersWithSizes={handleApplyFiltersWithSizes}
                />
              )}
              <div className={styles.catalog__filters__top__right}>
                <ColorsSelect
                  handleApplyFiltersWithColors={handleApplyFiltersWithColors}
                />
                <SortSelect
                  handleApplyFiltersBySort={handleApplyFiltersBySort}
                />
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
            {colorsOptions
              .filter((item) => item.checked)
              .map((item) => (
                <SelectInfoItem
                  key={item.id}
                  id={item.id}
                  text={item.colorText}
                  handleRemoveItem={handleRemoveColorOption}
                />
              ))}
          </motion.ul>
        </div>
      </div>
    </>
  )
}

export default CatalogFilters
