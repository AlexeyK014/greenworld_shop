import { updateUserPassword, updateUserPasswordFx } from '@/context/passwordRestore'
import { useLang } from '@/hooks/useLang'
import { useUnit } from 'effector-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/password-restore/index.module.scss'
import { IPasswordRestoreInputs } from '@/types/passwordRestore'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const PasswordRestoreForm = ({ userEmail }: { userEmail: string }) => {
  const { lang, translations } = useLang()
  const updatePasswordSpinner = useUnit(updateUserPasswordFx.pending)
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit, // вызывается при отправки формы
  } = useForm<IPasswordRestoreInputs>()

  // объект с настройками валидации для инпутов
  const passwordRegisterSetting = {
    required: translations[lang].validation.required_password,
    minLength: 4,
    maxLength: 40,
  }

  const handleCompletePasswordRestore = (data: IPasswordRestoreInputs) => {
    // если пароли не совпадают - делаем проверку чтобы не происходил запрос на сервер
    // чтобы просто призошёл ретёрн и показывалась ошибка
    if (data.password !== data.passwordRepeat) {
      toast.error('Пароли не совпадают!')
      return
    }

    updateUserPassword({
      email: userEmail,
      password: data.password
    })
  }
  return (
    <form
      className={styles.password_restore_form}
      onSubmit={handleSubmit(handleCompletePasswordRestore)}
    >
      <h2 className={styles.password_restore_form__title}>
        {translations[lang].password_restore_page.creaete_pasword}
      </h2>
      <label className={styles.password_restore_form__label}>
        {errors.password && (
          <span className={styles.password_restore_form__warn}>
            {errors.password.message}
          </span>
        )}
        <input
          type='password'
          className={styles.password_restore_form__input}
          placeholder={translations[lang].auth_popup.password}
          {...register('password', passwordRegisterSetting)}
        />
      </label>
      <label className={styles.password_restore_form__label}>
        {errors.passwordRepeat && (
          <span className={styles.password_restore_form__warn}>
            {errors.passwordRepeat.message}
          </span>
        )}
        <input
          type='password'
          className={styles.password_restore_form__input}
          placeholder={translations[lang].auth_popup.password}
          {...register('passwordRepeat', passwordRegisterSetting)}
        />
      </label>
      <button>
        {updatePasswordSpinner ? (
          <FontAwesomeIcon icon={faSpinner} spin color='#fff'/>
        ) : (
          translations[lang].common.save
        )}
      </button>
    </form>
  )
}

export default PasswordRestoreForm
