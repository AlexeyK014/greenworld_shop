import { useCategoryFilter } from '@/hooks/useCategoryFilter'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useLang } from '@/hooks/useLang'
import styles from '@/styles/catalog/index.module.scss'
import { AnimatePresence } from 'framer-motion'
import CatalogFilterList from './CatalogFilterList'
import SelectBtn from './SelectBtn'

const CategorySelect = () => {
  const { lang, translations } = useLang()
  const { open, ref, toggle } = useClickOutside()
  const {
    currentOptions,
    catalogCategoryOptions,
    handleSelectAllCategories,
    option,
    allCategoriesTitle,
    setOption,
  } = useCategoryFilter()
  return (
    <div className={styles.catalog__filters__select} ref={ref}>
      <SelectBtn
        open={open}
        toggle={toggle}
        bgClassName={styles.bg_category}
        defaultText={translations[lang].catalog.categories}
        dynamicText={option}
      />
      <AnimatePresence>
        {open && (
          <CatalogFilterList
            currentOptions={currentOptions}
            catalogCategoryOptions={catalogCategoryOptions}
            handleSelectAllCategories={handleSelectAllCategories}
            option={option}
            allCategoriesTitle={allCategoriesTitle}
            setOption={setOption}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategorySelect
