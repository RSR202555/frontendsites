"use client";

import { useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://app-backendgerenciadorsite.qeqzxb.easypanel.host/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || 'Falha ao criar conta');
        return;
      }

      alert('Conta criada! Agora você pode fazer login.');
      window.location.href = '/login';
    } catch (err) {
      setLoading(false);
      alert('Erro ao conectar com o servidor.');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleRegister}
        className="bg-slate-800 p-8 rounded-xl space-y-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-white">Criar conta</h1>
        <input
          className="w-full px-3 py-2 rounded bg-slate-900 text-white"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 rounded bg-slate-900 text-white"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-emerald-500 text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}
