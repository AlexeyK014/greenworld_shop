import styles from '@/styles/catalog/index.module.scss'
import { ISelectBtnProps } from '@/types/catalog'

const SelectBtn = ({
  open,
  toggle,
  dynamicText,
  defaultText,
  bgClassName,
}: ISelectBtnProps) => {
  console.log()

  return (
    <button
      className={`btn-reset ${styles.catalog__filters__btn} ${open ? styles.is_open : ''} ${bgClassName || ''}`}
      onClick={toggle}
    >
      {dynamicText ? (
        // когда есть маленький лэйбл и значение самого options
        <span className={styles.catalog__filters__btn__inner}>
          <span className={styles.catalog__filters__btn__text}>
            {defaultText}
          </span>
          <span className={styles.catalog__filters__btn__info}>
            {dynamicText}
          </span>
        </span>
      ) : (
        defaultText
      )}
    </button>
  )
}

export default SelectBtn
