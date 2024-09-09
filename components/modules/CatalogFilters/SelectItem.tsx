import { loadProductsByFillterFx } from '@/context/goods'
import { ISelectItemProps } from '@/types/catalog'
import { useUnit } from 'effector-react'
import styles from '@/styles/catalog/index.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const SelectItem = ({
  isActive,
  mobileClassName,
  item,
  setOption,
}: ISelectItemProps) => {
  const spinner = useUnit(loadProductsByFillterFx.pending)

  // делает дефолтное условие, если isActive-значит фильтр уже применился и options выделен
  const handleSelectOptions = () => {
    if (isActive) {
      return
    }

    setOption(item.title)
    item.filterHandler()
  }
  return (
    <li
      className={`${styles.catalog__filters__list__item} ${
        spinner ? '' : isActive ? styles.option_active : ''
      } ${mobileClassName || ''}`}
    >
      {spinner && isActive && (
        <span
          className={`${styles.catalog__filters__list__item__spinner} ${mobileClassName}`}
        >
          <FontAwesomeIcon icon={faSpinner} spin color='#fff' />
        </span>
      )}
      {/* при нажатие, пока будет происходит запрос на сервер и применяться фильтрация у нас крутится спиннер */}
      <button
        onClick={handleSelectOptions}
        className={`btn-reset ${styles.catalog__filters__list__item__btn}`}
      >
        {item.title}
      </button>
    </li>
  )
}

export default SelectItem
