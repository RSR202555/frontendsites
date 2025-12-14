import Link from 'next/link';

export default function HomePage() {
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
        <header className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo e brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <div className="absolute left-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="absolute right-1 h-0.5 w-3 rounded-full bg-cyan-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-semibold tracking-[0.2em] text-slate-100">RSRDEV</span>
                <p className="text-[0.65rem] text-slate-400">Plataforma do cliente</p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <nav className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <Link
              href="/login"
              className="text-[0.75rem] font-medium text-slate-200 transition hover:text-cyan-300"
            >
              Painel do cliente
            </Link>
            <Link
              href="/como-funciona"
              className="text-[0.75rem] text-slate-400 transition hover:text-cyan-300"
            >
              Como funciona
            </Link>
            <Link
              href="/suporte"
              className="text-[0.75rem] text-slate-400 transition hover:text-cyan-300"
            >
              Suporte
            </Link>
          </nav>

          {/* Ações à direita */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
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
            <Link
              href="/login"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
            >
              Entrar
            </Link>
          </div>
        </header>

        {/* HERO PRINCIPAL */}
        <div className="flex flex-1 items-start pt-6 md:pt-10 lg:pt-12">
          <section className="flex flex-col justify-between gap-8 w-full lg:flex-row">
            {/* Coluna esquerda: mensagem principal e CTAs */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Tudo do seu site{' '}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
                  em um só lugar.
                </span>
              </h1>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-[0.7rem] font-medium text-cyan-100 shadow-sm shadow-cyan-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Acesso exclusivo para clientes com site gerenciado pelo RSRDEV
              </div>
              <p className="mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
                Acesse o painel da RSRDEV para acompanhar suas mensalidades, manter sua assinatura em dia e garantir que
                o seu site fique sempre disponível para os seus clientes.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition hover:brightness-110"
                >
                  <span className="absolute inset-0 -z-10 translate-x-[-120%] bg-gradient-to-r from-white/30 to-transparent opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  Sou cliente
                </Link>
                <a
                  href="https://wa.me/557591280629"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-[0.75rem] font-semibold text-emerald-200 shadow-sm shadow-black/40 transition hover:bg-emerald-500/20"
                >
                  Torne-se cliente
                </a>
              </div>

              <div className="mt-6 grid gap-3 text-xs text-slate-200 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-100">Gestão simplificada</p>
                    <p className="text-[0.7rem] text-slate-400">Tudo o que você precisa em um único painel.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <div>
                    <p className="font-medium text-slate-100">Pagamentos transparentes</p>
                    <p className="text-[0.7rem] text-slate-400">Histórico e próximos vencimentos sempre visíveis.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 hidden text-[0.7rem] text-slate-500 sm:block">
                <p>RSRDEV • Plataforma pensada para facilitar a vida de quem precisa manter o site sempre no ar.</p>
              </div>
            </div>

            {/* Coluna direita: como funciona / suporte rápido */}
            <div className="mt-8 w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs shadow-lg shadow-black/40 lg:mt-0">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Como funciona</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">3 passos para seu site sempre online</p>
              </div>
              <ol className="space-y-3 text-[0.78rem] text-slate-200">
                <li className="flex gap-3">
                  <div className="mt-0.5 flex flex-col items-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[0.65rem] font-semibold text-slate-950">
                      1
                    </span>
                    <span className="mt-1 h-6 w-px bg-slate-700/60" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-50">Contratação do plano</p>
                    <p className="text-[0.7rem] text-slate-400">Definimos o melhor plano de hospedagem e manutenção para o seu projeto.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 flex flex-col items-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[0.65rem] font-semibold text-slate-950">
                      2
                    </span>
                    <span className="mt-1 h-6 w-px bg-slate-700/60" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-50">Acesso ao painel</p>
                    <p className="text-[0.7rem] text-slate-400">Você recebe acesso ao painel para acompanhar vencimentos e status.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 flex flex-col items-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[0.65rem] font-semibold text-slate-950">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-50">Site sempre disponível</p>
                    <p className="text-[0.7rem] text-slate-400">Com os pagamentos em dia, sua estrutura permanece estável e monitorada.</p>
                  </div>
                </li>
              </ol>

              <div className="mt-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[0.75rem] text-slate-200">
                <p className="font-medium text-slate-50">Precisa de ajuda agora?</p>
                <p className="mt-1 text-[0.7rem] text-slate-400">
                  Fale diretamente com a RSRDEV pelo WhatsApp para suporte rápido sobre sua assinatura ou acesso ao painel.
                </p>
                <a
                  href="https://wa.me/557591280629"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1.5 text-[0.7rem] font-semibold text-emerald-200 hover:bg-emerald-500/30"
                >
                  <span>Chamar no WhatsApp</span>
                </a>
              </div>
            </div>
          </section>
        </div>
        {/* Rodapé simples */}
        <footer className="mt-10 border-t border-white/10 pt-4 text-[0.7rem] text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RSRDEV • Gestão de sites e assinaturas.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/como-funciona" className="hover:text-cyan-300">
              Como funciona
            </Link>
            <Link href="/suporte" className="hover:text-cyan-300">
              Suporte
            </Link>
            <a
              href="https://wa.me/557591280629"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300"
            >
              Falar no WhatsApp
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
