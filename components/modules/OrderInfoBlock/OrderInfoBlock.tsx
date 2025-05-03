import { $cart, $cartFromLs } from '@/context/cart/state';
import { makePayment, makePaymentFx } from '@/context/order';
import {
  $chosenCourierAdressData,
  $chosenPickupAdressData,
  $onlinePaymentTab,
  $orderDetailsValues,
  $pickupTab,
} from '@/context/order/state';
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth';
import { useLang } from '@/hooks/useLang';
import { useTotalPrice } from '@/hooks/useTotalPrice';
import { countWholeCartItemsAmount } from '@/lib/utils/cart';
import { formatPrice, handleOpenAuthPopup, isUserAuth, showCountMessage } from '@/lib/utils/common';
import styles from '@/styles/order-block/index.module.scss';
import { IOrderInfoBlock } from '@/types/modules';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUnit } from 'effector-react';
import Link from 'next/link';
import { MutableRefObject, useRef, useState } from 'react';

const OrderInfoBlock = ({
  isCorrectPromotionCode, // для скидки
  isOrderPage, // для добавление доп информации в блок оплаты
}: IOrderInfoBlock) => {
  const { lang, translations } = useLang();
  const currentCartByAuth = useGoodsByAuth($cart, $cartFromLs); // для получения данных корзины
  const [isUserAgree, setIsUserAgree] = useState(false);
  const { animatedPrice } = useTotalPrice();
  const onlinePaymentTab = useUnit($onlinePaymentTab);
  const pickupTab = useUnit($pickupTab);
  const chosenCourierAdressData = useUnit($chosenCourierAdressData);
  const chosenPickupAdressData = useUnit($chosenPickupAdressData);
  const paymentSpinner = useUnit(makePaymentFx.pending);
  const checkboxRef = useRef() as MutableRefObject<HTMLInputElement>;
  const orderDetailsValues = useUnit($orderDetailsValues);

  const priceWithDiscount = isCorrectPromotionCode
    ? formatPrice(Math.round(animatedPrice - animatedPrice * 0.3))
    : formatPrice(animatedPrice);

  // для переключения состояния
  const handleAgreementChange = () => setIsUserAgree(!isUserAgree);

  const scrollToBlock = (selector: HTMLLIElement) => {
    //скролим в нужное место
    window.scrollTo({
      top: selector.getBoundingClientRect().top + window.scrollY + -50, // центрируем блок
      behavior: 'smooth', // плавность
    });
  };

  //  проверка, если юзер нажал на Tab - выделяем checkbox
  const handleTabCheckbox = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key == ' ' || e.code == 'Space') {
      e.preventDefault();
      setIsUserAgree(!checkboxRef.current.checked);
      checkboxRef.current.checked = !checkboxRef.current.checked;
    }
  };

  //фун-я отрабатывает при совершение оплаты
  const handleMakePayment = async () => {
    //проверка выделен ли хотя бы ожин адрес
    if (!chosenCourierAdressData.address_line1 && !chosenPickupAdressData.address_line1) {
      const orderBlock = document.querySelector('.order-block') as HTMLLIElement
      scrollToBlock(orderBlock)
      return;
    }
    if (!orderDetailsValues.isValid) {
      const detailsBlock = document.querySelector('.details-block') as HTMLLIElement
      scrollToBlock(detailsBlock)
      return;
    }

    //если юзер не авторизован и нажимает на кнопку "Оформить заказ"
    //тогда показываем popup для авторизации
    if (!isUserAuth()) {
      handleOpenAuthPopup();
      return;
    }

    //получаем данные из LS авторизации чтобы получить токен
    const auth = JSON.parse(localStorage.getItem('auth') as string);
    let description = ''; // в зависимости от адреса пишет тот или иной текст

    //проверка, если выбран адрес для курьера
    if (chosenCourierAdressData.address_line1) {
      // eslint-disable-next-line max-len
      description = `Адрес доставки товара курьером: ${chosenCourierAdressData.address_line1}, ${chosenCourierAdressData.address_line2}`;
    }

    //проверка для самовывоза
    if (chosenPickupAdressData.address_line1) {
      // eslint-disable-next-line max-len
      description = `Адрес получения товара: ${chosenPickupAdressData.address_line1}, ${chosenPickupAdressData.address_line2}`;
    }

    console.log(orderDetailsValues);

    // вызываем эвент
    makePayment({
      jwt: auth.accessToken,
      description,
      amount: `${priceWithDiscount.replace(' ', '')}`,
      metadata: orderDetailsValues,
    });
  };

  return (
    <div className={styles.order_block}>
      <div className={styles.order_block__inner}>
        <p className={styles.order_block__info}>
          {countWholeCartItemsAmount(currentCartByAuth)}{' '}
          {showCountMessage(`${countWholeCartItemsAmount(currentCartByAuth)}`, lang)}{' '}
          {translations[lang].order.worth}{' '}
          <span className={styles.order_block__info__text}>{formatPrice(animatedPrice)} P</span>
        </p>

        {/* блок инфо */}
        <p className={styles.order_block__info}>
          {translations[lang].order.amount_with_discounts}:{' '}
          <span className={styles.order_block__info__text}>{priceWithDiscount} P</span>
        </p>

        {isOrderPage && (
          <>
            <p className={styles.order_block__info}>
              {translations[lang].order.delivery}:{' '}
              <span className={styles.order_block__info__text}>
                {pickupTab
                  ? translations[lang].order.pickup_free
                  : translations[lang].order.courier_delivery}
              </span>
            </p>
            <p className={styles.order_block__info}>
              {translations[lang].order.payment}:{' '}
              <span className={styles.order_block__info__text}>
                {onlinePaymentTab
                  ? translations[lang].order.online_payment
                  : translations[lang].order.upon_receipt}
              </span>
            </p>
          </>
        )}

        {/* блок Итого */}
        <p className={styles.order_block__total}>
          <span>{translations[lang].order.total}</span>
          <span className={styles.order_block__total__price}>{priceWithDiscount} P</span>
        </p>

        {/* кнопка оформления заказа */}
        {isOrderPage ? (
          <button
            className={`btn-reset ${styles.order_block__btn}`}
            //если юзер не согласился | нет товаров
            disabled={!isUserAgree || !currentCartByAuth.length || paymentSpinner}
            onClick={handleMakePayment}
          >
            {false ? (
              <FontAwesomeIcon icon={faSpinner} spin color="#fff" />
            ) : (
              translations[lang].order.make_order
            )}
          </button>
        ) : (
          <Link
            href="/order"
            className={`${styles.order_block__btn} ${!isUserAgree || !currentCartByAuth.length ? styles.disabled : ''
              }`}
          >
            {translations[lang].order.make_order}
          </Link>
        )}

        <label className={styles.order_block__agreement}>
          <input
            className={styles.order_block__agreement__input}
            type="checkbox"
            tabIndex={-1}
            ref={checkboxRef}
            onChange={handleAgreementChange}
            checked={isUserAgree}
          />
          <span className={styles.order_block__agreement__mark} />
          <span
            className={styles.order_block__agreement__checkbox}
            tabIndex={0}
            onKeyDown={handleTabCheckbox}
          />
          <span className={styles.order_block__agreement__text}>
            {translations[lang].order.agreement_text}{' '}
            <Link href="/privacy" className={styles.order_block__agreement__link}>
              {translations[lang].order.agreement_link}
            </Link>
          </span>
        </label>
      </div>
    </div>
  );
};

export default OrderInfoBlock;
