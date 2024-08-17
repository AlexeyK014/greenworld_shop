import { IBaseEffectProps } from '@/types/common'
import { EventCallable } from 'effector'
import { useState } from 'react'

export const useProductDelete = (
  id: string,
  deleteEvent: EventCallable<IBaseEffectProps> // принимаем эвент, где хотим удалить(избранне или сравнение)
) => {
  const [deleteSpinner, setDeleteSpinner] = useState(false)

  const handleDelete = () => {
    // получаем данные из LS
    const auth = JSON.parse(localStorage.getItem('auth') as string)

    // удаляем на сервере товар
    deleteEvent({
      setSpinner: setDeleteSpinner,
      jwt: auth.accessToken,
      id,
    })
  }
  return { handleDelete, deleteSpinner }
}
