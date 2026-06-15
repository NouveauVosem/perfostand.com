import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer/Footer'
import layoutStyles from '../components/layout/Layout.module.scss'
import '../styles/global.scss'

export const metadata = {
  title: 'Perfostand — Custom Tool Display Stands | OEM Merchandising Systems EU',
  description: 'Modular pegboard tool display stands for retail brands, DIY chains, and hardware stores. Custom OEM merchandising systems engineered in the EU. RAL colors, custom branding, EU-wide shipping.',
  keywords: 'tool display stands, pegboard stands, OEM merchandising, retail display, DIY store fixtures, hardware store display, custom stands EU',
  metadataBase: new URL('https://perfostand.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://perfostand.com/',
    title: 'Perfostand — Custom Tool Display Stands',
    description: 'Modular merchandising systems designed for retail brands, DIY chains, and hardware stores. Engineered in the EU. Built around your SKUs.',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perfostand — Custom Tool Display Stands',
    description: 'Modular merchandising systems designed for retail brands, DIY chains, and hardware stores. Engineered in the EU.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className={layoutStyles.root}>
          <Header />
          <main className={layoutStyles.main}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
