'use client';

import { ICatalogCategoryOptions, ISizeOption, IColorOption } from '@/types/catalog';
import {
  setCatalogCategoryOptions,
  setSizesOptions,
  updateSizesOptionBySize,
  // setColorsOptions,
  // updateColorsOptionByCode,
  setSizes,
  // setColors,
  setFiltersPopup,
  catalog,
} from '.';

export const $catalogCategoryOptions = catalog
  .createStore<ICatalogCategoryOptions>({})
  // возвращаем объект, где мы возвращаем объект с полем и у поля будет массив с options
  .on(setCatalogCategoryOptions, (_, options) => ({ ...options }));

export const $sizeOptions = catalog
  .createStore<ISizeOption[]>([
    { id: 1, size: 'маленький', checked: false },
    { id: 2, size: 'средний', checked: false },
    { id: 3, size: 'большой', checked: false },
  ])
  .on(setSizesOptions, (_, options) => options)
  .on(updateSizesOptionBySize, (state, size) =>
    state.map((item) =>
      // проходимся по размерам с параметров поиска, если есть совпадения, тогда выделяем options
      // иначе возвращаем то что было
      item.size === size ? { ...item, checked: true } : item,
    ),
  );

export const $sizes = catalog.createStore<string[]>([]).on(setSizes, (_, sizes) => sizes);

export const $filtersPopup = catalog.createStore(false).on(setFiltersPopup, (_, value) => value);
