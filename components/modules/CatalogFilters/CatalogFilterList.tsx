/* eslint-disable max-len */
import { ICategoryFilterListProps } from '@/types/catalog'
import { motion } from 'framer-motion'
import styles from '@/styles/catalog/index.module.scss'
import Link from 'next/link'
import SelectItem from './SelectItem'
import { getSearchParamUrl } from '@/lib/utils/common'

const CatalogFilterList = ({
  mobileClassName,
  currentOptions,
  catalogCategoryOptions,
  handleSelectAllCategories,
  option,
  setOption,
  allCategoriesTitle,
}: ICategoryFilterListProps) => (
  <motion.ul
    className={`list-reset ${styles.catalog__filters__list} ${mobileClassName}`}
  >
    {/* Object.keys - проверяем на наличе ключа у стора catalogCategoryOptions */}
    {/* и если ключ НЕ равен ключу для корневого layout */}
    {/* либо мы показываем динамические options либо показываем options для корневого layout */}
    {currentOptions &&
      Object.keys(catalogCategoryOptions)[0] !== 'rootCategoryOptions' &&
      currentOptions.map((item) => (
        <SelectItem
          key={item.id}
          setOption={setOption}
          mobileClassName={mobileClassName}
          item={item}
          // option который сейчас выбран он равен title из item
          isActive={option === item.title}
        />
      ))}
    {catalogCategoryOptions.rootCategoryOptions && (
      <>
        <li
          className={`${styles.catalog__filters__list__item} ${mobileClassName} ${option === allCategoriesTitle ? styles.option_active : ''}`}
        >
          <button
            className={`btn-reset ${styles.catalog__filters__list__item__btn}`}
            onClick={handleSelectAllCategories}
          >
            {allCategoriesTitle}
          </button>
        </li>
        {catalogCategoryOptions.rootCategoryOptions.map((item) => (
          <li
            className={`${styles.catalog__filters__list__item} ${mobileClassName}`}
            key={item.id}
          >
            <Link
              className={styles.catalog__filters__list__item__btn}
              href={`${item.href}?${getSearchParamUrl().toString()}`} // чтобы query параметры добавились к url
            >
              {item.title}
            </Link>
          </li>
        ))}
      </>
    )}
  </motion.ul>
)

export default CatalogFilterList
