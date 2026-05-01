import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIT041 Generator — TOTVS WMS SaaS",
  description: "Gerador de Diagrama de Processos para implantação de WMS SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
