import GoogleAnalytics from './GoogleAnalytics/GoogleAnalytics'
import YandexMetrika from './YandexMetrika/YandexMetrika'

export const AnalyticScripts = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const ymId = process.env.NEXT_PUBLIC_YM_ID

  return (
    <>
      {Boolean(gaId) && <GoogleAnalytics id={gaId || ''} />}
      {Boolean(ymId) && <YandexMetrika id={ymId || ''} />}
    </>
  )
}
