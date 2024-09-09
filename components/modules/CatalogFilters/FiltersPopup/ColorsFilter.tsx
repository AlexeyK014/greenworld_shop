import { useColorsFilter } from '@/hooks/useColorsFilter'
import { useLang } from '@/hooks/useLang'
import styles from '@/styles/catalog/index.module.scss'
import CheckBoxSelectItem from '../CheckBoxSelectItem'

const ColorsFilter = ({
  handleApplyFiltersWithColors,
}: {
  handleApplyFiltersWithColors: (sizes: string[]) => void
}) => {
  const { lang, translations } = useLang()
  const { handleSelectColor, colorsOptions } = useColorsFilter(
    handleApplyFiltersWithColors
  )
  return (
    <>
      <h3 className={styles.catalog__filters__popup__inner_title}>
        {translations[lang].catalog.color}
      </h3>
      <ul
        className={`list-reset ${styles.catalog__filters__list} ${styles.filters_mobile}`}
      >
        {colorsOptions.map((item) => (
          <CheckBoxSelectItem
            key={item.id}
            item={item}
            callback={handleSelectColor}
            mobileClassName={styles.filters_mobile}
          />
        ))}
      </ul>
    </>
  )
}

export default ColorsFilter
