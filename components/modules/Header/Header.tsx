// 'use client'
// import { useLang } from '@/hooks/useLang'
// import Logo from '../../elements/Logo/logo'
// import Link from 'next/link'
// import Menu from './Menu'
// import { openMenu, openSearchModal } from '@/context/modals'
// import {
//   addOverflowHiddenToBody,
//   handleOpenAuthPopup,
//   triggerLoginCheck,
// } from '@/lib/utils/common'
// import CartPopup from './CartPopup/CartPopup'
// import HeaderProfile from './HeaderProfile'
// import { useUnit } from 'effector-react'
// import { $isAuth } from '@/context/auth'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSpinner } from '@fortawesome/free-solid-svg-icons'
// import { loginCheckFx } from '@/api/auth'
// import { useEffect } from 'react'
// import {
//   addProductsFromLSToCart,
//   setCartFromLS,
//   setShouldShowEmpty,
// } from '@/context/cart'
// import { setLang } from '@/context/lang'
// import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
// import {
//   $favorites,
//   $favoritesFromLS,
//   addProductsFromLSToFavorites,
//   setFavoritesFromLS,
//   setShouldShowEmptyFavorites,
// } from '@/context/favorites'

// const Header = () => {
//   const { lang, translations } = useLang()
//   const isAuth = useUnit($isAuth) // проверяем залогинен юзер или нет
//   const loginChekSpinner = useUnit(loginCheckFx.pending)
//   const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS)

//   const handleOpenMenu = () => {
//     addOverflowHiddenToBody()
//     openMenu()
//   }

//   const handleOpenSearchModal = () => {
//     openSearchModal()
//     addOverflowHiddenToBody()
//   }

//   useEffect(() => {
//     const auth = JSON.parse(localStorage.getItem('auth') as string)
//     const lang = JSON.parse(localStorage.getItem('lang') as string)
//     // при первом рендере получаем данные из LS в состояние
//     const cart = JSON.parse(localStorage.getItem('cart') as string)
//     const favoritesFromLS = JSON.parse(
//       localStorage.getItem('favorites') as string
//     )

//     // устанавливаем язык
//     if (lang) {
//       if (lang === 'ru' || lang === 'en') {
//         setLang(lang)
//       }
//     }

//     triggerLoginCheck() // если токен не валидный

//     // проверяем, если нет - тогда true
//     if (!favoritesFromLS || !favoritesFromLS?.length) {
//       setShouldShowEmptyFavorites(true)
//     }
//     if (!cart || !cart?.length) {
//       setShouldShowEmpty(true)
//     }

//     if (auth?.accessToken) {
//       return
//     }

//     if (cart && Array.isArray(cart)) {
//       if (!cart.length) {
//         setShouldShowEmpty(true)
//       } else {
//         setCartFromLS(cart)
//       }
//     }

//     if (favoritesFromLS && Array.isArray(favoritesFromLS)) {
//       if (!favoritesFromLS.length) {
//         setShouldShowEmptyFavorites(true)
//       } else {
//         setCartFromLS(cart)
//       }
//     }

//     // на первый рендер вызываем фун-ю и смотрим есть ли токен в LS
//     // если есть токены то получаем данные юзера
//     setFavoritesFromLS(favoritesFromLS)
//   }, [])

//   // если юзер авторизируется, чтобы мы синронизировались с сервером
//   // например для отправки товара который мы добавили будучи не авторизованны
//   useEffect(() => {
//     if (isAuth) {
//       const cartFromLS = JSON.parse(localStorage.getItem('cart') as string)
//       const favoritesFromLS = JSON.parse(
//         localStorage.getItem('favorites') as string
//       )
//       const auth = JSON.parse(localStorage.getItem('auth') as string)

//       // если есть данные корзины и если данные в массиве
//       if (cartFromLS && Array.isArray(cartFromLS)) {
//         addProductsFromLSToCart({
//           jwt: auth.accessToken,
//           cartItems: cartFromLS,
//         })
//       }

//       if (favoritesFromLS && Array.isArray(favoritesFromLS)) {
//         addProductsFromLSToFavorites({
//           jwt: auth.accessToken,
//           favoriteItems: favoritesFromLS,
//         })
//       }
//     }
//   }, [isAuth])

//   return (
//     <header className='header'>
//       <div className='container header__container'>
//         <button className='btn-reset header__burger' onClick={handleOpenMenu}>
//           {translations[lang].header.menu_btn}
//         </button>
//         <Menu />
//         <div className='header__logo'>
//           <Logo />
//         </div>
//         <ul className='header__links list-reset'>
//           <li className='header__links__item'>
//             <button
//               className='btn-reset header__links__item__btn header__links__item__btn--search'
//               onClick={handleOpenSearchModal}
//             />
//           </li>
//           <li className='header__links__item'>
//             <Link
//               href='/favorites'
//               className='header__links__item__btn header__links__item__btn--favorites'
//             >
//               {!!currentFavoritesByAuth.length && (
//                 <span className='not-empty' />
//               )}
//             </Link>
//           </li>
//           <li className='header__links__item'>
//             <Link
//               href='/comparison'
//               className='header__links__item__btn header__links__item__btn--compare'
//             />
//           </li>
//           <li className='header__links__item'>
//             <CartPopup />
//           </li>
//           <li className='header__links__item header__links__item--profile'>
//             {isAuth ? (
//               <HeaderProfile />
//             ) : loginChekSpinner ? (
//               <FontAwesomeIcon icon={faSpinner} spin />
//             ) : (
//               <button
//                 className='btn-reset header__links__item__btn header__links__item__btn--profile'
//                 onClick={handleOpenAuthPopup}
//               />
//             )}
//           </li>
//         </ul>
//       </div>
//     </header>
//   )
// }

// export default Header

'use client'
import Link from 'next/link'
import { useUnit } from 'effector-react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import Menu from './Menu'
import { openMenu, openSearchModal } from '@/context/modals'
import {
  addOverflowHiddenToBody,
  handleOpenAuthPopup,
  triggerLoginCheck,
} from '@/lib/utils/common'
import Logo from '../../elements/Logo/logo'
import { useLang } from '@/hooks/useLang'
import CartPopup from './CartPopup/CartPopup'
import HeaderProfile from './HeaderProfile'
import {
  addProductsFromLSToCart,
  setCartFromLS,
  setShouldShowEmpty,
} from '@/context/cart'
import { setLang } from '@/context/lang'
import {
  addProductsFromLSToFavorites,
  setFavoritesFromLS,
  setShouldShowEmptyFavorites,
} from '@/context/favorites'
import { useGoodsByAuth } from '@/hooks/useGoodsByAuth'
import { $favorites, $favoritesFromLS } from '@/context/favorites'
import { $isAuth } from '@/context/auth'
import { loginCheckFx } from '@/api/auth'

const Header = () => {
  const isAuth = useUnit($isAuth)
  const loginCheckSpinner = useUnit(loginCheckFx.pending)
  const { lang, translations } = useLang()
  // const user = useUnit($user)
  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS)

  const handleOpenMenu = () => {
    addOverflowHiddenToBody()
    openMenu()
  }

  const handleOpenSearchModal = () => {
    openSearchModal()
    addOverflowHiddenToBody()
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth') as string)
    const lang = JSON.parse(localStorage.getItem('lang') as string)
    const cart = JSON.parse(localStorage.getItem('cart') as string)
    const favoritesFromLS = JSON.parse(
      localStorage.getItem('favorites') as string
    )

    if (lang) {
      if (lang === 'ru' || lang === 'en') {
        setLang(lang)
      }
    }

    triggerLoginCheck()

    if (!favoritesFromLS || !favoritesFromLS?.length) {
      setShouldShowEmptyFavorites(true)
    }

    if (!cart || !cart?.length) {
      setShouldShowEmpty(true)
    }

    if (auth?.accessToken) {
      return
    }

    if (cart && Array.isArray(cart)) {
      if (!cart.length) {
        setShouldShowEmpty(true)
      } else {
        setCartFromLS(cart)
      }
    }

    if (favoritesFromLS && Array.isArray(favoritesFromLS)) {
      if (!favoritesFromLS.length) {
        setShouldShowEmptyFavorites(true)
      } else {
        setFavoritesFromLS(favoritesFromLS)
      }
    }
  }, [])

  useEffect(() => {
    if (isAuth) {
      const auth = JSON.parse(localStorage.getItem('auth') as string)
      const cartFromLS = JSON.parse(localStorage.getItem('cart') as string)
      const favoritesFromLS = JSON.parse(
        localStorage.getItem('favorites') as string
      )

      if (cartFromLS && Array.isArray(cartFromLS)) {
        addProductsFromLSToCart({
          jwt: auth.accessToken,
          cartItems: cartFromLS,
        })
      }

      if (favoritesFromLS && Array.isArray(favoritesFromLS)) {
        addProductsFromLSToFavorites({
          jwt: auth.accessToken,
          favoriteItems: favoritesFromLS,
        })
      }
    }
  }, [isAuth])

  return (
    <header className='header'>
      <div className='container header__container'>
        <button className='btn-reset header__burger' onClick={handleOpenMenu}>
          {translations[lang].header.menu_btn}
        </button>
        <Menu />
        <div className='header__logo'>
          <Logo />
        </div>
        <ul className='header__links list-reset'>
          <li className='header__links__item'>
            <button
              className='btn-reset header__links__item__btn header__links__item__btn--search'
              onClick={handleOpenSearchModal}
            />
          </li>
          <li className='header__links__item'>
            <Link
              href='/favorites'
              className='header__links__item__btn header__links__item__btn--favorites'
            >
              {!!currentFavoritesByAuth.length && (
                <span className='not-empty' />
              )}
            </Link>
          </li>
          <li className='header__links__item'>
            <Link
              className='header__links__item__btn header__links__item__btn--compare'
              href='/comparison'
            />
          </li>
          <li className='header__links__item'>
            <CartPopup />
          </li>
          <li className='header__links__item header__links__item--profile'>
            {isAuth ? (
              <HeaderProfile />
            ) : loginCheckSpinner ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <button
                className='btn-reset header__links__item__btn header__links__item__btn--profile'
                onClick={handleOpenAuthPopup}
              />
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
