import React, { useEffect } from 'react'
import styles from '@/styles/news/index.module.scss';
import { useUnit } from 'effector-react';
import { $currentNews, $news } from '@/context/news/state';
import Link from 'next/link';
import { getNewsFx } from '@/context/news';
import useImagePreloader from '@/hooks/useImagePreloader';
import { useLang } from '@/hooks/useLang';
import { INews } from '@/types/common';


const NewsPageContent = () => {
  const currentNews = useUnit($currentNews) as INews;
  const news = useUnit($news)  as INews[];
  const { lang, translations } = useLang();
  console.log(news);
  const { handleLoadingImageComplete, imgSpinner } = useImagePreloader();
  const imgSpinnerClass = imgSpinner ? styles.img_loading : '';

  useEffect(() => {
    getNewsFx() // Загружаем список новостей
    // Если currentNews тоже нужно загружать, добавьте соответствующую логику
  }, [])

  return (
    <div className={styles.news_content}>
      <div className={styles.news_content_left}>
        <div className={styles.news_content_left_title}>
          {currentNews.title}
        </div>

        <div className={styles.news_content_left_img}>
          <img
            className={styles.news_content_left_img_image}
            src={currentNews.images[0].url}
          />
        </div>

        <div className={styles.news_content_left_textPost}>
          {currentNews.text}
        </div>
      </div>
      <div className={styles.news_content_right}>
        <p className={styles.news_content_right_title}>Статьи</p>
        <div className={styles.news_content_right_links}>
          {news?.map((item) => (
            <div key={item._id} className={styles.news_content_right_linkItem}>
              <Link
                href={`/news/${item._id}`}
                className={styles.news_content_right_link}
              >
                <img
                  src={item.images[0].url}
                  alt={translations[lang].main_page.brand_nature}
                  className={styles.news_content_right_link__img}
                  onLoad={handleLoadingImageComplete}
                />
                <span className={item.title.length > 10 ? styles.longTitle : ''}>
                  {item.title}
                </span>
                {/* <span>{item.title}</span> */}

              </Link>
              <div className={styles.news_content_right_line}></div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

export default NewsPageContent
