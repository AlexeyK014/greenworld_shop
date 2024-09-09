// по дефолту принемаем задержку

import { MutableRefObject, useEffect, useRef } from 'react'

export const useDebounceCallback = (delay = 100) => {
  // исп ref, чтобы между рендерами не сбрасывался таймер
  const timerRef = useRef() as MutableRefObject<NodeJS.Timeout>

  // на перрвый рендер чистим таймер
  useEffect(() => clearTimeout(timerRef.current), [])

  return (callback: VoidFunction) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(callback, delay)
  }
}
