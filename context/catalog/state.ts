'use client'

import {
  ICatalogCategoryOptions,
  ISizeOption,
  IColorOption,
} from '@/types/catalog'
import {
  setCatalogCategoryOptions,
  setSizesOptions,
  updateSizesOptionBySize,
  setColorsOptions,
  updateColorsOptionByCode,
  setSizes,
  setColors,
  setFiltersPopup,
  catalog,
} from '.'

export const $catalogCategoryOptions = catalog
  .createStore<ICatalogCategoryOptions>({})
  // возвращаем объект, где мы возвращаем объект с полем и у поля будет массив с options
  .on(setCatalogCategoryOptions, (_, options) => ({ ...options }))

export const $sizeOptions = catalog
  .createStore<ISizeOption[]>([
    { id: 1, size: 'S', checked: false },
    { id: 2, size: 'L', checked: false },
    { id: 3, size: 'M', checked: false },
    { id: 4, size: 'XL', checked: false },
    { id: 5, size: 'XXL', checked: false },
  ])
  .on(setSizesOptions, (_, options) => options)
  .on(updateSizesOptionBySize, (state, size) =>
    state.map((item) =>
      // проходимся по размерам с параметров поиска, если есть совпадения, тогда выделяем options
      // иначе возвращаем то что было
      item.size === size ? { ...item, checked: true } : item
    )
  )

export const $colorsOptions = catalog
  .createStore<IColorOption[]>([
    { id: 1, colorCode: 'purpure', checked: false, colorText: '' },
    { id: 2, colorCode: 'yellow', checked: false, colorText: '' },
    { id: 3, colorCode: 'orange', checked: false, colorText: '' },
    { id: 4, colorCode: 'black', checked: false, colorText: '' },
    { id: 5, colorCode: 'white', checked: false, colorText: '' },
  ])
  .on(setColorsOptions, (_, options) => options)
  .on(updateColorsOptionByCode, (state, color) =>
    state.map((item) =>
      // проходимся по размерам с параметров поиска, если есть совпадения, тогда выделяем options
      // иначе возвращаем то что было
      item.colorCode === color ? { ...item, checked: true } : item
    )
  )

export const $sizes = catalog
  .createStore<string[]>([])
  .on(setSizes, (_, sizes) => sizes)

export const $colors = catalog
  .createStore<string[]>([])
  .on(setColors, (_, colors) => colors)

export const $filtersPopup = catalog
  .createStore(false)
  .on(setFiltersPopup, (_, value) => value)
