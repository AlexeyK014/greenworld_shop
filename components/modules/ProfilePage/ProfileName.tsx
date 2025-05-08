import { editUsernameFx } from '@/context/profile';
import { $user } from '@/context/user/state';
import { useProfileEdit } from '@/hooks/useProfileEdit'
import { useUnit } from 'effector-react';
import React from 'react'
import styles from '@/styles/profile/index.module.scss'
import { motion } from 'framer-motion';
import { basePropsForMotion } from '@/constants/motion';
import { useForm } from 'react-hook-form';
import { nameValidationRules } from '@/lib/utils/auth';
import NameErrorMessage from '@/components/elements/NameErrorMessage/NameErrorMessage';
import { IInputs } from '@/types/authPopup';
import ProfileInfoActions from './ProfileInfoActions';
import ProfileInfoBlock from './ProfileInfoBlock';
import { loginCheckFx } from '@/context/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ProfileName() {
  const user = useUnit($user);
  const loginCheckSpinner = useUnit(loginCheckFx.pending)
  const {
    handleSaveNewName,
    edit,
    handleEdit,
    handleCancelEdit,
    spinner,
    handleChange
  } = useProfileEdit(user.name, editUsernameFx)

  const {
    register,
    formState: { errors, isValid },
    trigger,
    setValue
  } = useForm<IInputs & { [index: string]: string }>()

  const nameRegister = register(
    'name',
    nameValidationRules('Недопустимое значение!', 'Введите имя')
  )

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    nameRegister.onChange({
      target: {
        name: nameRegister.name,
        value: e.target.value.trim(),
      },
    })

    trigger(nameRegister.name)
    handleChange(e)
  }

  const allowEdit = () => {
    handleEdit()
    setValue(nameRegister.name, user.name) //сэтим имя
    trigger(nameRegister.name) // тригреим валидацию
  }

  return (
    <div className={styles.profile__info}>
      {loginCheckSpinner && (
        <FontAwesomeIcon icon={faSpinner} spin color='#fff' />
      )}
      {/* когда есть изменение */}
      {edit && !loginCheckSpinner && (
        <motion.div
          className={styles.profile__info__inner}
          {...basePropsForMotion}
        >
          <NameErrorMessage
            errors={errors}
            className={styles.profile__info__warn}
            fieldName={nameRegister.name}
          />
          <input
            className={styles.profile__info__input}
            type='text'
            name={nameRegister.name}
            ref={nameRegister.ref}
            onChange={handleNameInputChange}
            autoFocus
          />
          <ProfileInfoActions
            spinner={spinner}
            disabled={spinner || !isValid}
            handleCancelEdit={handleCancelEdit}
            handleSaveInfo={handleSaveNewName}
          />
        </motion.div>
      )}

      {/* когда ничего не изменяется */}
      {!edit && !loginCheckSpinner && (
        <ProfileInfoBlock allowEdit={allowEdit} text={user.name} />
      )}
    </div>
  )
}

export default ProfileName
