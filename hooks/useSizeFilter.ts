// здесь отрабатывает фун-я при выборе options с размером
// будет применяться фильтр при выделение options сразу
// принимаем массив со строчками(размерами) и эти размеры сэтим в param и отправляем на бэк
// чтобы по ним возвращаеть те товары у которых есть эти размеры

import { useUnit } from 'effector-react'
import { useLang } from './useLang'
import { useEffect } from 'react'
import { getCheckedArrayParam, getSearchParamUrl } from '@/lib/utils/common'
import { allowedSizes } from '@/constants/product'
import {
  setSizes,
  setSizesOptions,
  updateSizesOptionBySize,
} from '@/context/catalog/index'
import { $sizeOptions, $sizes } from '@/context/catalog/state'

export const useSizeFiter = (
  handleApplyFiltersWithSizes: (arg0: string[]) => void
) => {
  const sizeOptions = useUnit($sizeOptions)
  const sizes = useUnit($sizes)
  const { lang } = useLang()

  const applySizes = (sizes: string[]) => {
    handleApplyFiltersWithSizes(sizes)
    setSizes(sizes)
  }

  // выполняется при нажатие на options(какой-то размер)
  const handleSelectSize = (id: number) => {
    // мы должны вернуть новый массив, обновляя тот options на который кликнули
    const updatedOptions = sizeOptions.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
    // чтобы обновлись внизу иконки с размерами. передаём обновившиеся options
    setSizesOptions(updatedOptions)

    // получаем размер options на который мы кликнули по id
    const currentOptions = updatedOptions.find((item) => item.id === id)

    // либо юзер кликнул и добавил новый размер, либо он кликнул на уже существующий размер
    // тогда по нему уже не будет идти фильтрация
    if (currentOptions && currentOptions.checked) {
      applySizes([...sizes, currentOptions.size])
      return
    }

    // если юзер кликлнул на уже выделенный размер и размер уже убрался. вызываем applySizes, но убираем размер
    // проходимся по сотоянию sizes, делаем filter, чтобы мне возвращались size не равен из currentOptions
    applySizes(sizes.filter((size) => size !== currentOptions?.size))
  }

  // после перезагрузки сэтим из searchParam sizes в наш стэйт
  useEffect(() => {
    const urlParams = getSearchParamUrl()
    const sizesParam = urlParams.get('sizes')

    if (sizesParam) {
      const validSizes = getCheckedArrayParam(sizesParam)

      if (
        validSizes &&
        validSizes.every((size) => allowedSizes.includes(size.toLowerCase()))
      ) {
        applySizes(validSizes)

        // чтобы options выделелились галочкой
        validSizes.forEach((size) => updateSizesOptionBySize(size))
      }
      return
    }
    setSizes([])
    setSizesOptions(
      sizeOptions.map((option) => ({ ...option, checked: false }))
    )
  }, [lang])
  return { handleSelectSize, sizeOptions, sizes }
}
