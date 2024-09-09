import {
  $products,
  loadProductsByFillterFx,
  loadProductsByFilter,
} from '@/context/goods'
import {
  checkOffsetParam,
  getSearchParamUrl,
  updateSearchParam,
} from '@/lib/utils/common'
import { SearchParams } from '@/types/catalog'
import { useUnit } from 'effector-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '@/styles/catalog/index.module.scss'

export const useProductFilters = (
  searchParams: SearchParams, // получаем со странице
  category: string,
  isCatalog = false
) => {
  const products = useUnit($products)
  const isValidOffset = checkOffsetParam(searchParams.offset)
  const pathname = usePathname()
  const productsSpinner = useUnit(loadProductsByFillterFx.pending)

  // для кол-ва страниц
  const pagesCount = Math.ceil((products.count || 12) / 12)

  // чтобы получать offset для текущей страницы
  const [currentPage, setCurrentPage] = useState(
    // чтобы после перезагрузки сохранялся currentPage
    isValidOffset ? +(searchParams.offset || 0) : 0
  )

  // на перрвый рендер запрашиваем данные о страницы
  useEffect(() => {
    const urlParams = getSearchParamUrl()

    // обновляем offset, чтобы он не дублировался
    // сначала удаляем
    urlParams.delete('offset')

    // затем делаем проверку
    if (!isValidOffset) {
      loadProductsByFilter({
        limit: 12,
        offset: 0,
        additionalParam: urlParams.toString(),
        isCatalog,
        category,
      })

      updateSearchParam('offset', 0, pathname)
      setCurrentPage(0)
      return
    }

    // если offset неправильный
    loadProductsByFilter({
      limit: 12 * +(searchParams.offset || 0) + 12,
      offset: +(searchParams.offset || 0) * 12,
      additionalParam: urlParams.toString(),
      isCatalog,
      category,
    })

    setCurrentPage(+(searchParams.offset || 0))
  }, [])

  // изменение страницы на пагинации
  const handlePageChange = ({ selected }: { selected: number }) => {
    // сначала необходимо ресетнут offset
    const urlParams = getSearchParamUrl()
    // обновляем offset, чтобы он не дублировался
    // сначала удаляем
    urlParams.delete('offset')

    // при переключение страницы обновляем запрос
    loadProductsByFilter({
      limit: 12 * selected + 12,
      offset: selected * 12,
      additionalParam: urlParams.toString(),
      isCatalog,
      category,
    })

    updateSearchParam('offset', selected, pathname)
    setCurrentPage(selected)
  }

  const handleApplyFiltersWithCategory = (categoryType: string) => {
    updateSearchParam('type', categoryType, pathname)
    handlePageChange({ selected: 0 }) // чтобы ресетнулась пагинация
  }

  const handleApplyFiltersWithPrice = (priceFrom: string, priceTo: string) => {
    updateSearchParam('priceFrom', priceFrom, pathname)
    updateSearchParam('priceTo', priceTo, pathname)
    handlePageChange({ selected: 0 }) // чтобы ресетнулась пагинация
  }

  const handleApplyFiltersWithSizes = (sizes: string[]) => {
    updateSearchParam(
      'sizes',
      encodeURIComponent(JSON.stringify(sizes)),
      pathname
    )
    handlePageChange({ selected: 0 })
  }

  const handleApplyFiltersWithColors = (sizes: string[]) => {
    updateSearchParam(
      'colors',
      encodeURIComponent(JSON.stringify(sizes)),
      pathname
    )
    handlePageChange({ selected: 0 })
  }

  const handleApplyFiltersBySort = (sort: string) => {
    const urlParams = getSearchParamUrl()
    const offset = urlParams.get('offset')

    updateSearchParam('sort', sort, pathname)

    handlePageChange({
      selected: checkOffsetParam(offset as string) ? +(offset || 0) : 0,
    })
  }

  // пропсы для ReactPaginate
  const paginationProps = {
    containerClassName: `list-reset ${styles.catalog__bottom__list}`,
    pageClassName: `catalog-pagination-item ${styles.catalog__bottom__list__item}`,
    pageLinkClassName: styles.catalog__bottom__list__item__link,
    previousClassName: `catalog-pagination-prev ${styles.catalog__bottom__list__prev}`,
    nextClassName: `catalog-pagination-next ${styles.catalog__bottom__list__next}`,
    breakClassName: styles.catalog__bottom__list__break,
    breakLinkClassName: styles.catalog__bottom__list__break__link,
    breakLabe: '...',
    pageCount: pagesCount,
    forcePage: currentPage,
  }

  return {
    paginationProps,
    products,
    pagesCount,
    productsSpinner,
    handlePageChange,
    handleApplyFiltersWithCategory,
    handleApplyFiltersWithPrice,
    handleApplyFiltersWithSizes,
    handleApplyFiltersWithColors,
    handleApplyFiltersBySort,
  }
}

// import { useUnit } from 'effector-react'
// import { usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { loadProductsByFillterFx, loadProductsByFilter } from '@/context/goods'
// import {
//   checkOffsetParam,
//   getSearchParamUrl,
//   updateSearchParam,
// } from '@/lib/utils/common'
// import { SearchParams } from '@/types/catalog'
// import styles from '@/styles/catalog/index.module.scss'
// import { $products } from '@/context/goods'

// export const useProductFilters = (
//   searchParams: SearchParams,
//   category: string,
//   isCatalog = false
// ) => {
//   const products = useUnit($products)
//   const isValidOffset = checkOffsetParam(searchParams.offset)
//   const pagesCount = Math.ceil((products.count || 12) / 12)
//   const [currentPage, setCurrentPage] = useState(
//     isValidOffset ? +(searchParams.offset || 0) : 0
//   )
//   const pathname = usePathname()
//   const productsSpinner = useUnit(loadProductsByFillterFx.pending)

//   useEffect(() => {
//     const urlParams = getSearchParamUrl()

//     urlParams.delete('offset')

//     if (!isValidOffset) {
//       loadProductsByFilter({
//         limit: 12,
//         offset: 0,
//         additionalParam: urlParams.toString(),
//         isCatalog,
//         category,
//       })

//       updateSearchParam('offset', 0, pathname)
//       setCurrentPage(0)
//       return
//     }

//     loadProductsByFilter({
//       limit: 12 * +(searchParams.offset || 0) + 12,
//       offset: +(searchParams.offset || 0) * 12,
//       additionalParam: urlParams.toString(),
//       isCatalog,
//       category,
//     })

//     setCurrentPage(+(searchParams.offset || 0))
//   }, [])

//   const handlePageChange = ({ selected }: { selected: number }) => {
//     const urlParams = getSearchParamUrl()

//     urlParams.delete('offset')

//     loadProductsByFilter({
//       limit: 12 * selected + 12,
//       offset: selected * 12,
//       additionalParam: urlParams.toString(),
//       isCatalog,
//       category,
//     })

//     updateSearchParam('offset', selected, pathname)
//     setCurrentPage(selected)
//   }

//   const handleApplyFiltersWithCategory = (categoryType: string) => {
//     updateSearchParam('type', categoryType, pathname)
//     handlePageChange({ selected: 0 })
//   }

//   const handleApplyFiltersWithPrice = (priceFrom: string, priceTo: string) => {
//     updateSearchParam('priceFrom', priceFrom, pathname)
//     updateSearchParam('priceTo', priceTo, pathname)
//     handlePageChange({ selected: 0 })
//   }

//   const handleApplyFiltersWithSizes = (sizes: string[]) => {
//     updateSearchParam(
//       'sizes',
//       encodeURIComponent(JSON.stringify(sizes)),
//       pathname
//     )
//     handlePageChange({ selected: 0 })
//   }

//   const handleApplyFiltersWithColors = (sizes: string[]) => {
//     updateSearchParam(
//       'colors',
//       encodeURIComponent(JSON.stringify(sizes)),
//       pathname
//     )
//     handlePageChange({ selected: 0 })
//   }

//   const handleApplyFiltersBySort = (sort: string) => {
//     const urlParams = getSearchParamUrl()
//     const offset = urlParams.get('offset')

//     updateSearchParam('sort', sort, pathname)
//     handlePageChange({
//       selected: checkOffsetParam(offset as string) ? +(offset || 0) : 0,
//     })
//   }

//   const paginationProps = {
//     containerClassName: `list-reset ${styles.catalog__bottom__list}`,
//     pageClassName: `catalog-pagination-item ${styles.catalog__bottom__list__item}`,
//     pageLinkClassName: styles.catalog__bottom__list__item__link,
//     previousClassName: `catalog-pagination-prev ${styles.catalog__bottom__list__prev}`,
//     nextClassName: `catalog-pagination-next ${styles.catalog__bottom__list__next}`,
//     breakClassName: styles.catalog__bottom__list__break,
//     breakLinkClassName: styles.catalog__bottom__list__break__link,
//     breakLabe: '...',
//     pageCount: pagesCount,
//     forcePage: currentPage,
//   }

//   return {
//     paginationProps,
//     products,
//     pagesCount,
//     productsSpinner,
//     handlePageChange,
//     handleApplyFiltersWithCategory,
//     handleApplyFiltersWithPrice,
//     handleApplyFiltersWithSizes,
//     handleApplyFiltersWithColors,
//     handleApplyFiltersBySort,
//   }
// }
