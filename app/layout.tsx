import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Smart Recipe Generator", description: "Suggests recipes from your ingredients with nutrition, filters, and favorites." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><div className="max-w-6xl mx-auto p-4">
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold">🥘 Smart Recipe Generator</h1>
      <a href="https://github.com/vishesh-hue/Smart-Recipe-Generator/" className="btn" target="_blank" rel="noreferrer">GitHub</a>
    </header>{children}
    <footer className="mt-12 text-center text-sm text-slate-400">Built with Next.js • Deployed on Vercel</footer>
  </div></body></html>);}
