"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminClient = {
  id: number;
  name: string;
  email: string;
  site: string;
  status: "ativo" | "bloqueado";
  plan: string;
  siteId: number;
};

type AdminOverview = {
  month: number;
  year: number;
  totalExpectedCents: number;
  totalReceivedCents: number;
  totalPendingCents: number;
  activeSubscriptions: number;
};

type AdminPayment = {
  id: number;
  amountCents: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
  provider: string;
};

const INITIAL_CLIENTS: AdminClient[] = [
  {
    id: 1,
    name: "Cliente Exemplo",
    email: "cliente1@exemplo.com",
    site: "www.cliente1.com.br",
    status: "ativo",
    plan: "Plano Mensal",
    siteId: 1,
  },
  {
    id: 2,
    name: "Loja Modelo",
    email: "contato@lojamodelo.com",
    site: "www.lojamodelo.com",
    status: "bloqueado",
    plan: "Plano Mensal",
    siteId: 2,
  },
];

export default function AdminDashboardPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [clients, setClients] = useState<AdminClient[]>(INITIAL_CLIENTS);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSite, setNewSite] = useState("");
  const [newPlan, setNewPlan] = useState("Plano Mensal");
  const [newPassword, setNewPassword] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [clientPayments, setClientPayments] = useState<AdminPayment[] | null>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [editingDueDateClientId, setEditingDueDateClientId] = useState<number | null>(null);
  const [editingDueDateValue, setEditingDueDateValue] = useState("");
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  const totalClients = clients.length;
  const activeSites = clients.filter((c) => c.status === "ativo").length;
  const blockedSites = clients.filter((c) => c.status === "bloqueado").length;

  useEffect(() => {
    if (!API_URL) return;

    async function loadClients() {
      try {
        const res = await fetch(`${API_URL}/admin/clients`);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          // se falhar, mantém os clientes mockados atuais
          // e apenas alerta o erro
          alert(data?.message || "Não foi possível carregar os clientes reais.");
          return;
        }

        const apiClients = (data?.clients as AdminClient[]) ?? [];
        setClients(apiClients.length > 0 ? apiClients : INITIAL_CLIENTS);
      } catch {
        // em erro de rede, mantém mock
      }
    }

    void loadClients();
  }, [API_URL]);

  useEffect(() => {
    if (!API_URL) return;

    async function loadOverview() {
      try {
        const res = await fetch(`${API_URL}/admin/overview`);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          return;
        }

        setOverview(data as AdminOverview);
      } catch {
        // silêncio em caso de erro, mantém cards com dados locais
      }
    }

    void loadOverview();
  }, [API_URL]);

  async function handleToggleSiteStatus(client: AdminClient) {
    if (!API_URL) {
      alert("API_URL não configurada.");
      return;
    }

    const isActive = client.status === "ativo";
    const path = isActive ? "block" : "unblock";

    try {
      const res = await fetch(`${API_URL}/admin/sites/${client.siteId}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Não foi possível atualizar o status do site.");
        return;
      }

      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? { ...c, status: isActive ? "bloqueado" : "ativo" }
            : c,
        ),
      );
    } catch {
      alert("Erro ao comunicar com o servidor para atualizar o status do site.");
    }
  }

  async function handleDeleteClient(client: AdminClient) {
    if (!API_URL) {
      alert("API_URL não configurada.");
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o cliente "${client.name || client.email}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/admin/clients/${client.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Não foi possível excluir o cliente.");
        return;
      }

      setClients((prev) => prev.filter((c) => c.id !== client.id));
      if (selectedClient?.id === client.id) {
        setSelectedClient(null);
        setClientPayments(null);
      }

      alert("Cliente excluído com sucesso.");
    } catch {
      alert("Erro ao comunicar com o servidor para excluir o cliente.");
    }
  }

  async function handleLoadPayments(client: AdminClient) {
    if (!API_URL) {
      alert("API_URL não configurada.");
      return;
    }

    setSelectedClient(client);
    setIsLoadingPayments(true);
    setClientPayments(null);

    try {
      const res = await fetch(`${API_URL}/admin/clients/${client.id}/payments`);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Não foi possível carregar as mensalidades do cliente.");
        return;
      }

      setClientPayments((data?.payments as AdminPayment[]) ?? []);
    } catch {
      alert("Erro ao comunicar com o servidor para carregar as mensalidades.");
    } finally {
      setIsLoadingPayments(false);
    }
  }

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();

    if (!API_URL) {
      alert("API_URL não configurada.");
      return;
    }

    if (!newEmail || !newSite) {
      alert("E-mail e site são obrigatórios.");
      return;
    }

    setIsSavingClient(true);
    try {
      const res = await fetch(`${API_URL}/admin/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName || undefined,
          email: newEmail,
          siteUrl: newSite,
          planName: newPlan,
          firstDueDate: newDueDate || undefined,
          // senha ainda não é usada pelo backend, mas já deixamos o campo na UI
          password: newPassword || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Não foi possível cadastrar o cliente.");
        return;
      }

      const created: AdminClient = {
        id: data.id,
        name: data.name ?? (newName || "Cliente"),
        email: data.email ?? newEmail,
        site: data.site ?? newSite,
        plan: data.plan ?? newPlan,
        status: data.status === "bloqueado" ? "bloqueado" : "ativo",
        siteId: data.siteId ?? Date.now(),
      };

      setClients((prev) => [...prev, created]);
      setNewName("");
      setNewEmail("");
      setNewSite("");
      setNewPlan("Plano Mensal");
      setNewPassword("");
      setNewDueDate("");
    } catch {
      alert("Erro ao comunicar com o servidor para cadastrar o cliente.");
    } finally {
      setIsSavingClient(false);
    }
  }

  async function handleUpdateDueDate(client: AdminClient) {
    if (!API_URL) {
      alert("API_URL não configurada.");
      return;
    }

    if (!editingDueDateValue) {
      alert("Informe a nova data de vencimento.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/clients/${client.id}/due-date`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: editingDueDateValue }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Não foi possível atualizar a data de vencimento.");
        return;
      }

      setEditingDueDateClientId(null);
      setEditingDueDateValue("");
      alert("Data de vencimento atualizada com sucesso.");
    } catch {
      alert("Erro ao comunicar com o servidor para atualizar a data de vencimento.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-[-8rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <div className="absolute left-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="absolute right-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-semibold tracking-[0.2em] text-slate-100">RSRDEV</span>
                <p className="text-[0.65rem] text-slate-400">Painel administrativo</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10 sm:inline-flex"
            >
              Página inicial
            </Link>
            <Link
              href="/login"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10 sm:inline-flex"
            >
              Painel do cliente
            </Link>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] lg:items-start">
          {/* COLUNA ESQUERDA: RESUMO + CADASTRO */}
          <section className="flex flex-col gap-4">
            {/* RESUMO GERAL */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-cyan-500/10 p-4 text-xs shadow-lg shadow-black/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">Resumo geral</p>
                  <p className="mt-1 bg-gradient-to-r from-cyan-400 via-emerald-300 to-sky-400 bg-clip-text text-sm font-semibold text-transparent">
                    Visão da base de clientes
                  </p>
                </div>
                <div className="hidden rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-[0.65rem] font-medium text-cyan-200 sm:inline-flex">
                  Painel administrativo
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 px-3 py-3">
                  <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 rounded-full bg-cyan-500/20 blur-xl" />
                  <p className="flex items-center gap-1 text-[0.7rem] text-slate-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    Total a receber neste mês
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-50">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format((overview?.totalExpectedCents ?? 0) / 100)}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-slate-500">
                    Soma das mensalidades das assinaturas ativas em {overview ? `${overview.month}/${overview.year}` : 'este mês'}.
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-3">
                  <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 rounded-full bg-emerald-400/20 blur-xl" />
                  <p className="flex items-center gap-1 text-[0.7rem] text-emerald-100">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Já recebido neste mês
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-200">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format((overview?.totalReceivedCents ?? 0) / 100)}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-emerald-100/80">Pagamentos marcados como pagos no período.</p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-3">
                  <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 rounded-full bg-amber-400/30 blur-xl" />
                  <p className="flex items-center gap-1 text-[0.7rem] text-amber-100">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Pendentes neste mês
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-amber-200">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format((overview?.totalPendingCents ?? 0) / 100)}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-amber-100/80">
                    Valores esperados que ainda não constam como pagos.
                  </p>
                </div>
              </div>
            </div>

            {/* CADASTRO DE CLIENTE */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs shadow-lg shadow-black/40">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Cadastro de cliente</p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">Adicionar novo cliente</p>
                </div>
              </div>

              <form onSubmit={handleCreateClient} className="grid gap-3 text-[0.8rem] sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-slate-200">Nome</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Nome do cliente"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-slate-200">E-mail</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="email@cliente.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-slate-200">Site</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="www.site.com.br"
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-slate-200">Plano</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Plano Mensal"
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-slate-200">Data de pagamento</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="block text-slate-200">Senha (opcional, ainda não utilizada no login)</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Senha inicial do cliente"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSavingClient}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-4 py-2 text-[0.75rem] font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSavingClient ? "Salvando..." : "Salvar cliente"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* COLUNA DIREITA: LISTA DE CLIENTES */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs shadow-lg shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Clientes</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">Lista de clientes e status</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/50">
              <table className="min-w-full text-left text-[0.75rem] text-slate-200">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 font-medium">Nome</th>
                    <th className="px-3 py-2 font-medium">E-mail</th>
                    <th className="px-3 py-2 font-medium">Site</th>
                    <th className="px-3 py-2 font-medium">Plano</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Vencimento</th>
                    <th className="px-3 py-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-3 py-2 text-slate-50">{client.name}</td>
                      <td className="px-3 py-2 text-slate-300">{client.email}</td>
                      <td className="px-3 py-2 text-slate-300">{client.site}</td>
                      <td className="px-3 py-2 text-slate-300">{client.plan}</td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            client.status === "ativo"
                              ? "inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-[0.7rem] font-medium text-emerald-300"
                              : "inline-flex rounded-full bg-amber-500/10 px-2 py-1 text-[0.7rem] font-medium text-amber-300"
                          }
                        >
                          {client.status === "ativo" ? "Ativo" : "Bloqueado"}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editingDueDateClientId === client.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                              value={editingDueDateValue}
                              onChange={(e) => setEditingDueDateValue(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateDueDate(client)}
                              className="inline-flex rounded-full bg-emerald-500 px-2 py-1 text-[0.7rem] font-medium text-slate-950 hover:brightness-110"
                            >
                              Salvar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDueDateClientId(null);
                                setEditingDueDateValue("");
                              }}
                              className="inline-flex rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[0.7rem] font-medium text-slate-50 hover:border-slate-400/60 hover:bg-slate-700/40"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDueDateClientId(client.id);
                              setEditingDueDateValue("");
                            }}
                            className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
                          >
                            Editar data
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleSiteStatus(client)}
                          className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
                        >
                          {client.status === "ativo" ? "Bloquear" : "Desbloquear"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadPayments(client)}
                          className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium text-slate-50 shadow-sm shadow-black/40 transition hover:border-emerald-400/60 hover:bg-emerald-500/10"
                        >
                          Mensalidades
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(client)}
                          className="inline-flex rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[0.7rem] font-medium text-red-200 shadow-sm shadow-black/40 transition hover:bg-red-500/20"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MENSALIDADES DO CLIENTE SELECIONADO */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4 text-xs shadow-lg shadow-black/40">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Mensalidades</p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    {selectedClient ? `Pagamentos de ${selectedClient.name || selectedClient.email}` : 'Selecione um cliente para ver as mensalidades'}
                  </p>
                </div>
              </div>

              {isLoadingPayments && (
                <p className="text-[0.75rem] text-slate-400">Carregando mensalidades...</p>
              )}

              {!isLoadingPayments && selectedClient && (clientPayments?.length ?? 0) === 0 && (
                <p className="text-[0.75rem] text-slate-500">
                  Nenhuma mensalidade encontrada para este cliente.
                </p>
              )}

              {!isLoadingPayments && (clientPayments?.length ?? 0) > 0 && (
                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {clientPayments?.map((payment) => {
                    const amount = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(payment.amountCents / 100);

                    const date = payment.paidAt || payment.createdAt;
                    const formattedDate = new Date(date).toLocaleDateString('pt-BR');

                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                      >
                        <div>
                          <p className="text-[0.75rem] font-medium text-slate-50">{amount}</p>
                          <p className="text-[0.7rem] text-slate-400">{formattedDate}</p>
                        </div>
                        <div className="text-right text-[0.7rem]">
                          <span
                            className={
                              payment.status === 'PAID'
                                ? 'inline-flex rounded-full bg-emerald-500/10 px-2 py-1 font-medium text-emerald-300'
                                : 'inline-flex rounded-full bg-slate-500/10 px-2 py-1 font-medium text-slate-200'
                            }
                          >
                            {payment.status}
                          </span>
                          <p className="mt-1 text-[0.65rem] text-slate-500">{payment.provider}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
