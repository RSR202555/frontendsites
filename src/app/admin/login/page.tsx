"use client";

import Link from "next/link";
import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://app-backendgerenciadorsite.qeqzxb.easypanel.host/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Falha ao entrar");
        return;
      }

      const userRole: string | undefined = data?.user?.role;

      if (userRole !== "ADMIN") {
        alert("Apenas administradores podem acessar este painel.");
        return;
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      if (data.user) {
        if (data.user.name) {
          localStorage.setItem("auth_user_name", String(data.user.name));
        }
        if (data.user.email) {
          localStorage.setItem("auth_user_email", String(data.user.email));
        }
      } else {
        if (data.name) {
          localStorage.setItem("auth_user_name", String(data.name));
        }
        if (data.email) {
          localStorage.setItem("auth_user_email", String(data.email));
        } else if (email) {
          localStorage.setItem("auth_user_email", email);
        }
      }

      window.location.href = "/admin";
    } catch (err) {
      setLoading(false);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-[-8rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <div className="absolute left-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="absolute right-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-semibold tracking-[0.2em] text-slate-100">RSRDEV</span>
                <p className="text-[0.65rem] text-slate-400">Acesso administrativo</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10 sm:inline-flex"
            >
              Voltar para início
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
            >
              Login do cliente
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-start justify-center">
          <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
            <section className="space-y-4 text-sm text-slate-200 max-w-md">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Login do administrador</h1>
              <p>
                Área reservada para gestão de clientes, assinaturas e status dos sites mantidos pela RSRDEV.
              </p>
              <ul className="space-y-2 text-[0.75rem] text-slate-300">
                <li>
                  <span className="font-medium text-slate-100">Visão geral:</span> acompanhe rapidamente a saúde da base
                  de clientes.
                </li>
                <li>
                  <span className="font-medium text-slate-100">Controle de sites:</span> veja quais estão ativos ou
                  bloqueados.
                </li>
                <li>
                  <span className="font-medium text-slate-100">Cadastros:</span> crie novos clientes e mantenha os
                  dados organizados.
                </li>
              </ul>
            </section>

            <section className="flex justify-end">
              <form
                onSubmit={handleLogin}
                className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40 backdrop-blur-xl"
              >
                <h2 className="text-lg font-semibold text-slate-50">Entrar como admin</h2>
                <p className="text-[0.75rem] text-slate-300">
                  Use as credenciais administrativas fornecidas pela RSRDEV.
                </p>

                <div className="space-y-3 text-[0.8rem]">
                  <div className="space-y-1">
                    <label className="block text-slate-200">E-mail</label>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder="admin@rsrdev.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-200">Senha</label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder="Senha de administrador"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>

                <p className="text-[0.7rem] text-slate-500">
                  Se você não deveria ter acesso a esta área, retorne para o site principal.
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
