//  когда картинок меньше 4-х

import { useMemo } from 'react'
import { IProduct } from '@/types/common'
import { idGenerator } from '@/lib/utils/common'

export const useProductImages = (product: IProduct) => {
  const images = useMemo(() => {
    const makeImagesObjects = (imagesArray: string[]) =>
      imagesArray.map((item) => ({
        src: item,
        alt: product.name,
        id: idGenerator(),
      }))

    if (product.images.length < 4) {
      const images = []
      //  создаём массив, которые заполняем до тех пор пока в массиве не будет 4 картинки

      for (let i = 0; i < 4; i++) {
        images.push(product.images[0])
      }

      return makeImagesObjects(images)
    }

    return makeImagesObjects(product.images)
  }, [product.images, product.name])

  return images
}
