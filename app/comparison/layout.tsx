// children - это та страница которая вложена в Comparison

import ComparisonLayout from '@/components/layout/ComparisonLayout'

export const metadata = {
  title: 'ГринВорлд | Сравнение товаров',
}

export default function ComparisonRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ComparisonLayout>{children}</ComparisonLayout>
}
