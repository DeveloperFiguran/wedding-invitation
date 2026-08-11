import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Wedding Invitation',
  description: 'You are cordially invited to celebrate our wedding',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#FFFEF7',
              border: '1px solid #C9A96E',
              color: '#6B5B5B',
              fontFamily: 'Jost, sans-serif',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}