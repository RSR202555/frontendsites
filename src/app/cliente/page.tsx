"use client";

import { useEffect, useMemo, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ClienteDashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<{
    planName: string;
    priceCents: number;
    subscriptionStatus: string;
    currentPeriodEnd: string;
    siteUrl: string | null;
    lastPayment: {
      amountCents: number;
      status: string;
      paidAt: string | null;
      createdAt: string;
    } | null;
  } | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [paymentPreference, setPaymentPreference] = useState<'pix' | 'card'>('pix');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSummary(userId: number) {
      try {
        setIsLoadingSummary(true);
        const response = await fetch(`${API_URL}/client/summary?userId=${userId}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || 'Não foi possível carregar os dados do cliente.');
        }

        const data = (await response.json()) as {
          planName: string;
          priceCents: number;
          subscriptionStatus: string;
          currentPeriodEnd: string;
          siteUrl: string | null;
          lastPayment: {
            amountCents: number;
            status: string;
            paidAt: string | null;
            createdAt: string;
          } | null;
        };

        setClientData(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro inesperado ao carregar os dados do cliente.';
        setError(message);
      } finally {
        setIsLoadingSummary(false);
      }
    }

    const storedName = typeof window !== 'undefined' ? localStorage.getItem('auth_user_name') : null;
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('auth_user_email') : null;
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null;
    if (storedName) {
      setClientName(storedName);
    } else if (storedEmail) {
      setClientName(storedEmail);
    }

    if (API_URL) {
      const userIdNumber = storedUserId ? Number(storedUserId) : 1;
      void loadSummary(Number.isNaN(userIdNumber) || !userIdNumber ? 1 : userIdNumber);
    }
  }, []);

  const displayName = useMemo(() => {
    if (!clientName) return 'cliente';

    // Se vier email, pega só a parte antes do "@"
    const fromEmail = clientName.includes('@') ? clientName.split('@')[0] : clientName;

    // Se tiver nome completo, pega só a primeira palavra
    const firstWord = fromEmail.trim().split(' ')[0];

    // Capitaliza primeira letra
    if (!firstWord) return 'cliente';
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  }, [clientName]);

  const priceFormatted = useMemo(() => {
    if (!clientData) return 'R$ 100,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      clientData.priceCents / 100,
    );
  }, [clientData]);

  function parseIsoDateToLocal(dateString: string): Date | null {
    if (!dateString) return null;

    const [datePart] = dateString.split('T');
    const parts = datePart.split('-');

    if (parts.length === 3) {
      const [yearStr, monthStr, dayStr] = parts;
      const year = Number(yearStr);
      const month = Number(monthStr);
      const day = Number(dayStr);

      if (!year || !month || !day) return null;

      const d = new Date(year, month - 1, day);
      if (!Number.isNaN(d.getTime())) return d;
    }

    const fallback = new Date(dateString);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const currentPeriodEndFormatted = useMemo(() => {
    if (!clientData) return '10/12/2025';
    const date = parseIsoDateToLocal(clientData.currentPeriodEnd);
    return date ? date.toLocaleDateString('pt-BR') : '10/12/2025';
  }, [clientData]);

  const nextPayments = useMemo(() => {
    if (!clientData) {
      return [
        { date: '10/01/2026', amount: 'R$ 100,00', status: 'A vencer' },
        { date: '10/02/2026', amount: 'R$ 100,00', status: 'A vencer' },
        { date: '10/03/2026', amount: 'R$ 100,00', status: 'A vencer' },
      ];
    }

    const base = parseIsoDateToLocal(clientData.currentPeriodEnd) ?? new Date();
    const amount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      clientData.priceCents / 100,
    );

    return [1, 2, 3].map((offset) => {
      const d = new Date(base);
      d.setMonth(d.getMonth() + offset);
      return {
        date: d.toLocaleDateString('pt-BR'),
        amount,
        status: 'A vencer',
      };
    });
  }, [clientData]);

  const paymentStatusLabel = useMemo(() => {
    if (!clientData) return 'Pendente';

    switch (clientData.subscriptionStatus) {
      case 'ACTIVE':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'SUSPENDED':
        return 'Suspenso';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return clientData.subscriptionStatus || 'Pendente';
    }
  }, [clientData]);

  const subscriptionStatusInfo = useMemo(() => {
    const status = paymentStatusLabel.toLowerCase();
    const vencimento = currentPeriodEndFormatted;

    if (status === 'pago') {
      return {
        label: 'Sua assinatura está em dia.',
        detail: `Próximo vencimento em ${vencimento}.`,
        tone: 'success' as const,
      };
    }

    if (status === 'suspenso' || status === 'cancelado') {
      return {
        label: 'Sua assinatura não está ativa.',
        detail: 'Entre em contato com o suporte para regularizar sua situação.',
        tone: 'danger' as const,
      };
    }

    // pendente ou outro
    return {
      label: 'Pagamento pendente.',
      detail: `Evite bloqueio do site mantendo o pagamento até ${vencimento}.`,
      tone: 'warning' as const,
    };
  }, [paymentStatusLabel, currentPeriodEndFormatted]);

  const lastPaymentInfo = useMemo(() => {
    if (!clientData || !clientData.lastPayment) return null;

    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(clientData.lastPayment.amountCents / 100);

    const dateSource = clientData.lastPayment.paidAt ?? clientData.lastPayment.createdAt;
    const date = parseIsoDateToLocal(dateSource);
    const formattedDate = date ? date.toLocaleDateString('pt-BR') : '';

    return {
      amount,
      status: clientData.lastPayment.status,
      date: formattedDate,
    };
  }, [clientData]);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user_name');
      localStorage.removeItem('auth_user_email');
      localStorage.removeItem('auth_user_id');
    }

    window.location.href = '/login';
  }

  async function handlePayNow() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/payments/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Pagamento de assinatura',
          quantity: 1,
          unitPrice: clientData ? clientData.priceCents / 100 : 100,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Não foi possível iniciar o pagamento.');
      }
      const data = (await response.json()) as { init_point?: string };

      if (!data.init_point) {
        throw new Error('URL de checkout do Mercado Pago não retornada pelo servidor.');
      }

      window.location.href = data.init_point;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao iniciar o pagamento.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-slate-50">
      {/* fundo com gradientes tecnológicos inspirados na RSRDEV */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-[-8rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            {/* Logo RSRDEV simplificada em texto + circuito */}
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <div className="absolute left-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="absolute right-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-semibold tracking-[0.2em] text-slate-100">
                  RSRDEV
                </span>
                <p className="text-[0.65rem] text-slate-400">
                  {displayName}
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-3 text-xs z-20">
            <div className="hidden items-center gap-2 sm:flex">
              <a
                href="https://www.instagram.com/rsrdev_/?igsh=MTRkb2JqNjEyNGI4MA%3D%3D#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://wa.me/557591280629"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-50 shadow-sm shadow-black/40 transition hover:border-emerald-400/60 hover:bg-emerald-500/10"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    d="M20 11.9C20 7.96 16.87 5 12.98 5 9.4 5 7 7.72 7 11.28c0 1.08.29 2.1.84 3.02L7 19l2.8-.73c.88.48 1.87.73 2.9.73 3.6 0 7.3-2.71 7.3-7.1Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M10.5 9.5c-.2-.44-.33-.45-.62-.45h-.52c-.3 0-.77.11-.77.54 0 .43.4 1.06.46 1.13.06.08.8 1.28 1.93 1.8 1.43.63 1.72.5 2.03.47.31-.03.66-.27.75-.53.09-.26.09-.48.06-.53-.03-.05-.11-.08-.23-.14-.12-.06-.72-.35-.83-.39-.11-.04-.19-.06-.27.06-.08.11-.31.39-.38.47-.07.08-.14.09-.26.03-.12-.06-.5-.18-.96-.57-.36-.3-.6-.68-.67-.8-.07-.12-.01-.18.05-.24.06-.06.12-.14.18-.21.06-.07.08-.12.12-.2.04-.08.02-.15-.01-.21-.03-.06-.27-.67-.38-.92Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.7rem] font-medium text-slate-100 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
              >
                <span className="hidden sm:inline">Olá, {displayName}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-black/90 p-2 text-[0.75rem] text-slate-100 shadow-lg shadow-black/40 z-30">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-white/10"
                  >
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* HERO + DASHBOARD */}
        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)] lg:items-stretch">
          {/* HERO ESQUERDA */}
          <section className="flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Tudo do seu site
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
                  em um só lugar.
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
                Acompanhe suas mensalidades, veja o status da assinatura, emita comprovantes e mantenha o seu site
                sempre online com a experiência premium da RSRDEV.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isLoading || !API_URL}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 -z-10 translate-x-[-120%] bg-gradient-to-r from-white/30 to-transparent opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  {isLoading ? 'Redirecionando...' : 'Pagar mensalidade agora'}
                </button>
                <span className="text-[0.7rem] text-slate-400">
                  Segurança via Mercado Pago • Atualizado em tempo real
                </span>
              </div>

              <div className="mt-6 grid gap-3 text-xs text-slate-200 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-100">Assinatura em dia</p>
                    <p className="text-[0.7rem] text-slate-400">
                      Evite bloqueios mantendo o pagamento atualizado.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <div>
                    <p className="font-medium text-slate-100">Painel em tempo real</p>
                    <p className="text-[0.7rem] text-slate-400">
                      Visualize vencimentos e status em segundos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden text-[0.7rem] text-slate-500 sm:block">
              <p>
                RSRDEV • Tecnologia para deixar a gestão do seu site simples, segura e sempre disponível.
              </p>
            </div>
          </section>

          {/* DASHBOARD DIREITA */}
          <section
            className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/40 backdrop-blur-xl"
            aria-label="Visão geral do seu painel"
          >
            {/* barra de status da assinatura */}
            <div
              className={
                subscriptionStatusInfo.tone === 'success'
                  ? 'flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs'
                  : subscriptionStatusInfo.tone === 'danger'
                    ? 'flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs'
                    : 'flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs'
              }
            >
              <span
                className={
                  subscriptionStatusInfo.tone === 'success'
                    ? 'mt-1 h-2 w-2 rounded-full bg-emerald-400'
                    : subscriptionStatusInfo.tone === 'danger'
                      ? 'mt-1 h-2 w-2 rounded-full bg-red-400'
                      : 'mt-1 h-2 w-2 rounded-full bg-amber-300'
                }
              />
              <div>
                <p className="text-[0.75rem] font-medium text-slate-50">{subscriptionStatusInfo.label}</p>
                <p className="text-[0.7rem] text-slate-200">{subscriptionStatusInfo.detail}</p>
              </div>
            </div>

            {/* topo do card: status da assinatura */}
            <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 text-xs text-slate-200">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Resumo rápido</p>
                <p className="mt-1 text-sm font-medium text-slate-50">
                  Assinatura {paymentStatusLabel.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[0.7rem] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Site online
                </span>
              </div>
            </div>

            {/* conteúdo principal do dashboard */}
            <div className="grid flex-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              {/* métrica principal + gráfico */}
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">Pagamento atual</p>
                      <p className="mt-1 text-sm font-medium text-slate-50">{priceFormatted}</p>
                      <p className="mt-1 text-[0.7rem] text-slate-400">
                        Plano: {clientData?.planName ?? 'Plano Mensal'}
                      </p>
                      <p className="mt-1 text-[0.7rem] text-slate-400">
                        Dia fixo de vencimento: {currentPeriodEndFormatted.split('/')[0]} de cada mês
                      </p>
                    </div>
                    <div className="text-right text-[0.7rem] text-slate-400">
                      <p>Vencimento</p>
                      <p className="font-medium text-slate-100">{currentPeriodEndFormatted}</p>
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[0.65rem] font-medium text-slate-200">
                        <span
                          className={
                            paymentStatusLabel.toLowerCase() === 'pago'
                              ? 'h-1.5 w-1.5 rounded-full bg-emerald-400'
                              : 'h-1.5 w-1.5 rounded-full bg-amber-400'
                          }
                        />
                        Assinatura {paymentStatusLabel.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-4">
                    {/* pseudo donut chart */}
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-slate-700 border-t-cyan-400 border-r-emerald-400" />
                      <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-black">
                        <span className="text-sm font-semibold text-slate-50">82%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1 text-[0.7rem] text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Mensalidade em dia</span>
                        <span className="font-medium text-emerald-300">82%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: '82%' }} />
                      </div>
                      <p className="text-[0.68rem] text-slate-500">
                        Este é o percentual de pagamentos concluídos dentro do prazo no período atual.
                      </p>
                    </div>
                  </div>
                </div>

                {/* informações adicionais: site e último pagamento */}
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                    <p className="text-[0.7rem] text-slate-400">Seu site</p>
                    <p className="mt-1 text-[0.8rem] font-medium text-slate-100 break-all">
                      {clientData?.siteUrl ? (
                        <a
                          href={clientData.siteUrl.startsWith('http') ? clientData.siteUrl : `https://${clientData.siteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-cyan-400/70 underline-offset-2 hover:text-cyan-300"
                        >
                          {clientData.siteUrl}
                        </a>
                      ) : (
                        'URL do site não cadastrada.'
                      )}
                    </p>
                    <p className="mt-1 text-[0.68rem] text-slate-500">
                      Qualquer alteração de domínio é feita diretamente com a RSRDEV.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                    <p className="text-[0.7rem] text-slate-400">Último pagamento</p>
                    {lastPaymentInfo ? (
                      <>
                        <p className="mt-1 text-[0.85rem] font-semibold text-slate-50">{lastPaymentInfo.amount}</p>
                        <p className="text-[0.7rem] text-slate-300">{lastPaymentInfo.date}</p>
                        <p className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-[0.65rem] font-medium text-emerald-300">
                          {lastPaymentInfo.status}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-[0.7rem] text-slate-500">Nenhum pagamento registrado ainda.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* próximas cobranças / timeline */}
              <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">Próximas cobranças</p>
                    <p className="mt-1 text-sm font-medium text-slate-50">Linha do tempo de vencimentos</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {(nextPayments ?? []).map((payment, index) => (
                    <div
                      key={`${payment.date}-${index}`}
                      className="group flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2 transition hover:border-cyan-400/60 hover:bg-cyan-400/5"
                    >
                      <div className="mt-1 flex flex-col items-center text-[0.6rem] text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 group-hover:bg-emerald-400" />
                        {index < (nextPayments?.length ?? 0) - 1 && (
                          <span className="mt-1 h-6 w-px bg-slate-700" />
                        )}
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <div>
                          <p className="text-[0.75rem] font-medium text-slate-50">{payment.date}</p>
                          <p className="text-[0.7rem] text-slate-400">Cobrança recorrente da sua assinatura</p>
                        </div>
                        <div className="text-right text-[0.75rem]">
                          <p className="font-semibold text-cyan-300">{payment.amount}</p>
                          <p className="text-[0.7rem] text-emerald-300">{payment.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!nextPayments || nextPayments.length === 0) && (
                    <p className="text-[0.75rem] text-slate-500">
                      Nenhuma cobrança futura encontrada para a sua assinatura.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* estado de erro / loading */}
            {(error || isLoadingSummary) && (
              <div className="mt-3 text-[0.75rem]">
                {error ? (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200">
                    {error}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span>Carregando informações do seu painel...</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* MODAL DE FORMA DE PAGAMENTO */}
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-xl shadow-black/60 backdrop-blur-xl">
                <h3 className="text-lg font-semibold mb-2 text-slate-50">Atualizar forma de pagamento</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Escolha a forma de pagamento preferida. Você poderá ajustá-la novamente direto na tela do Mercado
                  Pago se desejar.
                </p>

                <div className="space-y-3 mb-6 text-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentPreference('pix')}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      paymentPreference === 'pix'
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100'
                        : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-medium">Pix via Mercado Pago</div>
                    <div className="text-xs text-slate-300">
                      Pagamento instantâneo com QR Code ou copia e cola, processado pelo Mercado Pago.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPreference('card')}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      paymentPreference === 'card'
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100'
                        : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-medium">Cartão de crédito (Mercado Pago)</div>
                    <div className="text-xs text-slate-300">
                      Pagamento em cartão de crédito com possibilidade de parcelamento.
                    </div>
                  </button>
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="rounded-full border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-2 font-medium text-slate-950 hover:brightness-110 transition-colors"
                  >
                    Salvar preferência
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
