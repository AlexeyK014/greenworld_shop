// import { useEffect, useState } from 'react'
// import { useLang } from './useLang'
// import {
//   checkPriceParam,
//   formatPrice,
//   getSearchParamUrl,
// } from '@/lib/utils/common'

// export const usePriceFilter = () => {
//   // тсэйты для цены стартовой и конечной
//   const [priceFrom, setPriceFrom] = useState('')
//   const [priceTo, setPriceTo] = useState('')
//   const { lang, translations } = useLang()

//   // для установки ренджа
//   const [priceInfo, setPriceInfo] = useState('')

//   // для изменения цены
//   const onPriceChange = (value: string, setState: (arg0: string) => void) =>
//     setState(value.replace(/[^0-9]+/g, '')) // только цифры в input

//   const handleChangePriceFrom = (e: React.ChangeEvent<HTMLInputElement>) =>
//     onPriceChange(e.target.value, setPriceFrom)

//   const handleChangePriceTo = (e: React.ChangeEvent<HTMLInputElement>) =>
//     onPriceChange(e.target.value, setPriceTo)

//   // для динамического изменения цены(setPriceInfo) в input
//   const priceFromInfo = (priceFrom: string) =>
//     `${translations[lang].catalog.from} ${formatPrice(+priceFrom)} P`

//   const priceToInfo = (priceTo: string) =>
//     `${translations[lang].catalog.to} ${formatPrice(+priceTo)} P`

//   // для обновления согласно query параметра
//   useEffect(() => {
//     const urlParams = getSearchParamUrl()

//     // получаем значения из query параметров из 'priceFrom' и 'priceTo'
//     const priceFromParam = urlParams.get('priceFrom')
//     const priceToParam = urlParams.get('priceTo')

//     // проверка что, это правильный формат цены(цифры)
//     if (priceFromParam && priceToParam) {
//       if (checkPriceParam(+priceFromParam) && checkPriceParam(+priceToParam)) {
//         // сэтаем стэйти чтобы появлялась информация о диапазоне цены
//         setPriceFrom(priceFromParam)
//         setPriceTo(priceToParam)
//         setPriceInfo(
//           `${priceFromInfo(priceFromParam)} ${priceToInfo(priceToParam)}`
//         )
//       }
//     }
//   }, [lang])

//   return {
//     priceFrom,
//     priceTo,
//     setPriceFrom,
//     setPriceTo,
//     handleChangePriceFrom,
//     handleChangePriceTo,
//     priceInfo,
//     setPriceInfo,
//     priceFromInfo,
//     priceToInfo,
//   }
// }

import { useEffect, useState } from 'react'
import { useLang } from './useLang'
import {
  checkPriceParam,
  formatPrice,
  getSearchParamUrl,
} from '@/lib/utils/common'

export const usePriceFilter = () => {
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const { lang, translations } = useLang()
  const [priceInfo, setPriceInfo] = useState('')

  const onPriceChange = (value: string, setState: (arg0: string) => void) =>
    setState(value.replace(/[^0-9]+/g, ''))

  const handleChangePriceFrom = (e: React.ChangeEvent<HTMLInputElement>) =>
    onPriceChange(e.target.value, setPriceFrom)

  const handleChangePriceTo = (e: React.ChangeEvent<HTMLInputElement>) =>
    onPriceChange(e.target.value, setPriceTo)

  const priceFromInfo = (priceFrom: string) =>
    `${translations[lang].catalog.from} ${formatPrice(+priceFrom)} ₽`

  const priceToInfo = (priceTo: string) =>
    `${translations[lang].catalog.to} ${formatPrice(+priceTo)} ₽`

  useEffect(() => {
    const urlParams = getSearchParamUrl()
    const priceFromParam = urlParams.get('priceFrom')
    const priceToParam = urlParams.get('priceTo')

    if (priceFromParam && priceToParam) {
      if (checkPriceParam(+priceFromParam) && checkPriceParam(+priceToParam)) {
        setPriceFrom(priceFromParam)
        setPriceTo(priceToParam)
        setPriceInfo(
          `${priceFromInfo(priceFromParam)} ${priceToInfo(priceToParam)}`
        )
      }
    }
  }, [lang])

  return {
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
  }
}
