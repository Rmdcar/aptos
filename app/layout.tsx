import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: 'Apartamento à Venda | [Arcos do Paraíso/Condomínio]',
  description: 'Excelente oportunidade de compra. Imóvel com 53 m², [2] quartos e documentação 100% regularizada. Agende sua visita.',
  openGraph: {
    title: 'Apartamento à Venda | [Arcos do Paraíso/Anápolis]',
    description: 'Imóvel com 53 m², 2 quartos e excelente localização.',
    images: ['/img1.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
