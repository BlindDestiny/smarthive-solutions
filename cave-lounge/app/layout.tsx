import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cave Lounge — Underground Bar & Lounge',
  description: 'Enter the cave. Premium cocktails, live music and underground atmosphere in the heart of the city.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
