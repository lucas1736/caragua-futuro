import Footer from '../components/Footer.jsx';

function Termos() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-7 py-10">
        <p className="inline-flex rounded-full bg-amber-100 text-amber-900 font-bold text-sm px-3 py-1">
          Rascunho — requer revisão
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">Termos de uso</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-slate-700">
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
            Este texto é um rascunho informativo e não substitui orientação jurídica.
            Deve ser revisado e aprovado pelo responsável pelo serviço antes da publicação.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Sobre a plataforma</h2>
            <p className="mt-2">
              O Caraguá Futuro oferece ferramentas de organização de estudos, planos,
              metas, cronogramas, registros de progresso e simulados de treino. O uso
              dessas ferramentas não garante aprovação ou qualquer resultado específico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Conta e informações</h2>
            <p className="mt-2">
              Ao criar uma conta, mantenha seus dados corretos e proteja suas credenciais.
              Você é responsável pelas atividades realizadas por meio da sua conta e deve
              comunicar ao suporte qualquer uso que considere não autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Uso adequado</h2>
            <p className="mt-2">
              Use a plataforma de forma lícita e respeitosa. Não tente comprometer seu
              funcionamento, acessar contas ou dados de outras pessoas, nem enviar conteúdo
              ilegal ou que viole direitos de terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Conteúdo de estudo</h2>
            <p className="mt-2">
              Os simulados disponibilizados são materiais de treino e não devem ser
              interpretados como provas oficiais, salvo indicação expressa de fonte e
              autorização. Confira editais e materiais oficiais junto às instituições
              responsáveis pelos processos seletivos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Disponibilidade e contato</h2>
            <p className="mt-2">
              Recursos podem ser atualizados ou ficar temporariamente indisponíveis para
              manutenção. Para dúvidas sobre estes termos, acesse a página de suporte.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Termos;
