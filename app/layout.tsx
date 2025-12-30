import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Генератор Экзаменационных Билетов',
  description: 'Генератор экзаменационных билетов формата A6 landscape',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
