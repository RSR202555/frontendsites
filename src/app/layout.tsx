import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Gerenciamento de Sites - SaaS',
  description: 'Plataforma SaaS para gerenciamento de sites com cobrança recorrente',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-slate-50 antialiased">{children}</body>
    </html>
  );
}
