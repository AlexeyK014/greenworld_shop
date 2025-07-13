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
      {!spinner && (
        <div className={`list-reset ${styles.brands__list}`}>
          {/* Левый блок (последний элемент) */}
          {news?.length > 0 && (
            <div key={news[news.length - 1]._id} className={`${styles.brands__list__item} ${styles.bigItem}`}>
              <Link
                href={`/news/${news[news.length - 1]._id}`}
                className={`${styles.brands__list__item__link} ${styles.categories__img} ${imgSpinnerClass}`}
              >
                <div className={styles.thumb}>
                  <img
                    src={news[news.length - 1].images[0].url}
                    alt={translations[lang].main_page.brand_nature}
                    onLoad={handleLoadingImageComplete}
                  />
                </div>
                <span className={`${styles.brands__list__item__link__title}`}>
                  {news[news.length - 1].title}
                </span>
              </Link>
            </div>
          )}

          {/* Правый блок (7 предыдущих элементов) */}
          <div className={styles.smallItemsContainer}>
            {news?.slice(
              Math.max(news.length - 8, 0), // Начинаем с `length - 8` (чтобы взять 7 элементов + последний уже слева)
              news.length - 1                // Исключаем последний элемент (он уже слева)
            ).reverse()                      // Разворачиваем массив, чтобы шли от новых к старым
              .map((item) => (
                <div key={item._id} className={`${styles.brands__list__item} ${styles.smallItem}`}>
                  <Link
                    href={`/news/${item._id}`}
                    className={`${styles.brands__list__item__link} ${styles.categories__img} ${imgSpinnerClass}`}
                  >
                    <div className={styles.thumb}>
                      <img
                        src={item.images[0].url}
                        alt={translations[lang].main_page.brand_nature}
                        onLoad={handleLoadingImageComplete}
                      />
                      <div className={styles.overlay}></div>
                      <div className={styles.titleItem}>
                        {item.title}
                      </div>
                    </div>

                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* {isMedia490 && <MainSlider images={images} />} */}
    </>
  )
}

export default NewsItem
