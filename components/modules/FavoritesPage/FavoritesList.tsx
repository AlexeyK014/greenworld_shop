import { AnimatePresence, motion } from 'framer-motion'
import styles from '@/styles/favorites/index.module.scss'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import { basePropsForMotion } from '@/constants/motion'
import FavoriteListItem from './FavoriteListItem'
import { $favorites, $favoritesFromLS } from '@/context/favorites/state'

const FavoritesList = () => {
  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS) // для получения товаров

  return (
    <AnimatePresence>
      {currentFavoritesByAuth.map((item) => (
        <motion.li
          {...basePropsForMotion}
          key={item._id || item.clientId}
          className={styles.favorites__list__item}
        >
          <FavoriteListItem item={item} />
        </motion.li>
      ))}
    </AnimatePresence>
  )
}

export default FavoritesList
