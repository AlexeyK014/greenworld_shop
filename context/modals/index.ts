'use client'

import { createDomain } from 'effector'

export const modals = createDomain()

export const openMenu = modals.createEvent()
export const closeMenu = modals.createEvent()
export const openCatalogMenu = modals.createEvent()
export const closeCatalogMenu = modals.createEvent()
export const openSearchModal = modals.createEvent()
export const closeSearchModal = modals.createEvent()
export const closeQuickModal = modals.createEvent()
export const showQuickModal = modals.createEvent()
export const closeSizeTable = modals.createEvent()
export const showSizeTable = modals.createEvent()
export const openShareModal = modals.createEvent()
export const closeShareModal = modals.createEvent()
