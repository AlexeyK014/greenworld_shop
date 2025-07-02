import NewsPage from '@/components/templates/NewsPage/NewsPage';

export default function News({ params }: { params: { newsId: string;
  type: string
} }) {
  return <NewsPage newsId={params.newsId}
  type={params.type}
  />
}
