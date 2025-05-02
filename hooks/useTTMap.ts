// import { $mapInstance } from '@/context/order/state'
// import { useUnit } from 'effector-react'

// export const useTTMap = () => {
//   const mapInstance = useUnit($mapInstance)

//   // фун-я будет вызываться когда пользователь нашёл адрес, который мы запрашиваем в context/oreder/index.ts
//   // кликаем на этот адрес, показываем обновлённые данные на карте
//   // для дефолтного сценария или динамического
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleSelectAdress = async (
//     {
//       lon1,
//       lat1,
//       lon2,
//       lat2,
//     }: {
//       lon1: number
//       lat1: number
//       lon2: number
//       lat2: number
//     },
//     position: {
//       lat: number
//       lon: number
//     },
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     initialMapInstance?: any
//   ) => {
//     // работаем с той инициализацие которую установлии в стор
//     const ttMaps = await import(`@tomtom-international/web-sdk-maps`) // для опр нового места на карте
//     const currentMap = initialMapInstance || mapInstance

//     const sw = new ttMaps.LngLat(lon1, lat1)
//     const ne = new ttMaps.LngLat(lon2, lat2)
//     const bounds = new ttMaps.LngLatBounds(sw, ne)

//     //обращаемся к уже существующему instance и меняем местоположение
//     currentMap.fitBounds(bounds, { padding: 130, linear: true })

//     const element = document.createElement('div')
//     element.classList.add('map-market')

//     new ttMaps.Marker()
//       .setLngLat([position.lon, position.lat])
//       .addTo(currentMap)
//   }
//   return { handleSelectAdress }
// }

import { useUnit } from 'effector-react';
import { $mapInstance } from '@/context/order/state';
import { IAddressBBox, IAddressPosition } from '@/types/order';

export const useTTMap = () => {
  const mapInstance = useUnit($mapInstance);

  // вызывается когда юзер нашёл адрес который мы запрашиваем
  // кликая на адрес, показываем обновлённые данные на карте
  const handleSelectAddress = async (
    { lon1, lat1, lon2, lat2 }: IAddressBBox,
    position: IAddressPosition,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialMapInstance?: any,
  ) => {
    const ttMaps = await import(`@tomtom-international/web-sdk-maps`);

    // карта которую мы УЖЕ установили в стор
    const currentMap = initialMapInstance || mapInstance;

    // устанавливаем рамки
    const sw = new ttMaps.LngLat(lon1, lat1);
    const ne = new ttMaps.LngLat(lon2, lat2);
    const bounds = new ttMaps.LngLatBounds(sw, ne);

    // обращаемся к уже существующему инстансу карту и у него меняем местоположение
    // fitBounds-принимаем позицию(bounds)
    currentMap.fitBounds(bounds, { padding: 130, linear: true });

    const element = document.createElement('div');
    element.classList.add('map-marker');

    // маркер
    new ttMaps.Marker({ element }).setLngLat([position.lon, position.lat]).addTo(currentMap);
  };

  return { handleSelectAddress };
};
