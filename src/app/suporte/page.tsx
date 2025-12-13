import Link from 'next/link';

export default function SuportePage() {
  return (
    <main className="min-h-screen bg-black text-slate-50">
      {/* fundo com gradientes tecnológicos inspirados na RSRDEV */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-[-8rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
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
                <p className="text-[0.65rem] text-slate-400">Central de suporte</p>
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

        {/* CONTEÚDO SUPORTE */}
        <section className="flex flex-1 flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Precisa de ajuda?</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              Esta é a central de suporte da RSRDEV. Aqui você encontra os principais canais para falar com nossa
              equipe e resolver qualquer questão relacionada ao seu site, assinatura ou pagamentos.
            </p>
            <p className="mt-2 text-[0.8rem] text-slate-400">
              Para agilizar o atendimento, tenha em mãos o endereço do seu site e, se possível, um print da tela com o
              problema.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* canais de contato */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/40 backdrop-blur-xl text-sm">
              <h2 className="text-base font-semibold text-slate-50">Canais de atendimento</h2>
              <p className="text-xs text-slate-300">
                Escolha o canal que for mais confortável para você. Nosso time geralmente responde em poucos minutos.
              </p>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-[0.7rem] text-slate-400">E-mail</p>
                  <p className="text-sm font-medium text-slate-50">
                    <a
                      href="mailto:rianrsrdev@gmail.com?subject=Suporte%20RSRDEV&body=Ol%C3%A1,%20preciso%20de%20ajuda%20com%20meu%20site."
                      className="text-slate-50 underline underline-offset-2 decoration-cyan-400/60 hover:text-cyan-300"
                    >
                      rianrsrdev@gmail.com
                    </a>
                  </p>
                  <p className="mt-1 text-[0.7rem] text-slate-400">Indicado para dúvidas gerais e solicitações formais.</p>
                </div>
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
                  <p className="text-[0.7rem] text-emerald-200">WhatsApp</p>
                  <p className="text-sm font-medium text-emerald-100">(75) 9 1280-629</p>
                  <p className="mt-1 text-[0.7rem] text-emerald-100/80">
                    Atendimento rápido para questões sobre acesso, vencimentos e bloqueios de site.
                  </p>
                  <a
                    href="https://wa.me/557591280629"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/30 px-3 py-1.5 text-[0.7rem] font-semibold text-emerald-50 hover:bg-emerald-500/40"
                  >
                    <span>Chamar no WhatsApp</span>
                  </a>
                </div>
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 py-3">
                  <p className="text-[0.7rem] text-cyan-200">Status do serviço</p>
                  <p className="mt-1 text-[0.7rem] text-slate-100">
                    Todos os sistemas operando normalmente. Caso perceba qualquer instabilidade, entre em contato.
                  </p>
                </div>
              </div>
            </div>

            {/* card lateral */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 text-xs shadow-lg shadow-black/40">
              <h2 className="text-sm font-semibold text-slate-50">Informações rápidas</h2>
              <ul className="space-y-2 text-[0.75rem] text-slate-300">
                <li>
                  <span className="font-medium text-slate-100">Horário de atendimento:</span> segunda a sexta, das
                  9h às 18h.
                </li>
                <li>
                  <span className="font-medium text-slate-100">Tempo médio de resposta:</span> até 2 horas úteis.
                </li>
                <li>
                  <span className="font-medium text-slate-100">Prioridade máxima:</span> sites fora do ar ou problemas
                  de acesso ao painel.
                </li>
              </ul>
              <div className="mt-3 border-t border-white/10 pt-3 text-[0.7rem] text-slate-400">
                <p className="font-medium text-slate-100 mb-1">Motivo do contato</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Problema de acesso ao painel</li>
                  <li>Site fora do ar ou instável</li>
                  <li>Dúvidas sobre pagamentos ou vencimentos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
