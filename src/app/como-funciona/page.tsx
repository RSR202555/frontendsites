import Link from 'next/link';

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-black text-slate-50">
      {/* fundo com gradientes tecnológicos inspirados na RSRDEV */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-[-8rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* HEADER */}
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
                <p className="text-[0.65rem] text-slate-400">Como funciona a plataforma</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
            >
              Voltar para início
            </Link>
          </div>
        </header>

        {/* CONTEÚDO */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4 text-sm text-slate-200">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Como funciona</h1>
            <p>
              A plataforma de clientes da RSRDEV foi criada para facilitar o controle das suas mensalidades, do status do
              seu site e das informações de pagamento. Em poucos cliques, você acompanha tudo o que precisa para manter o
              seu projeto sempre online.
            </p>
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">1. Acesso ao painel</p>
                <p className="mt-1 text-slate-100">
                  Você recebe um usuário e senha da RSRDEV. Com eles, acessa o painel seguro onde ficam os dados da sua
                  assinatura e do seu site.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">2. Visão da assinatura</p>
                <p className="mt-1 text-slate-100">
                  No painel do cliente você vê o plano contratado, valor da mensalidade, data de vencimento e histórico de
                  pagamentos.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">3. Pagamentos</p>
                <p className="mt-1 text-slate-100">
                  Quando chegar a data de vencimento, o próprio painel mostra as opções para pagar com rapidez e
                  segurança, usando a integração da RSRDEV com os provedores de pagamento.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">4. Suporte</p>
                <p className="mt-1 text-slate-100">
                  Em caso de dúvidas sobre acesso, valores ou qualquer problema com o site, você pode falar direto com o
                  time da RSRDEV pelos canais de suporte.
                </p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 text-xs shadow-lg shadow-black/40">
            <h2 className="text-sm font-semibold text-slate-50">Próximos passos</h2>
            <ul className="space-y-2 text-[0.75rem] text-slate-300">
              <li>
                <span className="font-medium text-slate-100">1. Faça login no painel do cliente.</span> Use o botão
                "Acessar meu painel" na página inicial.
              </li>
              <li>
                <span className="font-medium text-slate-100">2. Confira seus dados.</span> Verifique se informações de
                contato e plano estão corretas.
              </li>
              <li>
                <span className="font-medium text-slate-100">3. Mantenha os pagamentos em dia.</span> Assim o seu site
                permanece sempre disponível.
              </li>
            </ul>
            <p className="mt-2 text-[0.7rem] text-slate-500">
              Qualquer dúvida sobre o funcionamento da plataforma, acesse a página de suporte ou fale direto pelo
              WhatsApp da RSRDEV.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-4 py-2 text-[0.7rem] font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition hover:brightness-110"
              >
                Acessar meu painel
              </Link>
              <Link
                href="/suporte"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.7rem] font-semibold text-slate-50 shadow-sm shadow-black/40 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
              >
                Falar com suporte
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
