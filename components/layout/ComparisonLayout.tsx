'use client'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import { useCrumbText } from '@/hooks/useCrumbText'
import { useLang } from '@/hooks/useLang'
import { usePageTitle } from '@/hooks/usePageTitle'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../modules/Breadcrumbs/Breadcrumbs'
import HeadeingWithCount from '../elements/HeadingWithCount/HeadeingWithCount'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import {
  $comparison,
  $comparisonFromLS,
  $shouldShowEmptyComparison,
} from '@/context/comparison'
import { useComparisonLinks } from '@/hooks/useComparisonLinks'
import skeletonLinksStyles from '@/styles/comparison-links-skeleton/index.module.scss'
import skeletonListStyles from '@/styles/comparison-list-skeleton/index.module.scss'
import comparisonSkeleton from '@/styles/comparison-skeleton/index.module.scss'
import styles from '@/styles/comparison/index.module.scss'
import Skeleton from '../elements/Skeleton/Skeleton'
import ComparisonLinksList from '../modules/Comparison/ComparisonLinksList'
import EmptyPageContent from '../modules/EmptyPageContent/EmptyPageContent'
import { useUnit } from 'effector-react'
import { loginCheckFx } from '@/context/user'
import { isUserAuth } from '@/lib/utils/common'

const ComparisonLayout = ({ children }: { children: React.ReactNode }) => {
  // для динамического изменения title на странице
  const [dynamicTitle, setDynamicTitle] = useState('')

  const breadcrumbs = document.querySelector('.breadcrumbs') as HTMLUListElement
  const { lang, translations } = useLang()
  const { getDefaultTextGenerator, getTextGenerator } =
    useBreadcrumbs('comparison')
  const { crumbText } = useCrumbText('comparison')
  const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS)
  const { availableProductLinks, linksSpinner } = useComparisonLinks()
  const shouldShowEmptyComparison = useUnit($shouldShowEmptyComparison)
  const loginCheckSpinner = useUnit(loginCheckFx.pending)
  const mainSpinner = isUserAuth()
    ? linksSpinner || loginCheckSpinner
    : linksSpinner

  const pathname = usePathname()
  usePageTitle('comparison', dynamicTitle)

  // для динамического изменения хлебной крошки
  useEffect(() => {
    const lastCrumbs = document.querySelector('.last-crumb') as HTMLElement

    // получаем вторую часть url
    if (lastCrumbs) {
      const productTypePathname = pathname.split('/comparison/')[1]

      // когда ешё не выбрали категорию
      if (!productTypePathname) {
        setDynamicTitle('')
        lastCrumbs.textContent = crumbText
        return
      }

      // иначе обновляем хлебную крошку под определённый тип
      // получаем перевод, который совпадает с URL
      const text = (
        translations[lang].comparison as { [index: string]: string }
      )[productTypePathname]
      setDynamicTitle(text) // сэтим тип в title
      lastCrumbs.textContent = text // последняя хлебная крошка
    }
  }, [breadcrumbs, crumbText, lang, pathname, translations])

  return (
    <main>
      {/*  Когда буду товары сравнения */}
      {!shouldShowEmptyComparison ? (
        <section className={styles.comparison}>
          <Breadcrumbs
            getDefaultTextGenerator={getDefaultTextGenerator}
            getTextGenerator={getTextGenerator}
          />
          <div className='container'>
            <HeadeingWithCount
              count={currentComparisonByAuth.length}
              title={translations[lang].comparison.main_heading}
              spinner={false}
            />
            {!(pathname === '/comparison') &&
              (mainSpinner ? (
                <Skeleton styles={skeletonLinksStyles} />
              ) : (
                <ComparisonLinksList
                  links={availableProductLinks}
                  className={styles.comparison_links}
                />
              ))}
            <div>
              {/* будет список с табами */}
              {mainSpinner ? (
                pathname === '/comparison' ? (
                  <Skeleton styles={comparisonSkeleton} />
                ) : (
                  <Skeleton styles={skeletonListStyles} />
                )
              ) : (
                children
              )}
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className='container'>
            <EmptyPageContent
              subtitle={translations[lang].common.comparison_empty}
              description={translations[lang].common.comparison_empty_advice}
              btnText={translations[lang].common.go_catalog}
              bgClassName={styles.empty_bg}
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default ComparisonLayout
