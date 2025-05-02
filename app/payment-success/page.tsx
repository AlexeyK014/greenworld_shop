/* eslint-disable indent */
/* eslint-disable max-len */
'use client';

import { checkPaymentFx, paymentNotifyFx } from '@/context/order';
import { useLang } from '@/hooks/useLang';
import { handleDeleteAllFromCart } from '@/lib/utils/cart';
import { formatPrice, isUserAuth } from '@/lib/utils/common';
import { IPaymentData } from '@/types/order';
import { useUnit } from 'effector-react';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/payment-success/index.module.scss';
import Link from 'next/link';
import { useWatchedProducts } from '@/hooks/useWatchedProducts';
import WatchedProducts from '@/components/modules/WatchedProducts/WatchedProducts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { $user } from '@/context/user/state';

export default function Favorites() {
  const { lang, translations } = useLang();
  const spinner = useUnit(checkPaymentFx.pending);
  const [paymentData, setPaymentData] = useState<IPaymentData>({} as IPaymentData);

  const { watchedProducts } = useWatchedProducts();
  const [pageSpinner, setPageSpinner] = useState(true);
  const user = useUnit($user);

  //при первой загрузке у нас отображается paymentId и данные
  useEffect(() => {
    if (!localStorage.getItem('paymentId')) {
      setPageSpinner(false);
      notFound();
    }
    getPaymentData();
  }, []);

  //отправляем пользователю инфо на почту
  useEffect(() => {
    // if (paymentData.description && user.email) {
    //   let description
    //   if(paymentData.metadata && Object.values(paymentData.metadata).some((item) => !!item)) {
    //     const recipientData = [
    //       paymentData.metadata.name_label,
    //       paymentData.metadata.surname_label,
    //       paymentData.metadata.phone_label,
    //       paymentData.metadata.email_label,
    //       paymentData.metadata.message_label,
    //     ]

    //     description = `${description} Данные получателя: ${recipientData.join(', ')}`
    //   }
    //   paymentNotifyFx({ email: user.email, message: description })
    // }

    if (paymentData.description && user.email) {
      let description = paymentData.description;

      if (paymentData.metadata && Object.values(paymentData.metadata).some((item) => !!item)) {
        const recipientData = Object.values(paymentData.metadata)
          .filter((item) => !!item && typeof item === 'string')
          .join(', ');

        description = `${description} Данные получателя: ${recipientData}`;
      }

      paymentNotifyFx({ email: user.email, message: description });
    }
  }, [paymentData.description, user.email]);

  //фун-я которая отрабатывает на первый рендер
  //страница с благодарностью "одноразовая". если юзер захочет её ещё раз показать, то будет Not Found
  //на первый рендер удаляем paymentId из localStorage
  const getPaymentData = async () => {
    const paymentId = JSON.parse(localStorage.getItem('paymentId') as string);

    if (!paymentData || !isUserAuth()) {
      window.location.href = '/'; // делаем редирект на главную страницу
      return;
    }

    //для работы с токеном, чтобы удалять данные и на клиенте и на сервере
    const auth = JSON.parse(localStorage.getItem('auth') as string);

    //делаем запрос
    const data = await checkPaymentFx({ paymentId });
    if (data) {
      if (data.result.status === 'succeeded') {
        handleDeleteAllFromCart(auth.accessToken);
        setPaymentData(data.result);
        setPageSpinner(false);
        localStorage.removeItem('paymentId'); //чтобы юзер эту одноразовую страницу не мог просматривать повторно
      }
    }
  };

  console.log(paymentData);

  return (
    <main>
      {pageSpinner ? (
        <span className={styles.payment_success__spinner}>
          <FontAwesomeIcon icon={faSpinner} spin color="#3e9651" size="4x" />
        </span>
      ) : (
        <>
          <section className={styles.payment_success}>
            <div className={`container ${styles.payment_success__container}`}>
              <span className={styles.payment_success__bg}>
                {translations[lang].payment_success.thanks}
              </span>
              <div className={styles.payment_success__inner}>
                <h1 className={styles.payment_success__heading}>
                  {translations[lang].payment_success.thanks_text}
                </h1>
                <p
                  className={styles.payment_success__info}
                  dangerouslySetInnerHTML={{
                    __html: spinner
                      ? translations[lang].common.loading
                      : `${translations[lang].payment_success.order_info
                          .replace(
                            '1-info',
                            `<span className=${styles.payment_success__num}>№${paymentData.authorization_details?.rrn}</span>`,
                          )
                          .replace(
                            '2-info',
                            `<span className=${styles.payment_success__price}>
                          ${formatPrice(+(paymentData.amount?.value || 0)).replace(/\s/g, '\u00A0')}\u00A0P
                        </span>`,
                          )}`,
                  }}
                />
                <p
                  className={styles.payment_success__description}
                  dangerouslySetInnerHTML={{
                    __html: translations[lang].payment_success.order_description,
                  }}
                />
                <div className={styles.payment_success__actions}>
                  <Link href="/catalog" className={styles.payment_success__actions__link}>
                    {translations[lang].payment_success.continue_shopping}
                  </Link>
                  <Link href="/" className={styles.payment_success__actions__link}>
                    {translations[lang].payment_success.go_main}
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              {!!watchedProducts.items?.length && (
                <WatchedProducts watchedProducts={watchedProducts} />
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
