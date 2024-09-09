import styles from '@/styles/catalog/index.module.scss'
import CheckBoxSelectItem from '../CheckBoxSelectItem'
import { useLang } from '@/hooks/useLang'
import { useSizeFiter } from '@/hooks/useSizeFilter'

const SizesFilter = ({
  handleApplyFiltersWithSizes,
}: {
  handleApplyFiltersWithSizes: (sizes: string[]) => void
}) => {
  const { lang, translations } = useLang()
  const { handleSelectSize, sizeOptions } = useSizeFiter(
    handleApplyFiltersWithSizes
  )

  return (
    <>
      <h3 className={styles.catalog__filters__popup__inner_title}>
        {translations[lang].catalog.size}
      </h3>
      <ul
        className={`list-reset ${styles.catalog__filters__list} ${styles.filters_mobile}`}
      >
        {sizeOptions.map((item) => (
          <CheckBoxSelectItem
            key={item.id}
            item={item}
            callback={handleSelectSize}
            mobileClassName={styles.filters_mobile}
          />
        ))}
      </ul>
    </>
  )
}

export default SizesFilter
