import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario, cadastrarUsuario } from '../service/auth.js';
import Footer from '../components/Footer.jsx';

function Login() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    const formData = new FormData(event.currentTarget);
    const nome = formData.get('nome');
    const email = formData.get('email');
    const senha = formData.get('senha');

    try {
      if (modoCadastro) {
        await cadastrarUsuario(nome, email, senha);
      } else {
        await loginUsuario(email, senha);
      }
      navigate('/', { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  function alternarModo() {
    setModoCadastro((atual) => !atual);
    setErro('');
  }

  const inputClasse =
    'w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-emerald-600 text-center mb-2">
            Caraguá Futuro
          </h1>

          <p className="text-slate-500 text-center mb-8">
            {modoCadastro
              ? 'Crie sua conta para começar seus estudos.'
              : 'Entre na sua conta para continuar seus estudos.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {modoCadastro && (
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  name="nome"
                  type="text"
                  required
                  placeholder="Digite seu nome"
                  className={inputClasse}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">E-mail</label>
              <input
                name="email"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                className={inputClasse}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                name="senha"
                type="password"
                required
                minLength={modoCadastro ? 6 : undefined}
                placeholder={modoCadastro ? 'Mínimo de 6 caracteres' : 'Digite sua senha'}
                className={inputClasse}
              />
            </div>

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
            >
              {carregando ? 'Aguarde...' : modoCadastro ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {modoCadastro ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
            <button
              type="button"
              onClick={alternarModo}
              className="text-emerald-600 font-semibold"
            >
              {modoCadastro ? 'Entrar' : 'Criar conta'}
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
