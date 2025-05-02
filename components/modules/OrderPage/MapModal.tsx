/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeMapModal } from '@/context/modals';
import { useLang } from '@/hooks/useLang';
import { removeOverflowHiddenFromBody } from '@/lib/utils/common';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from '@/styles/order/index.module.scss';
import { mapOptions } from '@/constants/map';
import {
  handleResultClearing,
  handleResultSelection,
  handleResultsFound,
  handleSelectPickupAddress,
  SearchMarkersManager,
} from '@/lib/utils/map';
import { basePropsForMotion } from '@/constants/motion';
import AdressesList from './AdressesList';
import { motion } from 'framer-motion';
import { useTTMap } from '@/hooks/useTTMap';
import {
  $chosenPickupAdressData,
  $courierAdressData,
  $greenworldDataByCity,
  $mapInstance,
  $shouldShowCourierAdressData,
} from '@/context/order/state';
import { useUnit } from 'effector-react';
import {
  setChosenCourierAdressData,
  setCourierAdressData,
  setShouldLoadGreenworldData,
  setShouldShowCourierAdressData,
} from '@/context/order';
import { $userGeolocation } from '@/context/user/state';
import { IGreenworldAddressData } from '@/types/order';
import CourierAdressesItem from './CourierAdressesItem';
import { getGeolocationFx } from '@/context/user';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const MapModal = () => {
  //будет два рефа - самовывоз и курьер
  const pickUpMapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const courierMapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [ttMapInstance, setTtMapInstance] = useState<any>();

  //стэйт для табов
  const [pickupTab, setPickupTab] = useState(true);
  const [courierTab, setCourierTab] = useState(false);
  const { lang, translations } = useLang();
  const shouldLoadMap = useRef(true);
  const { handleSelectAddress } = useTTMap();
  const userGeolocation = useUnit($userGeolocation);
  const greenworldDataByCity = useUnit($greenworldDataByCity);
  const mapInstance = useUnit($mapInstance);
  const chosenPickupAddressData = useUnit($chosenPickupAdressData);
  const shouldShowCourierAdressData = useUnit($shouldShowCourierAdressData);
  const courierAdressData = useUnit($courierAdressData);
  const isMedia940 = useMediaQuery(940);

  const removeMapMarkers = () => {
    //обращаемся к дом-элементу(т.к. может быть много адресов)
    const markers = document.querySelectorAll('.modal-map-marker');
    //потом убираем все остальные
    markers.forEach((marker) => marker.remove());
  };

  // чтобы рисовать маркер
  const drawMarker = async (lon: number, lat: number, map: any) => {
    const ttMaps = await import(`@tomtom-international/web-sdk-maps`);

    const element = document.createElement('div');
    element.classList.add('modal-map-marker');

    new ttMaps.Marker({ element }).setLngLat([lon, lat]).addTo(map);
  };

  const handleCloseModal = () => {
    closeMapModal();
    removeOverflowHiddenFromBody();
  };

  //@ts-ignores
  const drawMarkerByClick = async (e) => {
    const result = await getGeolocationFx({
      lat: e.lngLat.lat,
      lon: e.lngLat.lng,
    });

    //если все данные вернулись
    if (result) {
      removeMapMarkers(); // убираем маркеры
      drawMarker(e.lngLat.lng, e.lngLat.lat, ttMapInstance);
      setCourierAdressData(result.data.features[0].properties); // сетаем данные
      setShouldShowCourierAdressData(true);
    }
  };

  useEffect(() => {
    //проверяем какое нибудь поле, что у нас там чтото есть(т.е. сетнутый инстанс)
    if (ttMapInstance?.once) {
      //если открываем самовывоз, тогда нам не нужно вешать обработчик клика на карту
      if (pickupTab) {
        ttMapInstance.off('click', drawMarkerByClick);
        return;
      }
      ttMapInstance.on('click', drawMarkerByClick);
    }
  }, [courierTab, pickupTab, ttMapInstance]);

  useEffect(() => {
    if (shouldLoadMap.current) {
      shouldLoadMap.current = false;
      handleLoadMap();
    }

    // получаем данные точки на которую кликнули
  }, []);

  const handleSelectPickupTab = () => {
    if (pickupTab) {
      return;
    }

    setPickupTab(true);
    setCourierTab(false);
    handleLoadMap();
  };

  const handleSelectCourierTab = async () => {
    if (courierTab) {
      return;
    }

    setPickupTab(false);
    setCourierTab(true);

    // получаем карту для вкладки с Курьером
    const map = await handleLoadMap(courierMapRef);

    // убираем все маркеры которые были для вкладке Самовывоз
    setTimeout(removeMapMarkers, 0);

    // проверяем нет ли выделенного адреса для самовывоза
    if (chosenPickupAddressData.address_line1) {
      setShouldShowCourierAdressData(false);
      return;
    }

    if (courierAdressData.lat) {
      setTimeout(
        // ставим метку на карте, выделял ли юзер что то на карте или нет
        () => drawMarker(courierAdressData.lon, courierAdressData.lat, map),
        0,
      );
    }
  };

  //фун-я для инициализации карты
  const handleLoadMap = async (initialContainer = pickUpMapRef) => {
    const ttMaps = await import(`@tomtom-international/web-sdk-maps`);

    const map = ttMaps.map({
      key: process.env.NEXT_PUBLIC_TOMTOM_API_KEY as string,
      container: initialContainer.current,
      center: {
        lat: 55.0415,
        lng: 82.9346,
      },
      zoom: 10,
    });

    setTtMapInstance(map);

    //@ts-ignore
    const ttSearchBox = new tt.plugins.SearchBox(tt.services, mapOptions);

    const searchBoxHTML = ttSearchBox.getSearchBoxHTML();
    searchBoxHTML.classList.add('modal-search-input');
    initialContainer.current.append(searchBoxHTML);

    //@ts-ignore
    const searchMarkersManager = new SearchMarkersManager(map);

    //для контроллеров(приближение, удаление)
    const nav = new ttMaps.NavigationControl({});
    map.addControl(nav, 'bottom-right'); // расположение на карте

    // определение геолокации юзера
    map.addControl(
      new ttMaps.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'bottom-left',
    );

    // фун-я помечам маркерами выбранные адреса
    const setMarkersByLocationsData = (data: IGreenworldAddressData[]) => {
      data.forEach((item) => {
        const sw = new ttMaps.LngLat(item.bbox.lon1, item.bbox.lat1);
        const ne = new ttMaps.LngLat(item.bbox.lon2, item.bbox.lat2);
        const bounds = new ttMaps.LngLatBounds(sw, ne);

        map.fitBounds(bounds, { padding: 130, linear: true });

        const element = document.createElement('div');
        element.classList.add('modal-map-marker');

        // drawMarker(item.lon, item.lat, map)
        new ttMaps.Marker({ element }).setLngLat([item.lon, item.lat]).addTo(map.zoomTo(12));
      });
    };

    //чтобы показывались адресса на карте выбранного города
    //@ts-ignore
    ttSearchBox.on('tomtom.searchbox.resultselected', async (e) => {
      const data = await handleSelectPickupAddress(e.data.text);
      handleResultSelection(e, searchMarkersManager, map);
      setMarkersByLocationsData(data);
    });

    //сбрасываем позицию
    ttSearchBox.on('tomtom.searchbox.resultscleared', () => {
      //делаем ресет на то место где пользователь сейчас находится
      //userGeolocation?.features - делаем проверку, если эти данные есть, значит юзер позволял
      //опрд своё местоположение и мы ресетаем карту для этих данных
      handleResultClearing(searchMarkersManager, map, userGeolocation);
      handleResultClearing(searchMarkersManager, mapInstance, userGeolocation);
    });

    //когда мы вводим чтото в input и нам предлагают выбрать варианты
    //@ts-ignore
    ttSearchBox.on('tomtom.searchbox.resultsfound', (e) =>
      handleResultsFound(e, searchMarkersManager, map),
    );

    //проверка если есть выделенный адрес, чтобы карта тоже сетилась согласно этому адресу
    if (!!chosenPickupAddressData.address_line1) {
      //тогда получаем в переменную этот item и из списка адресов находим
      const chosenItem = greenworldDataByCity.filter(
        (item) => item.address_line2 === chosenPickupAddressData.address_line2,
      )[0];

      //т.к. сэтится item вызываем event
      setShouldLoadGreenworldData(false);
      setMarkersByLocationsData([chosenItem]); //для сэта маркера, чтобы выделить маркер

      map.setCenter([chosenItem.lon, chosenItem.lat]).zoomTo(12);
      ttSearchBox.setValue(chosenItem.city);

      return;
    }

    //если юзер не позволил выбрать свою геолокацию, устанваливаем по дефолту
    if (!userGeolocation.features) {
      // строчка попадает в запрос и мы получаем данные
      const data = await handleSelectPickupAddress('новосибирск');
      setMarkersByLocationsData(data);
      ttSearchBox.setValue('новосибирск');
    } else {
      map
        .setCenter([
          userGeolocation?.features[0].properties.lon,
          userGeolocation?.features[0].properties.lat,
        ])
        .zoomTo(12);
      ttSearchBox.setValue(userGeolocation?.features[0].properties.city);
    }

    if (greenworldDataByCity.length) {
      setMarkersByLocationsData(greenworldDataByCity);
    }

    return map;
  };

  const handleSelectAdressByMarkers = (
    {
      lon1,
      lat1,
      lon2,
      lat2,
    }: {
      lon1: number;
      lat1: number;
      lon2: number;
      lat2: number;
    },
    position: {
      lat: number;
      lon: number;
    },
  ) => {
    removeMapMarkers();
    handleSelectAddress(
      {
        lon1,
        lat1,
        lon2,
        lat2,
      },
      position,
      mapInstance,
    );
    setShouldShowCourierAdressData(false);
    setChosenCourierAdressData({});
    handleCloseModal();
    setPickupTab(true);
    setCourierTab(false);
  };
  return (
    <div className={styles.map_modal__inner}>
      <button className={`btn-reset ${styles.map_modal__close}`} onClick={handleCloseModal}>
        {isMedia940 ? '' : translations[lang].common.close}
      </button>

      <div className={styles.map_modal__control}>
        <h3 className={styles.map_modal__title}>{translations[lang].order.delivery_way}</h3>
        <div className={styles.map_modal__control__tabs}>
          <button
            className={`btn-reset ${pickupTab ? styles.active : ''}`}
            onClick={handleSelectPickupTab}
          >
            {translations[lang].order.pickup_point}
          </button>
          <button
            className={`btn-reset ${courierTab ? styles.active : ''}`}
            onClick={handleSelectCourierTab}
          >
            {translations[lang].order.by_courier}
          </button>
        </div>
        {pickupTab && (
          <motion.div {...basePropsForMotion} className={styles.map_modal__control__content}>
            <AdressesList
              listClassName={styles.map_modal__control__content__list}
              handleSelectAdressByMarkers={handleSelectAdressByMarkers}
            />
          </motion.div>
        )}
        {courierTab && (
          <motion.div {...basePropsForMotion} className={styles.map_modal__control__content}>
            {/* когда юзер открыл таб, но ничего не выбрал */}
            {!shouldShowCourierAdressData && (
              <p>
                <b className={styles.map_modal__control__content__default}>
                  {translations[lang].order.where_deliver_order}
                </b>
                <span>{translations[lang].order.enter_address_on_map_or_search}</span>
              </p>
            )}
            {shouldShowCourierAdressData && <CourierAdressesItem />}
          </motion.div>
        )}
      </div>

      {pickupTab && <div className={styles.map_modal__map} ref={pickUpMapRef} />}
      {courierTab && <div className={styles.map_modal__map} ref={courierMapRef} />}
    </div>
  );
};

export default MapModal;
