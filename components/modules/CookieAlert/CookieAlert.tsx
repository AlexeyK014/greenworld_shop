import { useLang } from '@/hooks/useLang'
import React from 'react'
import toast from 'react-hot-toast'

const CookieAlert = ({
  setCookieAlertOpen,
}: {
  setCookieAlertOpen: (arg0: boolean) => void
}) => {
  const { lang, translations } = useLang()

  const handleAcceptCookie = () => {
    // устанавливается на месяц
    document.cookie = 'CookieBy=Microgreen; max-age=' + 60 * 60 * 24 * 30

    // делаем проверку, если строчка установилась значит у юзера вкл cookie и закрываем модалку
    if (document.cookie) {
      setCookieAlertOpen(false)
    } else {
      toast.error(
        // eslint-disable-next-line max-len
        'Файл cookie не может быть установлен! Пожалуйста, разблокируйте этот сайт с помощью настроек cookie вышего браузера..'
      )
    }
  }

  const handleCloseAlert = () => setCookieAlertOpen(false)

  return (
    <div className='container cokkie-popup__container'>
      <button
        className='btn-reset cokkie-popup__close'
        onClick={handleCloseAlert}
      />
      <p
        className='cookie-popup_text'
        dangerouslySetInnerHTML={{
          __html: translations[lang].common.cookie_text,
        }}
      />
      <button
        className='btn-reset cookie-popup__accept'
        onClick={handleAcceptCookie}
      >
        {translations[lang].common.accept}
      </button>
    </div>
  )
}

export default CookieAlert
