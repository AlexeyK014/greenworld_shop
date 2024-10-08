import { AnimatePresence, motion } from 'framer-motion'
import styles from '@/styles/cart-page/index.module.scss'
import { basePropsForMotion } from '@/constants/motion'
import CartListItem from './CartListItem'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import { $cart, $cartFromLs } from '@/context/cart/state'

const CartList = () => {
  const currentCartByAuth = useGoodsByAuth($cart, $cartFromLs)

  return (
    <>
      <AnimatePresence>
        {currentCartByAuth.map((item) => (
          <motion.li
            key={item._id || item.clientId}
            {...basePropsForMotion}
            className={styles.cart__list__item}
          >
            <CartListItem item={item} />
          </motion.li>
        ))}
      </AnimatePresence>
    </>
  )
}

export default CartList
