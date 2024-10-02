import { useLang } from './useLang'
import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import { getCheckedArrayParam, getSearchParamUrl } from '@/lib/utils/common'
import {
  setColorsOptions,
  setColors,
  updateColorsOptionByCode,
} from '@/context/catalog/index'
import { $colorsOptions, $colors } from '@/context/catalog/state'

export const useColorsFilter = (
  handleApplyFiltersWithColors: (arg0: string[]) => void
) => {
  const { lang, translations } = useLang()
  const colorsOptions = useUnit($colorsOptions)
  const colors = useUnit($colors)

  const handleSelectColor = (id: number) => {
    const updatedOptions = colorsOptions.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )

    setColorsOptions(updatedOptions)

    const currentOptions = updatedOptions.find((item) => item.id === id)

    ////////  Вариант когда добавился новый цвет //////////
    // colorText - необходим чтобы показывать его юзерам, он зависит от переводов
    if (currentOptions && currentOptions.checked) {
      setColors([...colors, currentOptions.colorText])

      // получаем все выделеные options. Фильтруем массив где option.checked
      // затем по проходимся по отфильтрованному массиву и преобразовываем массив в строчки где есть коды цветов
      handleApplyFiltersWithColors(
        updatedOptions
          .filter((option) => option.checked)
          .map((option) => option.colorCode)
      )
      return
    }

    ///////// Вариант когда цвет убрался /////////////////
    // цвте был выделен, юзер нажал и цвет пропал

    // сначала обновляем то что показываеться юзеру для текста, а потом коды цветов
    // делаем фильтрайию, получаем каждый color и возвращаем те на которых нажали
    const updatedColorByText = colors.filter(
      (color) => color !== currentOptions?.colorText
    )

    // здесь updatedColorByText, точно число на которых кликнули
    // методом find находим тотoptions который совпадает с color
    const updatedColorsByCode = updatedColorByText.map(
      (color) =>
        colorsOptions.find((option) => option.colorText === color)?.colorCode
    )

    setColors(updatedColorByText)
    handleApplyFiltersWithColors(updatedColorsByCode as string[])
  }

  //  применяет переводы и после перезагрузки сэтит необходимое в стэйт, чтобы сохр стэйт для селектора
  useEffect(() => {
    const urlParams = getSearchParamUrl()
    const colorsParam = urlParams.get('colors')
    const updatedColorOptions = colorsOptions.map((option) => ({
      ...option,
      colorText: (translations[lang].catalog as { [index: string]: string })[
        option.colorCode
      ],
    }))

    setColorsOptions(updatedColorOptions)
    setColors(
      updatedColorOptions
        .filter((option) => option.checked)
        .map((option) => option.colorText)
    )

    if (colorsParam) {
      const validColors = getCheckedArrayParam(colorsParam)

      if (validColors) {
        setColors(
          validColors.map(
            (color) =>
              (translations[lang].catalog as { [index: string]: string })[color]
          )
        )
        handleApplyFiltersWithColors(validColors)
        validColors.forEach((color) => updateColorsOptionByCode(color))
      }
      return
    }

    setColors([])
    setColorsOptions(
      colorsOptions.map((option) => ({
        ...option,
        checked: false,
        colorText: (translations[lang].catalog as { [index: string]: string })[
          option.colorCode
        ],
      }))
    )
  }, [lang])

  return { handleSelectColor, colors, colorsOptions }
}
