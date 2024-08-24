/* eslint-disable prettier/prettier */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable max-len */
'use client'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import {
  $favorites,
  $favoritesFromLS,
  $shouldShowEmptyFavorites,
  getFavoriteItemsFx,
} from '@/context/favorites'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import { useLang } from '@/hooks/useLang'
import { useUnit } from 'effector-react'
import styles from '@/styles/favorites/index.module.scss'
import cartSkeletonStyles from '@/styles/cart-skeleton/index.module.scss'
import HeadeingWithCount from '@/components/elements/HeadingWithCount/HeadeingWithCount'
import EmptyPageContent from '@/components/modules/EmptyPageContent/EmptyPageContent'
import { basePropsForMotion } from '@/constants/motion'
import { motion } from 'framer-motion'
import FavoritesList from '@/components/modules/FavoritesPage/FavoritesList'
import { isUserAuth } from '@/lib/utils/common'
import { loginCheckFx } from '@/context/user'

const FavoritesPage = () => {
  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS) // для получения товаров
  const { getDefaultTextGenerator, getTextGenerator } =
    useBreadcrumbs('favorites')
  const shouldShowEmptyFavorites = useUnit($shouldShowEmptyFavorites)
  const { lang, translations } = useLang()
  const favoriteSpinner = useUnit(getFavoriteItemsFx.pending)
  const loginCheckSpinner = useUnit(loginCheckFx.pending)

  return (
    <main>
      <Breadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
        getTextGenerator={getTextGenerator}
      />
      {!shouldShowEmptyFavorites ? (
        <section className={styles.favorites}>
          <div className={`container ${styles.favorites__container}`}>
            <HeadeingWithCount
              count={currentFavoritesByAuth.length}
              title={translations[lang].breadcrumbs.favorites}
              spinner={favoriteSpinner}
            />

            {/* если есть loginCheckSpinner, тогда берём значения для спиннера из favoriteSpinner || loginCheckSpinner
              иначе просто из favoriteSpinner
            */}
            {(isUserAuth()
              ? favoriteSpinner || loginCheckSpinner
              : favoriteSpinner) && (
                  <motion.ul
                  {...basePropsForMotion}
                  className={cartSkeletonStyles.skeleton}
                  >
                  {Array.from(new Array(3)).map((_, i) => (
                    <li key={i} className={cartSkeletonStyles.skeleton__item}>
                        <div
                        className={cartSkeletonStyles.skeleton__item__light}
                      />
                    </li>
                  ))}
                </motion.ul>
              )}
            {!favoriteSpinner && (
              <motion.ul
                {...basePropsForMotion}
                className={`list-reset ${styles.cart__list}`}
              >
                <FavoritesList />
              </motion.ul>
            )}
          </div>
        </section>
      ) : (
        <section>
          <div className='container'>
            <EmptyPageContent
              subtitle={translations[lang].common.favorites_empty}
              description={translations[lang].common.favorites_empty_advice}
              btnText={translations[lang].common.go_catalog}
              bgClassName={styles.empty_bg}
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default FavoritesPage
