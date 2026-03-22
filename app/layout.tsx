import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitHub Wrapped',
  description: 'Your year in code — Spotify Wrapped for GitHub',
  openGraph: {
    title: 'GitHub Wrapped 2024',
    description: 'See your year in code',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
