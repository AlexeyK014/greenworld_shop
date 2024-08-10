import { useEffect } from 'react'
import { useLang } from './useLang'

export const usePageTitle = (page: string, additionalText = '') => {
  const { lang, translations } = useLang()

  // на первый рендер динамически изменяем title
  useEffect(() => {
    document.title = `${lang === 'ru' ? 'ГринВорлд' : 'GreenWorld'} | ${
      (translations[lang].breadcrumbs as { [index: string]: string })[page]
    }${additionalText ? ` - ${additionalText}` : ''}`
  }, [additionalText, lang, page, translations])
}
