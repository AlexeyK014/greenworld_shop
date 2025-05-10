'use client';

import { useUnit } from 'effector-react';
import React, { useEffect, useState } from 'react';
import { rock } from '@/public/fonts/fonts';
import Layout from './Layout';
import {
  closeSizeTableByCheck,
  handleCloseAuthPopup,
  handleCloseShareModule,
  isUserAuth,
  removeOverflowHiddenFromBody,
} from '@/lib/utils/common';
import { Toaster } from 'react-hot-toast';
import CookieAlert from '../modules/CookieAlert/CookieAlert';
import { motion } from 'framer-motion';
import { Next13ProgressBar } from 'next13-progressbar';
import '@/context/goods/init';
import { $shareModal, $showQuickModal, $showSizeTable } from '@/context/modals/state';
import { $openAuthPopup } from '@/context/auth/state';
import { closeQuickModal } from '@/context/modals/index';
import '@/context/goods/init';
import '@/context/auth/init';
import '@/context/cart/init';
import '@/context/comparison/init';
import '@/context/favorites/init';
import '@/context/user/init';
import '@/context/order/init';
import '@/context/profile/init';
import '@/context/passwordRestore/init';
import { usePathname, useRouter } from 'next/navigation';
import { loginCheckFx } from '@/context/user';

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  // для показа cookieAlert
  const [cookieAlertOpne, setCookieAlertOpne] = useState(false);
  const [shouldShowContent, setShouldShowContent] = useState(false);

  const showQuickViewModal = useUnit($showQuickModal);
  const showSizeTable = useUnit($showSizeTable);
  const openAuthPopup = useUnit($openAuthPopup);
  const shareModal = useUnit($shareModal);
  const pathname = usePathname()
  const router = useRouter()

  // переменная для защиты роута. чтобы в личный кабинет могли зайти не авторизованые
  const protectedRoutes = ['/profile']

  useEffect(() => {
    if (protectedRoutes.includes(pathname)) {
      if (!isUserAuth()) {
        setShouldShowContent(false)
        router.push('/')
        return
      }
      handleLoadProtectedRoute()

      return
    }

    setShouldShowContent(true)
  }, [pathname])

  const handleLoadProtectedRoute = async () => {
    const auth = JSON.parse(localStorage.getItem('auth') as string);

    await loginCheckFx({ jwt: auth.accessToken, setShouldShowContent })

    setShouldShowContent(true)
  }

  useEffect(() => setIsClient(true), []);

  const handleCloseSizeTable = () => closeSizeTableByCheck(showQuickViewModal);

  const handleCloseQuickViewModal = () => {
    removeOverflowHiddenFromBody();
    closeQuickModal();
  };

  //  определяем включины cookie или нет
  useEffect(() => {
    // получаем cookie
    // и делаем провеку, если они включены, значит они есть и не показываем alert
    // иначе показываем alert
    const checkCookie = document.cookie.indexOf('CookieBy=Microgreen');
    checkCookie != -1
      ? setCookieAlertOpne(false)
      : setTimeout(() => setCookieAlertOpne(true), 3000);
  }, []);
  return (
    <>
      {isClient ? (
        <html lang="en">
          <body className={rock.variable}>
            <Next13ProgressBar height="4px" color="#9466FF" showOnShallow />
            {shouldShowContent && <Layout>{children}</Layout>}
            <div
              className={`quick-view-modal-overlay ${showQuickViewModal ? 'overlay-active' : ''}`}
              onClick={handleCloseQuickViewModal}
            />
            <div
              className={`size-table-overlay ${showSizeTable ? 'overlay-active' : ''}`}
              onClick={handleCloseSizeTable}
            />
            <div
              className={`auth-overlay ${openAuthPopup ? 'overlay-active' : ''}`}
              onClick={handleCloseAuthPopup}
            />
            <div
              className={`share-overlay ${shareModal ? 'overlay-active' : ''}`}
              onClick={handleCloseShareModule}
            />
            {cookieAlertOpne && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="cookie-popup"
              >
                <CookieAlert setCookieAlertOpen={setCookieAlertOpne} />
              </motion.div>
            )}
            <Toaster position="top-center" reverseOrder={false} />
          </body>
        </html>
      ) : (
        <html lang="en">
          <body className={rock.variable}>
            <></>
          </body>
        </html>
      )}
    </>
  );
};

export default PagesLayout;
