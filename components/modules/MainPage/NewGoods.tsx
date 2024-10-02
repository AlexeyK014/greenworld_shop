// import { getNewProductsFx } from '@/api/main-page'
import { useLang } from '@/hooks/useLang'
import { useUnit } from 'effector-react'
import MainPageSection from './MainPageSection'
import { $newProducts } from '@/context/goods/state'
import { getNewProductsFx } from '@/context/goods/index'

const NewGoods = () => {
  const goods = useUnit($newProducts)
  const spinner = useUnit(getNewProductsFx.pending)
  const { lang, translations } = useLang()

  return (
    <MainPageSection
      title={translations[lang].main_page.new_title}
      goods={goods}
      spinner={spinner}
    />
  )
}

export default NewGoods
