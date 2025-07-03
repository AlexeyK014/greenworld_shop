import { MutableRefObject, useEffect, useRef, useState } from 'react';

// хук для обобщения логики открытия-закрытия селекта
export const useClickOutside = () => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current.contains(e.target as HTMLDivElement)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  return { open, setOpen, toggle, ref };
};
