'use client';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import styles from '@/styles/news/index.module.scss';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { $currentNews } from '@/context/news/state';
import { loadOneNews, loadOneNewsFx } from '@/context/news/index';
import { INewsPageProps } from '@/types/newsProps';
import NewsPageContent from '@/components/modules/NewsBlock/NewsPageContent';
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs';

const NewsPage = ({ newsId, type }: INewsPageProps) => {
  const news = useUnit($currentNews)
  const newsSpinner = useUnit(loadOneNewsFx.pending);
  usePageTitle(type, news.title);
  const { getDefaultTextGenerator, getTextGenerator } = useBreadcrumbs('news');

  // загрузка товароа на первый рейтинг
  useEffect(() => {
    loadOneNews({
      newsId,
      type,
    });
  }, []);

  return (
    <div className={styles.product}>
      <Breadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
        getTextGenerator={getTextGenerator}
      />
      {newsSpinner ? (
        <div className={styles.product__preloader}>
          <FontAwesomeIcon icon={faSpinner} spin size="8x" color="green" />
        </div>
      ) : (
        news.title &&
        <NewsPageContent />
      )}
    </div>
  );
};

export default NewsPage;
