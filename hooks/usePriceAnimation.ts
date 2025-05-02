// анимация цены, указываем дипазон цены

import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

// initialFrom - изначальное число от которого будет идти анимация
// initialTo - конечная точка
export const usePriceAnimation = (initialFrom: number, initialTo: number) => {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [value, setValue] = useState(0); // начальная цена

  // анимируем
  useEffect(() => {
    const controls = animate(from, to, {
      duration: 0.5, //задержка
      onUpdate(value) {
        setValue(+value.toFixed(0)); //без плавающих точек
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return { setFrom, setTo, value };
};
