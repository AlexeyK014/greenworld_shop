import { useDebounceCallback } from '@/hooks/useDebounceCallback'
import { useLang } from '@/hooks/useLang'
import { usePriceFilter } from '@/hooks/usePriceFilter'
import { getCheckedPriceFrom, getCheckedPriceTo } from '@/lib/utils/catalog'
import styles from '@/styles/catalog/index.module.scss'

const PriceFilter = ({
  handleApplyFiltersWithPrice,
}: {
  handleApplyFiltersWithPrice: (arg0: string, arg1: string) => void
}) => {
  const {
    priceFrom,
    priceTo,
    setPriceFrom,
    setPriceTo,
    handleChangePriceFrom,
    handleChangePriceTo,
  } = usePriceFilter()
  const { lang, translations } = useLang()
  const delayCallback = useDebounceCallback(2000)

  const onPriceFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangePriceFrom(e)

    // делаем проверку, чтобы оба фильтра были заполнены(фильтр применился)
    // ничего не происходит до те пока  инпуты заполнены
    if (!priceTo) {
      return
    }

    // если инпут будет заполнен, то при заполнение второго инпута нам нужно применить фильтры
    // передаём новый прайс, который поступает из инпута
    const validPriceFrom = getCheckedPriceFrom(
      +e.target.value.replace(/[^0-9]+/g, '') // только цифры
    ) as string
    const validPriceTo = getCheckedPriceTo(+priceTo) as string

    setPriceFrom(validPriceFrom)

    // как юзер заканчиват вводит данные в инпут - вызываем фун-ю для фильтраии
    delayCallback(() =>
      handleApplyFiltersWithPrice(validPriceFrom, validPriceTo)
    )
  }

  const onPriceToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangePriceTo(e)
    if (!priceFrom) {
      return
    }

    const validPriceFrom = getCheckedPriceFrom(+priceFrom) as string
    const validPriceTo = getCheckedPriceTo(
      +e.target.value.replace(/[^0-9]+/g, '') // только цифры
    ) as string

    setPriceTo(validPriceTo)

    // как юзер заканчиват вводит данные в инпут - вызываем фун-ю для фильтраии
    delayCallback(() =>
      handleApplyFiltersWithPrice(validPriceFrom, validPriceTo)
    )
  }
  return (
    <>
      <h3 className={styles.catalog__filters__popup__inner_title}>
        {translations[lang].catalog.price}
      </h3>
      <div
        className={`${styles.catalog__filters__list__item__inputs} ${styles.catalog__filters__popup__price__inputs}`}
      >
        <label>
          <span>{translations[lang].catalog.from}</span>
          <input
            type='text'
            placeholder='130 ₽'
            value={priceFrom}
            onChange={onPriceFromChange}
          />
        </label>
        <label>
          <span>{translations[lang].catalog.to}</span>
          <input
            type='text'
            placeholder='6 500 ₽'
            value={priceTo}
            onChange={onPriceToChange}
          />
        </label>
      </div>
    </>
  )
}

export default PriceFilter
