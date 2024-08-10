import { useCallback, useEffect } from 'react'
import { useCrumbText } from './useCrumbText'
// import { useLang } from './useLang'
import { usePageTitle } from './usePageTitle'

export const useBreadcrumbs = (page: string) => {
  // const { lang, translations } = useLang()
  const { crumbText } = useCrumbText(page)
  const getDefaultTextGenerator = useCallback(() => crumbText, [crumbText])
  const getTextGenerator = useCallback((param: string) => ({})[param], [])
  usePageTitle(page)

  // получаем последнюю хлебную крошку
  useEffect(() => {
    const lastCrumb = document.querySelector('.last-crumb') as HTMLElement

    // проверка, если мы находимся на странице и у нас есть последняя хлебная крошка
    // то мы ей динамически присваеваем название той страницы на которой мы находимся
    if (lastCrumb) {
      lastCrumb.textContent = crumbText
    }
  }, [crumbText])

  return { getDefaultTextGenerator, getTextGenerator }
}
