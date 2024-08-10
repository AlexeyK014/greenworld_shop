import { $showQuickModal, $showSizeTable } from '@/context/modals'
import { closeAuthPopupWhenSomeModalOpened } from '@/lib/utils/common'
import { useUnit } from 'effector-react'

const AuthPopupClose = () => {
  const showQuickViewModal = useUnit($showQuickModal)
  const showSizeTable = useUnit($showSizeTable)

  const closePopup = () =>
    closeAuthPopupWhenSomeModalOpened(showQuickViewModal, showSizeTable)

  return <button className='btn-reset auth-popup__close' onClick={closePopup} />
}

export default AuthPopupClose
