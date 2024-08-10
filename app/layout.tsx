import type { Metadata, Viewport } from 'next'
import './globalStyles/normalize.css'
import './globalStyles/globals.css'
import './globalStyles/header.css'
import './globalStyles/menu.css'
import './globalStyles/mobile-navbar.css'
import './globalStyles/catalog-menu.css'
import './globalStyles/search-modal.css'
import './globalStyles/cart-popup.css'
import './globalStyles/footer.css'
import './globalStyles/slick.css'
import './globalStyles/slick-theme.css'
import './globalStyles/auth-popup.css'
import './globalStyles/header-profile.css'
import './globalStyles/cookie-popup.css'
import './globalStyles/breadcrumbs.css'
import PagesLayout from '@/components/layout/PagesLayout'

// const inter = Inter({ subsets: ['latin'] })

// const rock = Oswald({ weight: '400' })

export const metadata: Metadata = {
  title: 'Greenworld',
  description: 'Greeworld магазин микрозелени',
}

export const viewport: Viewport = {
  themeColor: 'white',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PagesLayout>{children}</PagesLayout>
}
