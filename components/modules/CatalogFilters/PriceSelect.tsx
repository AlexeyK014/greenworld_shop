import { useClickOutside } from '@/hooks/useClickOutside'
import { useLang } from '@/hooks/useLang'
import { usePriceFilter } from '@/hooks/usePriceFilter'
import styles from '@/styles/catalog/index.module.scss'
import SelectBtn from './SelectBtn'
import { AnimatePresence, motion } from 'framer-motion'
import { basePropsForMotion } from '@/constants/motion'
import { getCheckedPriceFrom, getCheckedPriceTo } from '@/lib/utils/catalog'

const PriceSelect = ({
  handleApplyFiltersWithPrice,
}: {
  handleApplyFiltersWithPrice: (arg0: string, arg1: string) => void
}) => {
  const { lang, translations } = useLang()
  const { open, ref, toggle, setOpen } = useClickOutside()
  const {
    priceFrom,
    priceTo,
    setPriceFrom,
    setPriceTo,
    handleChangePriceFrom,
    handleChangePriceTo,
    priceInfo,
    setPriceInfo,
    priceFromInfo,
    priceToInfo,
  } = usePriceFilter()

  const handleSelectPrice = () => {
    // уст границы рэнджа, если юзер за них вышел
    const validPriceFrom = getCheckedPriceFrom(+priceFrom) as string
    const validPriceTo = getCheckedPriceTo(+priceTo) as string

    setPriceFrom(validPriceFrom)
    setPriceTo(validPriceTo)
    setPriceInfo(
      `${priceFromInfo(validPriceFrom)} ${priceToInfo(validPriceTo)}`
    )
    setOpen(false)
    handleApplyFiltersWithPrice(validPriceFrom, validPriceTo)
  }

  return (
    <div className={styles.catalog__filters__select} ref={ref}>
      <SelectBtn
        open={open}
        toggle={toggle}
        defaultText={translations[lang].catalog.price}
        dynamicText={priceInfo}
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            className={`list-reset ${styles.catalog__filters__list}`}
            {...basePropsForMotion}
          >
            <li
              className={`${styles.catalog__filters__list__item} ${styles.catalog__filters__list__item__price}`}
            >
              <div className={styles.catalog__filters__list__item__inputs}>
                <label>
                  <span>{translations[lang].catalog.from}</span>
                  <input
                    type='text'
                    placeholder='130 P'
                    value={priceFrom}
                    onChange={handleChangePriceFrom}
                  />
                </label>
                <label>
                  <span>{translations[lang].catalog.to}</span>
                  <input
                    type='text'
                    placeholder='10000 P'
                    value={priceTo}
                    onChange={handleChangePriceTo}
                  />
                </label>
              </div>
              <button
                className={`btn-reset ${styles.catalog__filters__list__item__done}`}
                disabled={!priceFrom || !priceTo}
                onClick={handleSelectPrice}
              >
                {translations[lang].catalog.done}
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PriceSelect
