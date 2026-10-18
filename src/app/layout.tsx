import type { Metadata } from 'next'
import { Outfit, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TROFEO — IA Creadora | Tu mundo, sin límites.',
  description: 'TROFEO es una inteligencia artificial creadora. Convierte tus ideas en juegos, historias, contenido, productos y proyectos completos.',
  keywords: ['IA', 'inteligencia artificial', 'creación', 'juegos', 'historias', 'contenido'],
  authors: [{ name: 'TROFEO' }],
  openGraph: {
    title: 'TROFEO — IA Creadora',
    description: 'Tu mundo, sin límites.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${spaceGrotesk.variable} font-outfit antialiased bg-black text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
