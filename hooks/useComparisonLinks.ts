import { useGoodsByAuth } from './useGoodsByAuth';
import { useUnit } from 'effector-react';
import { useLang } from './useLang';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { getComparisonItemsFx } from '@/context/comparison/index';
import { $comparison, $comparisonFromLS } from '@/context/comparison/state';

export const useComparisonLinks = () => {
  const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS); // получаем товары сравнения
  const spinner = useUnit(getComparisonItemsFx.pending);
  const { lang, translations } = useLang();
  const pathname = usePathname();

  console.log(currentComparisonByAuth);

  // для формирования объектов
  // map преобразуем каждый item в строчку с типом и создаём массив с типами
  // new Set возвращает уникальный массив с которого формируем объекты для сравнения
  // ещё раз проходим map и проебразовываем типы в объекты, чтобы отрисовывать в jsx
  const availableProductLinks = useMemo(
    () =>
      [...new Set(currentComparisonByAuth.map((item) => item.category))].map(
        (category) => ({
          // возвращаем объект
          title: (translations[lang].comparison as { [index: string]: string })[category],
          href: `/comparison/${category}`, // для обновления хлебных крошек и получения layout этого типа

          // показываем кол-во товаров сравнения этого типа
          itemsCount: currentComparisonByAuth.filter(
            (item) => item.category === category, // получаем товары с данным типом
          ).length, // получаем кол-во

          // для показа активного таба. при переходе не опр тип у нас будут табы
          isActive: pathname.split('/comparison/')[1] === category,
        }),
      ),
    [currentComparisonByAuth, lang, pathname, translations],
  );
  return { availableProductLinks, linksSpinner: spinner };
};
