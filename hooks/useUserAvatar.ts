import { $user } from '@/context/user'
import { useUnit } from 'effector-react'
import { useEffect, useState } from 'react'

export const useUserAvatar = () => {
  const user = useUnit($user)
  const [src, setSrc] = useState('')

  useEffect(() => {
    // проверка если есть ссылка на аватраку в объекте user в БД
    // тогда сэтаем эту аватарку, иначе смотрим LS
    if (user.image) {
      setSrc(user.image)
      return
    }

    const oauthAvatar = JSON.parse(
      localStorage.getItem(
        '@@oneclientjs@@::XwZKpFvNOpt50uJq3kS6::@@user@@'
      ) as string
    )

    if (!oauthAvatar) {
      return
    }

    setSrc(oauthAvatar.decodedToken.user.photoURL)
  }, [user.image])

  return { src, alt: user.name }
}
