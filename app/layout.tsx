import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Competitive Intelligence Tracker',
  description: 'Track competitor website changes with AI-powered summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:text-blue-100">
              🔍 Competitive Intelligence Tracker
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-blue-100">
                Home
              </Link>
              <Link href="/status" className="hover:text-blue-100">
                Status
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
