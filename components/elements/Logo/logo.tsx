import Link from 'next/link'
import styles from './logo.module.css'

const Logo = () => (
  <Link className={styles.logo} href='/'>
    <img className={styles.logoImg} src='/img/logo.png' alt='GreenWorld Logo' />
  </Link>
)

export default Logo
