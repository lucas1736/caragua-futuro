import Footer from '../components/Footer.jsx';

function Privacidade() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-7 py-10">
        <p className="inline-flex rounded-full bg-amber-100 text-amber-900 font-bold text-sm px-3 py-1">
          Rascunho — requer revisão
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">Privacidade</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-slate-700">
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
            Este aviso é um rascunho informativo sobre privacidade e não substitui
            análise jurídica. O responsável pelo serviço deve revisar e completar este
            texto, inclusive os prazos de retenção, antes da publicação.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Dados tratados</h2>
            <p className="mt-2">
              Conforme os recursos utilizados, podemos tratar nome, e-mail, telefone
              opcional, foto de perfil opcional, senha armazenada de forma protegida e
              dados de estudo informados por você, como planos, matérias, metas,
              cronogramas, horas estudadas e resultados de simulados. Algumas informações
              de uso podem permanecer no armazenamento local do navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Finalidades</h2>
            <p className="mt-2">
              Os dados são utilizados para criar e proteger sua conta, disponibilizar as
              funcionalidades solicitadas, salvar suas preferências e registros de estudo,
              manter a segurança e responder a pedidos de suporte. Não informe dados
              pessoais sensíveis nos campos destinados ao planejamento dos estudos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Compartilhamento e segurança</h2>
            <p className="mt-2">
              O acesso aos dados deve ser restrito ao necessário para operar o serviço.
              Dados poderão ser tratados por fornecedores de infraestrutura utilizados
              pelo projeto, conforme suas funções e configurações. Medidas técnicas e
              administrativas são adotadas para proteger as informações, sem que seja
              possível garantir segurança absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Seus direitos</h2>
            <p className="mt-2">
              Nos termos da legislação aplicável, especialmente da LGPD, você pode
              solicitar confirmação e acesso aos dados, correção, informação sobre o uso,
              portabilidade quando aplicável, anonimização ou eliminação nos casos
              previstos, revogação de consentimento quando essa for a base utilizada e
              revisão de decisões automatizadas, se houver. Também é possível apresentar
              pedido à ANPD, conforme as regras aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Retenção e contato</h2>
            <p className="mt-2">
              Os dados são mantidos pelo período necessário às finalidades do serviço e
              às obrigações legais aplicáveis. Para exercer seus direitos, esclarecer
              dúvidas ou solicitar a exclusão da conta, entre em contato pela página de
              suporte. O responsável deverá definir e publicar os prazos concretos de
              retenção e o canal oficial de atendimento.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Privacidade;
