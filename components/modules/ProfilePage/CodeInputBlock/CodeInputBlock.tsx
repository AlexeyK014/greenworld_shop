import React, { MutableRefObject, useRef, useState } from 'react'
import styles from '@/styles/profile/index.module.scss'
import { useLang } from '@/hooks/useLang';
import CodeInput from './CodeInput';

const CodeInputBlock = ({
  onComplete
}: {
  onComplete: (arg0: string) => void
}) => {
  const { lang, translations } = useLang();
  const [code, setCode] = useState([...Array(6)].map(() => ''))
  const inputs = useRef([]) as MutableRefObject<HTMLInputElement[]> // массив с инпутами

  // slot - это позиция строчки в массиве[...Array(6)], чтобы понимать
  // на какой позиции находится юзер когда печатает в инпуте
  const handleProccessInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: number) => {
      // падейтим стэйт из useState, поместив на нужную код
      // и если все строчки запонены - выываем фун-ю onComplete
      // при вызове фун-и, будет происходить запрос на сервер для проверке кода

      const num = e.target.value

      // проверка на число
      if (/[^0-9]/.test(num)) return
      // иначе
      const newCode = [...code]

      // обращаемся к позиции slot и апдейтим значение
      newCode[slot] = num

      setCode(newCode)

      if(slot !== 6 - 1) { //пока есть место для -1
        inputs.current[slot + 1].focus() // делаем фокус для inputs
      }

      // проверка когда все инпуты заполенены
      if(newCode.every((num) => num !== '')) {
        onComplete(newCode.join(''))
      }
  }

  // отрабатывает при удаление значения из инпутов
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code]

      // каждый раз при нажате на удаление, удаляем инпуты
      // и возвращаем по инпутам юзера назад
      newCode[slot -1] = ''
      setCode(newCode)

      inputs.current[slot - 1].focus() // чтобы отрабатывал фокус
    }
  }

  // пушим текущий инпут в массив
  const handlePushCurrentInput = (ref: HTMLInputElement) =>
    inputs.current.push(ref)


  return (
    <div className={styles.profile__code}>
      <label className={styles.profile__code__label}>
        {translations[lang].common.write_code}
      </label>
      <div className={styles.profile__code__inputs}>
        {code.map((num, index) => (
          <CodeInput
            key={index}
            processInput={handleProccessInput}
            onKeyUp={handleKeyUp}
            index={index}
            handlePushCurrentInput={handlePushCurrentInput}
            num={num}
            autoFocus={!code[0].length && index === 0 }
          />
        ))}
      </div>
    </div>
  )
}

export default CodeInputBlock
