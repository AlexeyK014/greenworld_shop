import { $news } from '@/context/news/state';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useUnit } from 'effector-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import styles from '@/styles/main-page/index.module.scss';
import { useLang } from '@/hooks/useLang';
import useImagePreloader from '@/hooks/useImagePreloader';
import { MainSlider } from '../MainPage/MainSlide';
import img1 from '@/public/img/news1.jpg';
import img2 from '@/public/img/news2.jpg';
import img3 from '@/public/img/news3.jpg';
import { getNewsFx } from '@/context/news';
import { basePropsForMotion } from '@/constants/motion';
import { motion } from 'framer-motion';
import skeletonStyles from '@/styles/skeleton/index.module.scss';
import { INews } from '@/types/common';

const NewsItem = () => {
  const news = useUnit($news) as INews[]

  console.log(news);

  useEffect(() => {
    getNewsFx();
  }, []);

  const spinner = useUnit(getNewsFx.pending);

  const isMedia490 = useMediaQuery(490);
  const { lang, translations } = useLang();
  const { handleLoadingImageComplete, imgSpinner } = useImagePreloader();
  const images = [
    { src: img1, id: 1, title: translations[lang].main_page.brand_nature },
    { src: img2, id: 2, title: translations[lang].main_page.brand_look },
    { src: img3, id: 3, title: translations[lang].main_page.brand_idea },
  ];
  const imgSpinnerClass = imgSpinner ? styles.img_loading : '';

  return (
    <>
      {spinner && (
        <motion.ul className={skeletonStyles.skeleton} {...basePropsForMotion}>
          {Array.from(new Array(3)).map((_, i) => (
            <li key={i} className={skeletonStyles.skeleton__item}>
              <div className={skeletonStyles.skeleton__item__light} />
            </li>
          ))}
        </motion.ul>
      )}
      {!spinner && !isMedia490 && (
        <div className={`list-reset ${styles.brands__list}`}>
          {news?.map((item) => (
            <div key={item._id} className={`${styles.brands__list__item}`}>
              <Link
                href={`/news/${item._id}`}
                className={`${styles.brands__list__item__link} ${styles.categories__img} ${imgSpinnerClass}`}
              >
                <img
                  src={item.images[0].url}
                  alt={translations[lang].main_page.brand_nature}
                  onLoad={handleLoadingImageComplete}
                />
                <span className={`${styles.brands__list__item__link__title}`}>{item.title}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
      {isMedia490 && <MainSlider images={images} />}
    </>
  )
}

export default NewsItem
