import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
// import { Truck, Search, BarChart3, Shield, Mail } from 'lucide-react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MineLogistics SA - Mining Transport Directory",
  description: "Directory of South African mining transport companies with compliance and tracking features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}>
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🚛</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    MineLogistics SA
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Mining Transport Solutions</p>
                </div>
              </div>
              <nav className="flex space-x-1">
                <Link href="/companies" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 group">
                  <span className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform">🔍</span>
                  Directory
                </Link>
                <Link href="/tracking" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 group">
                  <span className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform">📊</span>
                  Tracking
                </Link>
                <Link href="/compliance" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 group">
                  <span className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform">🛡️</span>
                  Compliance
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 group">
                  <span className="h-4 w-4 mr-1">✉️</span>
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <span className="h-6 w-6 text-blue-400">🚛</span>
                  <span className="ml-2 text-lg font-bold">MineLogistics SA</span>
                </div>
                <p className="text-gray-300">Your trusted directory for South African mining transport companies.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-300 hover:text-white">Company Directory</Link></li>
                  <li><Link href="/tracking" className="text-gray-300 hover:text-white">Shipment Tracking</Link></li>
                  <li><Link href="/compliance" className="text-gray-300 hover:text-white">Compliance Guide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-300">Email: info@minelogistics.co.za</p>
                <p className="text-gray-300">Phone: +27 11 123 4567</p>
                <p className="text-gray-300">Johannesburg, South Africa</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>&copy; 2026 MineLogistics SA. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
