import { closeMapModal } from '@/context/modals';
import {
  setChosenCourierAdressData,
  setChosenPickupAdressData,
  setCourierTab,
  setPickupTab,
  setShouldLoadGreenworldData,
  setShouldShowCourierAdressData,
} from '@/context/order';
import { $courierAdressData } from '@/context/order/state';
import { getGeolocationFx } from '@/context/user';
import { useLang } from '@/hooks/useLang';
import { removeOverflowHiddenFromBody } from '@/lib/utils/common';
import styles from '@/styles/order/index.module.scss';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUnit } from 'effector-react';

const CourierAdressesItem = () => {
  const { lang, translations } = useLang();
  const spinner = useUnit(getGeolocationFx.pending);
  const courierAdressData = useUnit($courierAdressData);

  //фун-я для того чтобы сэтился адрес
  const handleSelectCourierAdress = () => {
    setChosenPickupAdressData({});
    setShouldLoadGreenworldData(false);
    setShouldShowCourierAdressData(true); //чтобы показывать адрес в разделе курьер
    setPickupTab(false); // ресетим табы
    setCourierTab(true); //автоматом сэтим таб для курьера
    closeMapModal(); //закрываем табы
    removeOverflowHiddenFromBody();
    setChosenCourierAdressData(courierAdressData); //выбранные данные сэтим, для показа в табе
  };

  return (
    <>
      {/* когда юзер нажимает на карту, выделяет спинер, пока идёт запрос - показывается спиннер */}
      {spinner && (
        <span className={styles.order__list__item__delivery__inner__spinner}>
          <FontAwesomeIcon icon={faSpinner} spin color="#fff" size="2x" />
        </span>
      )}
      {!spinner && (
        <div className={styles.map_modal__control__content__courier_address}>
          <h3 className={styles.map_modal__control__content__courier_address__title}>
            {/* данные из стора */}
            {courierAdressData.address_line1}
          </h3>

          {/* описание */}
          <p className={styles.map_modal__control__content__courier_address__subtitle}>
            {courierAdressData.address_line2}
          </p>

          {/* данные с долготой и широтой */}
          <p className={styles.map_modal__control__content__courier_address__coordinates}>
            <span>
              {translations[lang].order.longitude}{' '}
              <strong
                className={styles.map_modal__control__content__courier_address__coordinates__value}
              >
                {courierAdressData.lon}
              </strong>
            </span>
            <span>
              {translations[lang].order.latitude}{' '}
              <strong
                className={styles.map_modal__control__content__courier_address__coordinates__value}
              >
                {courierAdressData.lat}
              </strong>
            </span>
          </p>

          {/* алерт с предупреждением */}
          <p className={styles.map_modal__control__content__courier_address__warning}>
            {translations[lang].order.courier_warning}
          </p>
          <button
            className={`btn-reset ${styles.map_modal__control__content__courier_address__choose}`}
            onClick={handleSelectCourierAdress}
          >
            {translations[lang].order.choose}
          </button>
        </div>
      )}
    </>
  );
};

export default CourierAdressesItem;
