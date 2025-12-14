import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'RSRDEV SUPORTE',
  description: 'Suporte e painel de clientes RSRDEV para gerenciamento de sites e assinaturas.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-slate-50 antialiased">{children}</body>
    </html>
  );
}
