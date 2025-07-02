'use client'

import AllLink from '@/components/elements/AllLink/AllLink';
import useImagePreloader from '@/hooks/useImagePreloader';
import { useLang } from '@/hooks/useLang';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from '@/styles/main-page/index.module.scss';
import img1 from '@/public/img/news1.jpg';
import img2 from '@/public/img/news2.jpg';
import img3 from '@/public/img/news3.jpg';
import { useUnit } from 'effector-react';
import { $news } from '@/context/news/state';
import NewsItem from '../NewsBlock/NewsItem';
import { getNewsFx } from '@/context/news';
import { useEffect } from 'react';

const BrandLife = () => {
  const news = useUnit($news)
  console.log(news);

  useEffect(() => { getNewsFx(); }, []);

  const isMedia490 = useMediaQuery(490);
  const { handleLoadingImageComplete, imgSpinner } = useImagePreloader();
  const { lang, translations } = useLang();
  const imgSpinnerClass = imgSpinner ? styles.img_loading : '';

  const textWithNonBreakingSpace = (text: string) => text.replace(/\s/g, '\u00A0');

  const images = [
    { src: img1, id: 1, title: translations[lang].main_page.brand_nature },
    { src: img2, id: 2, title: translations[lang].main_page.brand_look },
    { src: img3, id: 3, title: translations[lang].main_page.brand_idea },
  ];

  return (
    <section className={styles.brands}>
      <div className={`container ${styles.brands__container}`}>
        <h2 className={`container ${styles.brands__title}`}>
          {translations[lang].main_page.our_news}
        </h2>
        <div className={styles.brands__inner}>
          <AllLink />
        </div>
        <div>
          <NewsItem />
        </div>
      </div>
    </section>
  );
};

export default BrandLife;
