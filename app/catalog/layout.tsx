// children - это та страница которая вложена в Comparison

import CatalogLayout from '@/components/layout/CatalogLayout'

export const metadata = {
  title: 'ГринВорлд | Каталог',
}

export default function ComparisonRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CatalogLayout>{children}</CatalogLayout>
}
