'use client'

import { useLang } from '@/hooks/useLang'
import { handleCloseShareModule } from '@/lib/utils/common'
import styles from '@/styles/share-modal/index.module.scss'
import {
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

const ShareModal = () => {
  const { lang, translations } = useLang()
  return (
    <div className={styles.share_modal}>
      <h2 className={styles.share_modal__title}>
        {translations[lang].product.share}
      </h2>
      <button
        className={`btn-reset ${styles.share_modal__close}`}
        onClick={handleCloseShareModule}
      />
      <WhatsappShareButton
        url={window.location.href}
        style={{ marginRight: 10 }}
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <TelegramShareButton url={window.location.href}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
    </div>
  )
}

export default ShareModal
