import { setIsAuth } from '@/context/auth'
import { useEarthoOne } from '@eartho/one-client-react'
import { useRouter } from 'next/navigation'

export const useUserLogout = () => {
  const router = useRouter()
  const { logout } = useEarthoOne()

  // возвращаем фун-ю, где у хука useEarthoOne получаем фун-ю логаут
  // в clientId передаём NEXT_PUBLIC_OAUTH_CLIENT_ID
  // чтобы isConnected был false
  // чистим LS то токенов
  // редиректим на главную страницу
  return () => {
    logout({ clientId: '' })
    localStorage.removeItem('auth')
    setIsAuth(false)
    router.push('/')
    window.location.reload()
  }
}
