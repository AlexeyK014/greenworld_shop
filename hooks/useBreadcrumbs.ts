// import { useCallback, useEffect, useState } from 'react'
// import { useCrumbText } from './useCrumbText'
// // import { useLang } from './useLang'
// import { usePageTitle } from './usePageTitle'
// import { useLang } from './useLang'
// import { usePathname } from 'next/navigation'

// export const useBreadcrumbs = (page: string) => {
//   const [dynamicTitle, setDynamicTitle] = useState('')
//   const breadcrumbs = document.querySelector('.breadcrumbs') as HTMLUListElement
//   const { lang, translations } = useLang()
//   const pathname = usePathname()
//   const { crumbText } = useCrumbText(page)
//   const getDefaultTextGenerator = useCallback(() => crumbText, [crumbText])
//   const getTextGenerator = useCallback((param: string) => ({})[param], [])
//   usePageTitle(page)
//   usePageTitle(page, dynamicTitle)

//   // для динамического изменения хлебной крошки
//   useEffect(() => {
//     const lastCrumbs = document.querySelector('.last-crumb') as HTMLElement

//     // получаем вторую часть url
//     if (lastCrumbs) {
//       const productTypePathname = pathname.split(`/${page}/`)[1]

//       // когда ешё не выбрали категорию
//       if (!productTypePathname) {
//         setDynamicTitle('')
//         lastCrumbs.textContent = crumbText
//         return
//       }

//       // иначе обновляем хлебную крошку под определённый тип
//       // получаем перевод, который совпадает с URL
//       const text = (
//         translations[lang][
//           page === 'comparison' ? 'comparison' : 'breadcrumbs'
//         ] as { [index: string]: string }
//       )[productTypePathname]
//       setDynamicTitle(text) // сэтим тип в title
//       lastCrumbs.textContent = text // последняя хлебная крошка
//     }
//   }, [breadcrumbs, crumbText, lang, pathname, translations, page])

//   return { getDefaultTextGenerator, getTextGenerator }
// }

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCrumbText } from './useCrumbText'
import { usePageTitle } from './usePageTitle'
import { useLang } from './useLang'
import { productCategory } from '@/constants/product'

export const useBreadcrumbs = (page: string) => {
  const [dynamicTitle, setDynamicTitle] = useState('')
  const { lang, translations } = useLang()
  const pathname = usePathname()
  const breadcrumbs = document.querySelector('.breadcrumbs') as HTMLUListElement
  const { crumbText } = useCrumbText(page)
  const getDefaultTextGenerator = useCallback(() => crumbText, [crumbText])
  const getTextGenerator = useCallback((param: string) => ({})[param], [])
  usePageTitle(page, dynamicTitle)

  useEffect(() => {
    const lastCrumb = document.querySelector('.last-crumb') as HTMLElement

    if (lastCrumb) {
      const productTypePathname = pathname.split(`/${page}/`)[1]

      if (!productTypePathname) {
        setDynamicTitle('')
        lastCrumb.textContent = crumbText
        return
      }

      if (!productCategory.some((item) => item === productTypePathname)) {
        return
      }

      const text = (
        translations[lang][
          page === 'comparison' ? 'comparison' : 'breadcrumbs'
        ] as { [index: string]: string }
      )[productTypePathname]
      setDynamicTitle(text)
      lastCrumb.textContent = text
    }
  }, [breadcrumbs, crumbText, lang, pathname, translations, page])

  return { getDefaultTextGenerator, getTextGenerator, breadcrumbs }
}
