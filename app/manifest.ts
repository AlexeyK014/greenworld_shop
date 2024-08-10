import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Greeworld Application',
    short_name: 'Greeworld App',
    description: 'Greeworld магазин микрозелени',
    start_url: '/',
    background_color: '#fff',
    theme_color: '#fff',
    display: 'standalone',
    icons: [
      {
        src: '/img/icon.png',
        sizes: '60X60 512X512 144X144 192X192 126X128 120X120 180X180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
