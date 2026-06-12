import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'L2 Support Chat',
  description: 'AI-powered L2 technical support',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className="bg-gray-900 text-gray-100 m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  )
}