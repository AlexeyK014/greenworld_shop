import { useEffect, useState } from 'react'
import { getWindowWidth } from '../lib/utils/common'

const useWindowWidth = () => {
  // устанавливаем исходное значение ширины
  const [windowWidth, setWindowWidth] = useState(getWindowWidth())

  // по события 'resize' обновляем состояние ширины для useState
  const handleResize = () => setWindowWidth(getWindowWidth())

  useEffect(() => {
    window.addEventListener('resize', handleResize, true)

    return () => window.removeEventListener('resize', handleResize, true)
  }, [])

  // из хука возвращается обнулённое состояние и сама фун-я handleResize
  return { windowWidth, handleResize }
}

export const useMediaQuery = (maxWidth: number) => {
  const {
    windowWidth: { windowWidth },
    handleResize,
  } = useWindowWidth()
  const [isMedia, setIsMedia] = useState(false)

  useEffect(() => {
    if (windowWidth <= maxWidth) {
      setIsMedia(true)
    } else {
      setIsMedia(false)
    }
  }, [handleResize, maxWidth, windowWidth])

  return isMedia
}
