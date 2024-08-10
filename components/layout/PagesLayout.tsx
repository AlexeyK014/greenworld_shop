'use client'
import {
  $showQuickModal,
  $showSizeTable,
  closeQuickModal,
} from '@/context/modals'
import { useUnit } from 'effector-react'
import React, { useEffect, useState } from 'react'
import { rock } from '@/public/fonts/fonts'
import Layout from './Layout'
import {
  closeSizeTableByCheck,
  handleCloseAuthPopup,
  removeOverflowHiddenFromBody,
} from '@/lib/utils/common'
import { $openAuthPopup } from '@/context/auth'
import { Toaster } from 'react-hot-toast'
import { EarthoOneProvider } from '@eartho/one-client-react'
import CookieAlert from '../modules/CookieAlert/CookieAlert'
import { motion } from 'framer-motion'
import { Next13ProgressBar } from 'next13-progressbar'

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false)

  // для показа cookieAlert
  const [cookieAlertOpne, setCookieAlertOpne] = useState(false)

  const showQuickViewModal = useUnit($showQuickModal)
  const showSizeTable = useUnit($showSizeTable)
  const openAuthPopup = useUnit($openAuthPopup)

  useEffect(() => setIsClient(true), [])

  const handleCloseSizeTable = () => closeSizeTableByCheck(showQuickViewModal)

  const handleCloseQuickViewModal = () => {
    removeOverflowHiddenFromBody()
    closeQuickModal()
  }

  //  определяем включины cookie или нет
  useEffect(() => {
    // получаем cookie
    // и делаем провеку, если они включены, значит они есть и не показываем alert
    // иначе показываем alert
    const checkCookie = document.cookie.indexOf('CookieBy=Microgreen')
    checkCookie != -1
      ? setCookieAlertOpne(false)
      : setTimeout(() => setCookieAlertOpne(true), 3000)
  }, [])
  return (
    <>
      {isClient ? (
        <EarthoOneProvider
          clientId={`${process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}`}
          domain={''}
        >
          <html lang='en'>
            <body className={rock.variable}>
              <Next13ProgressBar height='4px' color='#9466FF' showOnShallow />
              <Layout>{children}</Layout>
              <div
                className={`quick-view-modal-overlay ${
                  showQuickViewModal ? 'overlay-active' : ''
                }`}
                onClick={handleCloseQuickViewModal}
              />
              <div
                className={`size-table-overlay ${
                  showSizeTable ? 'overlay-active' : ''
                }`}
                onClick={handleCloseSizeTable}
              />
              <div
                className={`auth-overlay ${openAuthPopup ? 'overlay-active' : ''}`}
                onClick={handleCloseAuthPopup}
              />
              {cookieAlertOpne && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className='cookie-popup'
                >
                  <CookieAlert setCookieAlertOpen={setCookieAlertOpne} />
                </motion.div>
              )}
              <Toaster position='top-center' reverseOrder={false} />
            </body>
          </html>
        </EarthoOneProvider>
      ) : (
        <html lang='en'>
          <body className={rock.variable}>
            <></>
          </body>
        </html>
      )}
    </>
  )
}

export default PagesLayout
