import { useEffect, useState } from 'react';

// для управдение цены
export const usePriceAction = (count: number, initialPrice: number) => {
  const [price, setPrice] = useState(initialPrice);

  useEffect(() => {
    setPrice(price * count);
  }, []);

  // к нынешнему прайсу прибавляется initialPrice
  const increasePrice = () => setPrice(price + initialPrice);
  const decreasePrice = () => setPrice(price - initialPrice);

  return { price, increasePrice, decreasePrice };
};
