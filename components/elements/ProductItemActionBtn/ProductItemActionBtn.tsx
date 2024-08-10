import styles from '@/styles/product-item-action-btn/index.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import Tooltip from '../Tooltip/Tooltip'
import tooltipStyles from '@/styles/tooltip/index.module.scss'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { IProductItemActionBtnProps } from '@/types/elements'

const ProductItemActionBtn = ({
  text,
  callback,
  iconClass,
  marginBottom,
  withTooltip = true,
}: IProductItemActionBtnProps) => {
  const [open, setOpen] = useState(false)
  const [tooltipLeft, setTooltipLeft] = useState(0) // для позиционирование слева
  const showTooltip = () => setOpen(true)
  const hideTooltip = () => setOpen(false)

  // для получения актуальной ширины
  const tooltipRef = useRef() as MutableRefObject<HTMLDivElement>

  // прроисходит проверка, что если tooltip открыт, позиционируем слева
  useEffect(() => {
    if (open && withTooltip) {
      setTooltipLeft(tooltipRef.current.clientWidth)
    }
  }, [open, withTooltip])

  return (
    <div className={styles.action}>
      <button
        className={`btn-reset ${styles.actions__btn} ${styles[iconClass]}`}
        onClick={callback}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ marginBottom: marginBottom || 16 }}
      />
      {withTooltip && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={tooltipStyles.tooltip}
              style={{ left: `-${tooltipLeft + 13}px` }}
              ref={tooltipRef}
            >
              <Tooltip text={text} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default ProductItemActionBtn
