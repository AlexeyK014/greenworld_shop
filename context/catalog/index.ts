'use client'

import {
  ICatalogCategoryOptions,
  ISizeOption,
  IColorOption,
} from '@/types/catalog'
import { createDomain } from 'effector'

export const catalog = createDomain()

// необходим будет только один options, в зависимости где находится пользователь
export const setCatalogCategoryOptions =
  catalog.createEvent<Partial<ICatalogCategoryOptions>>()
export const setSizesOptions = catalog.createEvent<ISizeOption[]>()
export const setColorsOptions = catalog.createEvent<IColorOption[]>()

// для изменение размера в нижней части
export const setSizes = catalog.createEvent<string[]>()
export const setColors = catalog.createEvent<string[]>()
export const setFiltersPopup = catalog.createEvent<boolean>()

// чтобы после перезагрузки обновлять фильтры по параметрам поиска
// принимает строку(размер) и по этой строке выделяет checkbox - true
export const updateSizesOptionBySize = catalog.createEvent<string>()
export const updateColorsOptionByCode = catalog.createEvent<string>()
