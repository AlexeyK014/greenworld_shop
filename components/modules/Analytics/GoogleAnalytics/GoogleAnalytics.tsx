import Script from 'next/script'

const GoogleAnalytics = ({ id }: { id: string }) => (
  <>
    <Script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
    <Script
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `,
      }}
      id='gtm'
      strategy='afterInteractive'
    />
  </>
)

export default GoogleAnalytics
