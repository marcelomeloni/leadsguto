import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
  title: "Guto Schiaveetto | Cadastro de Apoiadores",
  description: "Faça parte da campanha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-slate-100 flex flex-col`}>
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#fdbe21',
                color: '#000',
                fontWeight: 'bold'
              },
            },
          }} 
        />
      </body>
    </html>
  );
}
