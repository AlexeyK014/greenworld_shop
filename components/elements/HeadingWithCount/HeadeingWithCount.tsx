import { useLang } from '@/hooks/useLang'
import { showCountMessage } from '@/lib/utils/common'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from '@/styles/heading-with-count/index.module.scss'
import { IHeadingWithCount } from '@/types/elements'

const HeadeingWithCount = ({ count, title, spinner }: IHeadingWithCount) => {
  const { lang } = useLang()
  return (
    <h1 className={`site-title ${styles.title}`}>
      <span>{title}</span>
      <span className={styles.title__count}>
        {spinner ? <FontAwesomeIcon icon={faSpinner} spin /> : count}{' '}
        {showCountMessage(`${count}`, lang)}
      </span>
    </h1>
  )
}

export default HeadeingWithCount
