import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from '@/styles/product/index.module.scss'
import ProductImagesItem from './ProductImagesItem'
import Slider from 'react-slick'
import { useProductImages } from '@/hooks/useProfuctImages'
import { useUnit } from 'effector-react'
import { $currentProduct } from '@/context/goods/state'
import { baseSliderSettings } from '@/constants/slider'

const ProductImages = () => {
  const product = useUnit($currentProduct)
  const images = useProductImages(product)

  const isMedia1420 = useMediaQuery(1420)
  const isMedia1040 = useMediaQuery(1040)
  const isMedia520 = useMediaQuery(520) // для слайдера
  const isMedia420 = useMediaQuery(420) // для слайдера

  // делаем проверку, если у нас будет маленькое разрешение
  const imgSize = isMedia1040 ? 230 : isMedia1420 ? 280 : 480

  // переменная для размера картинки на слайдере
  const slideImgSize = isMedia420 ? 280 : 431

  return (
    <>
      {!isMedia520 && (
        <ul className={`list-reset ${styles.product__top__images}`}>
          {images.map((img) => (
            <ProductImagesItem key={img.id} image={img} imgSize={imgSize} />
          ))}
        </ul>
      )}
      {isMedia520 && (
        <Slider
          {...baseSliderSettings}
          className={styles.product__top__images__slider}
        >
          {images.map((img) => (
            <ProductImagesItem
              key={img.id}
              image={img}
              imgSize={slideImgSize}
            />
          ))}
        </Slider>
      )}
    </>
  )
}

export default ProductImages
