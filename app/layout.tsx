import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: 'ArBuilder',
  description: 'Ardacity Builder',
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">

      <body>{children}</body>
      <Analytics />
    </html>
  )
}
