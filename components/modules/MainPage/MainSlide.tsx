import useImagePreloader from '@/hooks/useImagePreloader'
import styles from '@/styles/main-page/index.module.scss'
import Slider from 'react-slick'
import Image, { StaticImageData } from 'next/image'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Link from 'next/link'
import { useEffect } from 'react'

export const MainSlider = ({
  images,
}: {
  images: {
    src: StaticImageData
    id: number
    title: string
  }[]
}) => {
  const isMedia420 = useMediaQuery(420)
  const { handleLoadingImageComplete, imgSpinner } = useImagePreloader()
  const imgSpinnerClass = imgSpinner ? styles.img_loading : ''
  const settings = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    variableWidth: true,
    autoplay: true,
    speed: 500,
    arrows: false,
  }

  useEffect(() => {
    // обращаемся к слайдеру, и меняем ему ширину
    const slider = document.querySelectorAll(`.${styles.categories__slider}`)
    slider.forEach((item) => {
      const list = item.querySelector('.slick-list') as HTMLElement

      list.style.height = isMedia420 ? '290px' : '357px'
      list.style.marginRight = '-15px'
    })
  }, [isMedia420])

  return (
    <Slider {...settings} className={styles.categoties__slider}>
      {images.map((item) => (
        <Link
          key={item.id}
          style={{ width: isMedia420 ? 290 : 357 }}
          className={`${styles.categories__slide} ${styles.categories__img} ${imgSpinnerClass}`}
          href='/catalog'
        >
          <Image
            src={item.src}
            alt={item.title}
            width={357}
            height={357}
            onLoad={handleLoadingImageComplete}
          />
          {/* заменяем пробелы символом неразрывного пробела */}
          <span>{item.title.replace(/\s/g, '\u00A0')}</span>
        </Link>
      ))}
    </Slider>
  )
}
