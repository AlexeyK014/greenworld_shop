import { IProductInfoAccordionProps } from '@/types/product'
import styles from '@/styles/product/index.module.scss'
import Accordion from '../Accordion/Accordion'

const ProductInfoAccordion = ({
  children,
  title,
}: IProductInfoAccordionProps) => (
  <Accordion
    title={`${title}:`}
    titleClass={styles.product__top__description__btn}
    rotateIconClass={styles.expanded}
  >
    {children}
  </Accordion>
)

export default ProductInfoAccordion
