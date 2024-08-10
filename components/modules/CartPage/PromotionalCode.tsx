import { useLang } from '@/hooks/useLang'
import React, { useState } from 'react'
import styles from '@/styles/cart-page/index.module.scss'

const PromotionalCode = ({
  setIsCorrectPromotionCode,
}: {
  setIsCorrectPromotionCode: (arg0: boolean) => void
}) => {
  const [value, setValue] = useState('') // для провверки значения input
  const isCorrectCode = value === 'Микро' // сам промокод
  const { lang, translations } = useLang()

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value) // устанавливаем value из input

    if (e.target.value === 'Микро') {
      setIsCorrectPromotionCode(true)
    } else {
      setIsCorrectPromotionCode(false)
    }
  }
  return (
    <div className={styles.cart__promotional_code}>
      <input
        type='text'
        placeholder={translations[lang].order.promocode}
        value={value}
        onChange={handleChangeValue}
        style={
          isCorrectCode ? { border: '3px solid #d9a516', color: '#d9a516' } : {}
        }
      />
      <p>{translations[lang].order.promo_code_text}</p>
    </div>
  )
}

export default PromotionalCode
