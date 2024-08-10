import { ISelectedSizes } from '@/types/common'
import { createDomain } from 'effector'

const sizeTable = createDomain()

export const setSizeTableSizes = sizeTable.createEvent<ISelectedSizes>()

export const $sizeTableSizes = sizeTable
  .createStore({} as ISelectedSizes)
  .on(setSizeTableSizes, (_, sizes) => sizes)
