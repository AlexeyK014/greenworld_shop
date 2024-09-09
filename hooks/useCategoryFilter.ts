import { $catalogCategoryOptions } from '@/context/catalog'
// для логикик фильтров

import { useLang } from './useLang'
import { useUnit } from 'effector-react'
import { useEffect, useState } from 'react'
import { getSearchParamUrl } from '@/lib/utils/common'

export const useCategoryFilter = () => {
  const { lang, translations } = useLang()

  // чтобы получать options для конкретно выбранного селекта
  const catalogCategoryOptions = useUnit($catalogCategoryOptions)

  // чтобы получать значение выбранного селекта options на который кликнули
  const [option, setOption] = useState('')

  // чтобы получать массив тех options которые сетнулись
  const currentOptions = Object.values(catalogCategoryOptions)[0]

  // для options все категории, которые будут видны только на корневом layout
  const allCategoriesTitle = translations[lang].catalog.all_categories

  // сэтим в options
  const handleSelectAllCategories = () => setOption(allCategoriesTitle)

  // чтобы при перезагрузки сэтился выбранный options
  useEffect(() => {
    const urlParams = getSearchParamUrl()
    const typeParam = urlParams.get('type') // поределяем type

    // делаем проверку, если при перезагрузки есть этот параметр, чтоюы применился, делаем setOptions
    // в setOptions, получаем значение из переводов. Делаем проверку по тексту
    // если выделеный options будет равен тому title который наход в options, тогда isActive
    if (typeParam) {
      setOption(
        (translations[lang].comparison as { [index: string]: string })[
          typeParam
        ]
      )
    }
  }, [lang, translations])

  return {
    handleSelectAllCategories,
    currentOptions,
    option,
    setOption,
    catalogCategoryOptions,
    allCategoriesTitle,
  }
}
