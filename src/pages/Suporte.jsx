import Footer from '../components/Footer.jsx';

const emailSuporte = import.meta.env.VITE_SUPORTE_EMAIL;

function Suporte() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-7 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Suporte</h1>
        <p className="text-base text-slate-600 mt-3">
          Precisa de ajuda com a plataforma? Entre em contato pelo canal abaixo.
        </p>
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mt-7">
          <h2 className="font-bold text-lg text-slate-900">Contato por e-mail</h2>
          {emailSuporte ? (
            <a
              href={`mailto:${emailSuporte}`}
              className="inline-block mt-3 text-emerald-800 font-semibold underline underline-offset-2"
            >
              {emailSuporte}
            </a>
          ) : (
            <p className="text-slate-600 mt-3">
              O canal de suporte ainda não foi configurado. O responsável pelo site
              deve definir a variável <code>VITE_SUPORTE_EMAIL</code> no ambiente de
              publicação.
            </p>
          )}
        </section>
        <p className="text-sm text-slate-500 mt-6">
          Os textos de Termos de Uso e Privacidade são rascunhos e precisam de revisão
          pelo responsável e por orientação jurídica antes da publicação.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default Suporte;
