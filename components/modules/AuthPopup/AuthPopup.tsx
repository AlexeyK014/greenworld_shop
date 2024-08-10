import { useState } from 'react'
import AuthPopupRegistration from './AuthPopupRegistration'
import AuthPopupLogin from './AuthPopupLogin'

const AuthPopup = () => {
  const [isAuthSwitched, setIsAuthSwitched] = useState(false) // переключил ли юзер модалки(регистраци/логин)
  const [isSignInActive, setIsSignInActive] = useState(false) // активная сторона - Логин
  const [isSignupActive, setIsSignupActive] = useState(true) //  активная сторона - Регистрация

  // переключаем регистрацию на авторизацию
  const toggleAuth = () => {
    setIsAuthSwitched(!isAuthSwitched)
    setIsSignInActive(!isSignInActive)
    setIsSignupActive(!isSignupActive)
  }
  return (
    <div className='container auth-popup'>
      <div>
        <div className='starsec' />
        <div className='starthird' />
        <div className='starfourth' />
        <div className='starfifth' />
      </div>
      <div className={`auth-popup__card ${isAuthSwitched ? 'switched' : ''}`}>
        <div className='auth-popup__card__inner'>
          <AuthPopupRegistration
            toggleAuth={toggleAuth}
            isSideActive={isSignupActive}
          />
          <AuthPopupLogin
            toggleAuth={toggleAuth}
            isSideActive={isSignInActive}
          />
        </div>
      </div>
    </div>
  )
}

export default AuthPopup

// import { useState } from 'react'
// import AuthPopupRegistration from './AuthPopupRegistration'
// import AuthPopupLogin from './AuthPopupLogin'

// const AuthPopup = () => {
//   const [isAuthSwitched, setIsAuthSwitched] = useState(false)
//   const [isSignInActive, setIsSignInActive] = useState(false)
//   const [isSignupActive, setIsSignupActive] = useState(true)

//   const toggleAuth = () => {
//     setIsAuthSwitched(!isAuthSwitched)
//     setIsSignInActive(!isSignInActive)
//     setIsSignupActive(!isSignupActive)
//   }

//   return (
//     <div className='container auth-popup'>
//       <div>
//         <div className='starsec' />
//         <div className='starthird' />
//         <div className='starfourth' />
//         <div className='starfifth' />
//       </div>
//       <div className={`auth-popup__card ${isAuthSwitched ? 'switched' : ''}`}>
//         <div className='auth-popup__card__inner'>
//           <AuthPopupRegistration
//             toggleAuth={toggleAuth}
//             isSideActive={isSignupActive}
//           />
//           <AuthPopupLogin
//             toggleAuth={toggleAuth}
//             isSideActive={isSignInActive}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AuthPopup
