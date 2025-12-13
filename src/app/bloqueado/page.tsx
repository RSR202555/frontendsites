export default function BlockedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">Site temporariamente bloqueado</h1>
        <p className="text-slate-200">
          A assinatura deste site está suspensa por falta de pagamento.
          Regularize o pagamento para reativar o acesso.
        </p>
        <a
          href="/cliente/pagamentos"
          className="inline-block px-6 py-3 rounded-md bg-emerald-500 hover:bg-emerald-600 font-semibold"
        >
          Pagar agora
        </a>
      </div>
    </main>
  );
}
