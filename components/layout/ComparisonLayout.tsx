'use client';
import { useUnit } from 'effector-react';
import { usePathname } from 'next/navigation';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useLang } from '@/hooks/useLang';
import Breadcrumbs from '../modules/Breadcrumbs/Breadcrumbs';
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth';
import { useComparisonLinks } from '@/hooks/useComparisonLinks';
import Skeleton from '../elements/Skeleton/Skeleton';
import ComparisonLinksList from '../modules/Comparison/ComparisonLinksList';
import EmptyPageContent from '../modules/EmptyPageContent/EmptyPageContent';
import { loginCheckFx } from '@/context/user';
import { isUserAuth } from '@/lib/utils/common';
import {
  $comparison,
  $comparisonFromLS,
  $shouldShowEmptyComparison,
} from '@/context/comparison/state';
import styles from '@/styles/comparison/index.module.scss';
import skeletonLinksStyles from '@/styles/comparison-links-skeleton/index.module.scss';
import skeletonListsStyles from '@/styles/comparison-list-skeleton/index.module.scss';
import comparisonSkeleton from '@/styles/comparison-skeleton/index.module.scss';
import HeadeingWithCount from '../elements/HeadingWithCount/HeadeingWithCount';

const ComparisonLayout = ({ children }: { children: React.ReactNode }) => {
  const { lang, translations } = useLang();
  const { getDefaultTextGenerator, getTextGenerator } = useBreadcrumbs('comparison');
  const pathname = usePathname();
  const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS);
  const { availableProductLinks, linksSpinner } = useComparisonLinks();
  const shouldShowEmptyComparison = useUnit($shouldShowEmptyComparison);
  const loginCheckSpinner = useUnit(loginCheckFx.pending);
  const mainSpinner = isUserAuth() ? linksSpinner || loginCheckSpinner : linksSpinner;

  return (
    <main>
      {!shouldShowEmptyComparison ? (
        <section className={styles.comparison}>
          <Breadcrumbs
            getDefaultTextGenerator={getDefaultTextGenerator}
            getTextGenerator={getTextGenerator}
          />
          <div className="container">
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
              {mainSpinner ? (
                pathname === '/comparison' ? (
                  <Skeleton styles={comparisonSkeleton} />
                ) : (
                  <Skeleton styles={skeletonListsStyles} />
                )
              ) : (
                children
              )}
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="container">
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
  );
};
export default ComparisonLayout;

// 'use client'
// import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
// import { useLang } from '@/hooks/useLang'
// import { usePathname } from 'next/navigation'
// import Breadcrumbs from '../modules/Breadcrumbs/Breadcrumbs'
// import HeadeingWithCount from '../elements/HeadingWithCount/HeadeingWithCount'
// import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
// import { useComparisonLinks } from '@/hooks/useComparisonLinks'
// import skeletonLinksStyles from '@/styles/comparison-links-skeleton/index.module.scss'
// import skeletonListStyles from '@/styles/comparison-list-skeleton/index.module.scss'
// import comparisonSkeleton from '@/styles/comparison-skeleton/index.module.scss'
// import styles from '@/styles/comparison/index.module.scss'
// import Skeleton from '../elements/Skeleton/Skeleton'
// import ComparisonLinksList from '../modules/Comparison/ComparisonLinksList'
// import EmptyPageContent from '../modules/EmptyPageContent/EmptyPageContent'
// import { useUnit } from 'effector-react'
// import { loginCheckFx } from '@/context/user/index'
// import { isUserAuth } from '@/lib/utils/common'
// import {
//   $comparison,
//   $comparisonFromLS,
//   $shouldShowEmptyComparison,
// } from '@/context/comparison/state'

// const ComparisonLayout = ({ children }: { children: React.ReactNode }) => {
//   // для динамического изменения title на странице
//   // const [dynamicTitle, setDynamicTitle] = useState('')
//   // const { crumbText } = useCrumbText('comparison')
//   // const breadcrumbs = document.querySelector('.breadcrumbs') as HTMLUListElement
//   const { lang, translations } = useLang()
//   const pathname = usePathname()
//   const { getDefaultTextGenerator, getTextGenerator } =
//     useBreadcrumbs('comparison')
//   const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS)
//   const { availableProductLinks, linksSpinner } = useComparisonLinks()
//   const shouldShowEmptyComparison = useUnit($shouldShowEmptyComparison)
//   const loginCheckSpinner = useUnit(loginCheckFx.pending)
//   const mainSpinner = isUserAuth()
//     ? linksSpinner || loginCheckSpinner
//     : linksSpinner

//   return (
//     <main>
//       {/*  Когда буду товары сравнения */}
//       {!shouldShowEmptyComparison ? (
//         <section className={styles.comparison}>
//           <Breadcrumbs
//             getDefaultTextGenerator={getDefaultTextGenerator}
//             getTextGenerator={getTextGenerator}
//           />
//           <div className='container'>
//             <HeadeingWithCount
//               count={currentComparisonByAuth.length}
//               title={translations[lang].comparison.main_heading}
//               spinner={false}
//             />
//             {!(pathname === '/comparison') &&
//               (mainSpinner ? (
//                 <Skeleton styles={skeletonLinksStyles} />
//               ) : (
//                 <ComparisonLinksList
//                   links={availableProductLinks}
//                   className={styles.comparison_links}
//                 />
//               ))}
//             <div>
//               {/* будет список с табами */}
//               {mainSpinner ? (
//                 pathname === '/comparison' ? ( // доп проверка
//                   <Skeleton styles={comparisonSkeleton} />
//                 ) : (
//                   <Skeleton styles={skeletonListStyles} />
//                 )
//               ) : (
//                 children
//               )}
//             </div>
//           </div>
//         </section>
//       ) : (
//         <section>
//           <div className='container'>
//             <EmptyPageContent
//               subtitle={translations[lang].common.comparison_empty}
//               description={translations[lang].common.comparison_empty_advice}
//               btnText={translations[lang].common.go_catalog}
//               bgClassName={styles.empty_bg}
//             />
//           </div>
//         </section>
//       )}
//     </main>
//   )
// }

// export default ComparisonLayout
