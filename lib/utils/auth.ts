import toast from 'react-hot-toast';
import { handleCloseAuthPopup } from './common';
import { setIsAuth } from '@/context/auth/index';

export const onAuthSuccess = <T>(message: string, data: T) => {
  localStorage.setItem('auth', JSON.stringify(data)); // сохраняем токен в LS
  toast.success(message); // показываем сообщение о логине или регистрации
  handleCloseAuthPopup(); // закрываем модалку авторизации
  setIsAuth(true); // меняем состояние
};

export const nameValidationRules = (message: string, requireMessage?: string) => ({
  ...(requireMessage && { required: requireMessage }),
  pattern: {
    value: /^[а-яА-Яa-zA-ZёЁ]*$/,
    message,
  },
  minLength: 2,
  maxLength: 15,
});

export const emailValidationRules = (message: string, requireMessage?: string) => ({
  ...(requireMessage && { required: requireMessage }),
  pattern: {
    value: /\S+@\S+\.\S+/,
    message,
  },
});

//проверка номера телефона
export const phoneValidationsRules = (message: string, requireMessage?: string) => ({
  ...(requireMessage && { required: requireMessage }),
  pattern: {
    value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    message,
  },
});
