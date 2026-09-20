import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mica Nail | Manicure e Nail Designer em Braga",
  description: "Serviços e marcação online da Mica Nail em Braga.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className="antialiased">{children}</body>
    </html>
  );
}
