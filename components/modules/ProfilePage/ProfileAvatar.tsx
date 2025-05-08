import { useUserAvatar } from '@/hooks/useUserAvatar'
import Image from 'next/image'
import React from 'react'
import styles from '@/styles/profile/index.module.scss'
import { useUnit } from 'effector-react'
import { uploadAvatar, uploadUserAvatarFx } from '@/context/profile'
import { isValidAvatarImage } from '@/lib/utils/common'
import { loginCheckFx } from '@/context/user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const ProfileAvatar = () => {
  const { src, alt } = useUserAvatar()
  const uploadSpinner = useUnit(uploadUserAvatarFx.pending)
  const loginCheckSpinner = useUnit(loginCheckFx.pending)

  // динамическое изменение размеров картинки
  const isMedia380 = useMediaQuery(380)
  const avatarSize = isMedia380 ? 280 : 320

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = (e.target.files as FileList)[0] // это нулевой эл-т массива
    const auth = JSON.parse(localStorage.getItem('auth') as string)

    // делаем проверку на валидность
    if (!isValidAvatarImage(image)) {
      return
    }

    // когда валидный, создаём инстанс от этого класса
    const formData = new FormData()

    formData.append('binaryContent', image, image.name) //указываем название файла

    uploadAvatar({ formData, jwt: auth.accessToken })
  }

  return (
    <div className={styles.profile__avatar}>
      {loginCheckSpinner && (
        <FontAwesomeIcon icon={faSpinner} spin color="#3e9651" size="3x" />
      )}

      {/* когда аватра изначально есть */}
      {src && !loginCheckSpinner && (
        <>
          <label
            className={`btn-reset ${styles.profile__avatar__edit} ${styles.profile__info__edit}`}
          >
            <input type='file' onChange={handleUploadFile} hidden />
          </label>
          {uploadSpinner ? (
            <FontAwesomeIcon icon={faSpinner} spin color="#3e9651" size="3x" />
          ) : (
            <Image src={src} width={avatarSize} height={avatarSize} alt={alt} />
          )}
        </>
      )}
      {/* когда автарки нет */}
      {!src && !loginCheckSpinner && (
        uploadSpinner ? (
          <FontAwesomeIcon icon={faSpinner} spin color="#3e9651" size="3x" />
        ) : (
          <label className={`${styles.profile__photo}`} >
            <input type='file' onChange={handleUploadFile} />
          </label>
        )
      )}
    </div>
  )
}

export default ProfileAvatar
