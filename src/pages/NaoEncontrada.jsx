import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

function NaoEncontrada() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-bold uppercase tracking-wide text-emerald-800">Erro 404</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Página não encontrada</h1>
          <p className="mt-4 text-base text-slate-700">O endereço pode estar incorreto ou a página pode não existir.</p>
          <Link to="/" className="mt-6 inline-flex rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Ir para o início</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NaoEncontrada;
