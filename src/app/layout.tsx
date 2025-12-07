import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MemoryTool - Learn Names & Faces',
  description:
    'AI-powered spaced repetition learning tool to help you remember names and faces',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
