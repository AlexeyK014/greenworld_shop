import { ICodeInputProps } from '@/types/profile'
import React from 'react'

const CodeInput = ({
  processInput,
  onKeyUp,
  index,
  handlePushCurrentInput,
  num,
  autoFocus,
}: ICodeInputProps) => {
  const handleProccessInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processInput(e, index)
  }
  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUp(e, index)
  }
  return (
    <input
      type='text'
      inputMode='numeric' // чтобы раскладка на телефона была для цифр
      maxLength={1}
      value={num}
      autoFocus={autoFocus}
      onChange={handleProccessInput}
      onKeyUp={handleOnKeyUp}
      ref={handlePushCurrentInput}
    />
  )
}

export default CodeInput
