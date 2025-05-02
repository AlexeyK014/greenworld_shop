import {
  getGreenworldShopByCityFx,
  setChosenPickupAdressData,
  setShouldLoadGreenworldData,
} from '@/context/order';
import {
  $chosenPickupAdressData,
  $greenworldDataByCity,
  $shouldLoadGreenworldData,
} from '@/context/order/state';
import { useLang } from '@/hooks/useLang';
import { useTTMap } from '@/hooks/useTTMap';
import styles from '@/styles/order/index.module.scss';
import { IAddressesListProps, IGreenworldAddressData } from '@/types/order';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUnit } from 'effector-react';
import PickupAddressItem from './PickupAddressItem';

// у списка должно быть два состояния:
// 1. когда юзер начинает искать показывается предложения адрессов
// 2. когда юзер выбрал, нажал, элемент установился и постоянно показывается вне списка

const AdressesList = ({ listClassName, handleSelectAdressByMarkers }: IAddressesListProps) => {
  const { lang, translations } = useLang();
  const greenworldDataByCity = useUnit($greenworldDataByCity); // чтобы отрисовывать данные магазинов
  const { handleSelectAddress } = useTTMap();
  const chosenPickupAdressData = useUnit($chosenPickupAdressData);
  const shouldLoadGreenworldData = useUnit($shouldLoadGreenworldData);
  const loadGreenworldDataSpinner = useUnit(getGreenworldShopByCityFx.pending);

  // фун-я срабатывает при выборе офиса
  // прокидываем данные выбранного item
  const handleChosenAddressData = (data: Partial<IGreenworldAddressData>) => {
    setShouldLoadGreenworldData(false); // говорим, что не нужно загружать данные больше
    setChosenPickupAdressData(data);
  };

  return (
    <>
      {/* отрисовываем два сценария */}
      {/* когда юзер не выбрал адрес и есть разные предложения. и когда юзер выбрал адрес */}

      {shouldLoadGreenworldData && (
        <>
          {loadGreenworldDataSpinner && (
            <span className={styles.order__list__item__delivery__inner__spinner}>
              <FontAwesomeIcon icon={faSpinner} spin color="#fff" size="2x" />
            </span>
          )}
          {/* когда нужно подгрузить данные и показать список */}
          {!loadGreenworldDataSpinner && (
            <ul className={`list-reset ${listClassName}`}>
              {/* сначала делаем проверку есть ли данные */}
              {greenworldDataByCity?.length ? (
                greenworldDataByCity.map((item) => (
                  <PickupAddressItem
                    key={item.place_id}
                    addressItem={item}
                    handleChosenAddressData={handleChosenAddressData}
                    handleSelectAddress={handleSelectAdressByMarkers || handleSelectAddress}
                  />
                ))
              ) : (
                <span>{translations[lang].common.nothing_is_found}</span>
              )}
            </ul>
          )}
        </>
      )}
      {
        // есть ли у нас поля с данными
        !!chosenPickupAdressData.address_line1 && !shouldLoadGreenworldData && (
          <div className={styles.order__list__item__delivery__pickup__choose}>
            <span>{chosenPickupAdressData.address_line1}</span>
            <span>
              {chosenPickupAdressData.address_line2}, {chosenPickupAdressData.city}
            </span>
          </div>
        )
      }
    </>
  );
};

export default AdressesList;
