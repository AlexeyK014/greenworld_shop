import autosize from 'autosize';
import { useLang } from '@/hooks/useLang';
import styles from '@/styles/order/index.module.scss';
import { useEffect, useState } from 'react';
import { FieldErrorsImpl, useForm } from 'react-hook-form';
import { emailValidationRules, nameValidationRules, phoneValidationsRules } from '@/lib/utils/auth';
import NameErrorMessage from '@/components/elements/NameErrorMessage/NameErrorMessage';
import { IInputs } from '@/types/authPopup';
import { $orderDetailsValues } from '@/context/order/state';
import { useUnit } from 'effector-react';
import { setOrderDetailsValues } from '@/context/order';
import { IOrderDetailsValues } from '@/types/order';

const OrderDetailsForm = () => {
  const { lang, translations } = useLang();
  const [messageLength, setMessageLength] = useState(0);
  const {
    register,
    trigger,
    watch, // получаем данные инпутов
    formState: { errors, isValid }, // isValid-ошибки валидации
  } = useForm<IOrderDetailsValues>();

  const orderDetailsValues = useUnit($orderDetailsValues);
  const inputs = watch();

  const nameRegister = register(
    'name_label',
    nameValidationRules(translations[lang].validation.invalid_value),
  );

  const surnameRegister = register(
    'surname_label',
    nameValidationRules(translations[lang].validation.invalid_value),
  );

  const phoneRegister = register(
    'phone_label',
    phoneValidationsRules(translations[lang].validation.invalid_phone),
  );

  const emailRegister = register(
    'email_label',
    emailValidationRules(translations[lang].validation.invalid_email),
  );

  const messageRegister = register('message_label', { maxLength: 255 });

  //анимация для input и textarea. Фун-ю передаём каждому input и textarea
  //e - будет либо input либо textarea
  const handleDetailsInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => e.target.classList.add(styles.with_value);

  //фун-я для обратной анимации, чтобы label обратно становился на место
  const handleDetailsInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    //делаем это когда юзер уже очистил input
    if (e.target.value) {
      return;
    }
    e.target.classList.remove(styles.with_value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    //чтобы валидация применялась при вводе данны
    messageRegister.onChange({
      target: {
        name: messageRegister.name,
        value,
      },
    });
    setOrderDetailsValues({
      ...inputs,
      isValid,
      message_label: value, // обновляем то поле в котором печатаем
    });
    setMessageLength(e.target.value.length);
    trigger(messageRegister.name); //тригеррим
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    //чтобы валидация применялась при вводе данны
    nameRegister.onChange({
      target: {
        name: nameRegister.name,
        value,
      },
    });
    setOrderDetailsValues({
      ...inputs,
      isValid,
      name_label: value, // обновляем то поле в котором печатаем
    });
    trigger(nameRegister.name); //тригеррим
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    //чтобы валидация применялась при вводе данны
    surnameRegister.onChange({
      target: {
        name: surnameRegister.name,
        value,
      },
    });
    setOrderDetailsValues({
      ...inputs,
      isValid,
      surname_label: value, // обновляем то поле в котором печатаем
    });
    trigger(surnameRegister.name); //тригеррим
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    //чтобы валидация применялась при вводе данны
    phoneRegister.onChange({
      target: {
        name: phoneRegister.name,
        value,
      },
    });
    setOrderDetailsValues({
      ...inputs,
      isValid,
      phone_label: value, // обновляем то поле в котором печатаем
    });
    trigger(phoneRegister.name); //тригеррим
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    //чтобы валидация применялась при вводе данны
    emailRegister.onChange({
      target: {
        name: emailRegister.name,
        value,
      },
    });
    setOrderDetailsValues({
      ...inputs,
      isValid,
      email_label: value, // обновляем то поле в котором печатаем
    });
    trigger(emailRegister.name); //тригеррим
  };

  useEffect(() => {
    const textarea = document.querySelector(
      `.${styles.order__list__item__details__form__textarea}`,
    );

    if (textarea) {
      autosize(textarea);
    }
  }, []);

  useEffect(() => {
    setOrderDetailsValues({
      ...orderDetailsValues,
      isValid,
    });
  }, [isValid]);

  return (
    <form className={styles.order__list__item__details__form}>
      <div className={styles.order__list__item__details__form__inner}>
        <label className={styles.order__list__item__details__form__label}>
          <input
            type="text"
            name={nameRegister.name}
            ref={nameRegister.ref}
            className={styles.order__list__item__details__form__input}
            onFocus={handleDetailsInputFocus}
            onBlur={handleDetailsInputBlur}
            onChange={handleNameChange}
          />
          <span className={styles.order__list__item__details__form__floating_label}>
            {translations[lang].order.name_label}
          </span>
          <NameErrorMessage
            errors={errors as Partial<FieldErrorsImpl<IInputs>>}
            className={styles.order__list__item__details__form__error}
            fieldName={nameRegister.name}
          />
        </label>
        <label className={styles.order__list__item__details__form__label}>
          <input
            type="text"
            name={surnameRegister.name}
            ref={surnameRegister.ref}
            className={styles.order__list__item__details__form__input}
            onFocus={handleDetailsInputFocus}
            onBlur={handleDetailsInputBlur}
            onChange={handleSurnameChange}
          />
          <span className={styles.order__list__item__details__form__floating_label}>
            {translations[lang].order.surname_label}
          </span>
          <NameErrorMessage
            errors={errors as Partial<FieldErrorsImpl<IInputs>>}
            className={styles.order__list__item__details__form__error}
            fieldName={surnameRegister.name}
          />
        </label>
        <label className={styles.order__list__item__details__form__label}>
          <input
            type="text"
            name={phoneRegister.name}
            ref={phoneRegister.ref}
            className={styles.order__list__item__details__form__input}
            onFocus={handleDetailsInputFocus}
            onBlur={handleDetailsInputBlur}
            onChange={handlePhoneChange}
          />
          <span className={styles.order__list__item__details__form__floating_label}>
            {translations[lang].order.phone_label}
          </span>
          {errors.phone_label && ( // делаем проверку и показываем ошибку
            <span className={styles.order__list__item__details__form__error}>
              {errors.phone_label?.message as React.ReactNode}
            </span>
          )}
        </label>
        <label className={styles.order__list__item__details__form__label}>
          <input
            type="text"
            name={emailRegister.name}
            ref={emailRegister.ref}
            className={styles.order__list__item__details__form__input}
            onFocus={handleDetailsInputFocus}
            onBlur={handleDetailsInputBlur}
            onChange={handleEmailChange}
          />
          <span className={styles.order__list__item__details__form__floating_label}>Email</span>
          {errors.email_label && ( // делаем проверку и показываем ошибку
            <span className={styles.order__list__item__details__form__error}>
              {errors.email_label?.message as React.ReactNode}
            </span>
          )}
        </label>
      </div>
      <label className={styles.order__list__item__details__form__label}>
        <textarea
          name={messageRegister.name}
          ref={messageRegister.ref}
          className={styles.order__list__item__details__form__textarea}
          onFocus={handleDetailsInputFocus}
          onBlur={handleDetailsInputBlur}
          onChange={handleMessageChange}
        />
        <span className={styles.order__list__item__details__form__floating_label}>
          {translations[lang].order.comments_order}
        </span>
        {errors.message_label && errors.message_label?.type === 'maxLength' && (
          <span className={styles.order__list__item__details__form__error}>
            {translations[lang].validation.max_255}
          </span>
        )}
        <span
          className={styles.order__list__item__details__form__label__count}
          style={{
            color: messageLength > 255 ? '#FF4747' : '#489765',
          }}
        >
          {messageLength}/255
        </span>
      </label>
    </form>
  );
};

export default OrderDetailsForm;
