'use client'

import { getNewsFx } from '@/context/news';
import { $news } from '@/context/news/state';
import { INews } from '@/types/common';
import { useUnit } from 'effector-react';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import skeletonStyles from '@/styles/skeleton/index.module.scss';
import { basePropsForMotion } from '@/constants/motion';
import Link from 'next/link';
import useImagePreloader from '@/hooks/useImagePreloader';
import styles from '@/styles/newsList/index.module.scss';

const NewsPageList = () => {
  const news = useUnit($news) as INews[];
  const spinner = useUnit(getNewsFx.pending);
  const { handleLoadingImageComplete, imgSpinner } = useImagePreloader();
  const imgSpinnerClass = imgSpinner ? styles.img_loading : '';

  console.log(news);

  useEffect(() => {
    getNewsFx();
  }, []);

  return (
    <div  className={styles.news}>
      {spinner && (
        <motion.ul className={skeletonStyles.skeleton} {...basePropsForMotion}>
          {Array.from(new Array(10)).map((_, i) => (
            <li key={i} className={skeletonStyles.skeleton__item}>
              <div className={skeletonStyles.skeleton__item__light} />
            </li>
          ))}
        </motion.ul>
      )}
      {!spinner && (
        <div className={styles.news__list}>
          {news.map((item) => (
            <div key={item._id} className={`
            ${styles.news__list__item}`}>
              <Link
                href={`/news/${item._id}`}
                className={`${styles.news__list__item__link} ${styles.categories__img} ${imgSpinnerClass}`}
              >
                <div className={styles.thumb}>
                  <img
                    src={item.images[0].url}
                    alt={item.title}
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
      )}
    </div>
  )
}

export default NewsPageList
