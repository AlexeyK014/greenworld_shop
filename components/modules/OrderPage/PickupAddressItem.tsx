import { setChosenCourierAdressData } from '@/context/order';
import styles from '@/styles/order/index.module.scss';
import { IPickupAddressItemProps } from '@/types/order';

const PickupAddressItem = ({
  addressItem,
  handleSelectAddress,
  handleChosenAddressData,
}: IPickupAddressItemProps) => {
  // вызывается при нажатие на item и вызывает все фун-ии
  const selectAddress = () => {
    handleChosenAddressData(addressItem);
    handleSelectAddress(addressItem.bbox, {
      lat: addressItem.lat,
      lon: addressItem.lon,
    });
    // если выбирается самовывоз, нужно сбросить все значения которые были при доставке курьером
    setChosenCourierAdressData({}); // сбрасываем что было выбрано для курьера
  };
  return (
    <li className={styles.order__list__item__delivery__list__item}>
      <button className="btn-reset" onClick={selectAddress}>
        <span>{addressItem.address_line1}</span>
        <span>
          {addressItem.address_line2}, {addressItem.city}
        </span>
      </button>
    </li>
  );
};

export default PickupAddressItem;
