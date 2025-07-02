import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCrumbText } from './useCrumbText';
import { usePageTitle } from './usePageTitle';
import { useLang } from './useLang';
import { productCategory } from '@/constants/product';

export const useBreadcrumbs = (page: string) => {
  const [dynamicTitle, setDynamicTitle] = useState('');
  const { lang, translations } = useLang();
  const pathname = usePathname();
  const breadcrumbs = document.querySelector('.breadcrumbs') as HTMLUListElement;
  const { crumbText } = useCrumbText(page);
  const getDefaultTextGenerator = useCallback(() => crumbText, [crumbText]);
  const getTextGenerator = useCallback((param: string) => ({})[param], []);
  usePageTitle(page, dynamicTitle);

  // для динамического изменения хлебной крошки
  useEffect(() => {
    const lastCrumb = document.querySelector('.last-crumb') as HTMLElement;
    console.log(lastCrumb);

    // получаем вторую часть url
    if (lastCrumb) {
      const productTypePathname = pathname.split(`/${page}/`)[1];

      // когда ешё не выбрали категорию
      if (!productTypePathname) {
        setDynamicTitle('');
        lastCrumb.textContent = crumbText;
        return;
      }

      if (!productCategory.some((item) => item === productTypePathname)) {
        return;
      }




      // иначе обновляем хлебную крошку под определённый тип
      // получаем перевод, который совпадает с URL
      const text = (
        translations[lang][page === 'comparison' ? 'comparison' : 'breadcrumbs'] as {
          [index: string]: string;
        }
      )[productTypePathname];
      setDynamicTitle(text); // сэтим тип в title
      lastCrumb.textContent = text; // последняя хлебная крошка
    }
  }, [breadcrumbs, crumbText, lang, pathname, translations, page]);

  return { getDefaultTextGenerator, getTextGenerator, breadcrumbs };
};
