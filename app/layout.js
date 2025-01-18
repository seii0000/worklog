// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthContextProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import { AdminContextProvider } from "./context/AdminContext"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <AdminContextProvider>
            <Navbar />
            {children}
          </AdminContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}