'use client'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import styles from '@/styles/catalog/index.module.scss'
import Breadcrumbs from '../modules/Breadcrumbs/Breadcrumbs'

const CatalogLayout = ({ children }: { children: React.ReactNode }) => {
  const { getDefaultTextGenerator, getTextGenerator } =
    useBreadcrumbs('catalog')

  return (
    <main>
      <Breadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
        getTextGenerator={getTextGenerator}
      />
      <section className={styles.catalog}>
        <div className='container'>{children}</div>
      </section>
    </main>
  )
}

export default CatalogLayout
