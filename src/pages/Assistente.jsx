import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

function Assistente() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-7 py-8">
        <section className="mb-6">
          <h2 className="text-2xl font-extrabold">Assistente de estudos</h2>
          <p className="text-sm text-slate-600 mt-2">Este recurso ainda não está disponível.</p>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
          <p className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 font-bold text-sm px-3 py-1">
            Em breve
          </p>
          <h3 className="text-xl font-bold text-slate-800 mt-4">
            O assistente está em desenvolvimento
          </h3>
          <p className="text-base text-slate-600 leading-relaxed mt-3">
            Ainda não há atendimento automático nesta página. Enquanto isso, você pode criar um
            plano de estudos ou consultar as ferramentas disponíveis na plataforma.
          </p>
          <Link
            to="/planejamento"
            className="inline-flex mt-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-5 py-3 rounded-lg transition"
          >
            Montar meu plano
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Assistente;
