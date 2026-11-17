import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getUsuario, atualizarPerfil } from '../service/auth.js';

const FOTO_MAX_LARGURA = 512;

// Redimensiona a imagem escolhida antes de salvar (mantém o banco leve)
function imagemParaDataUrl(arquivo) {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader();

    leitor.onerror = () => rejeitar(new Error('Não foi possível ler a imagem.'));
    leitor.onload = () => {
      const imagem = new Image();

      imagem.onerror = () => rejeitar(new Error('Arquivo de imagem inválido.'));
      imagem.onload = () => {
        const escala = Math.min(1, FOTO_MAX_LARGURA / imagem.width);
        const largura = Math.round(imagem.width * escala);
        const altura = Math.round(imagem.height * escala);

        const tela = document.createElement('canvas');
        tela.width = largura;
        tela.height = altura;

        const contexto = tela.getContext('2d');
        contexto.drawImage(imagem, 0, 0, largura, altura);

        resolver(tela.toDataURL('image/jpeg', 0.85));
      };
      imagem.src = leitor.result;
    };

    leitor.readAsDataURL(arquivo);
  });
}

function Perfil() {
  const navigate = useNavigate();
  const usuario = getUsuario();

  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [foto, setFoto] = useState(usuario?.foto || null);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate('/login', { replace: true });
    }
  }, [usuario, navigate]);

  if (!usuario) return null;

  async function escolherFoto(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = '';
    if (!arquivo) return;

    setErro('');
    setSucesso('');

    try {
      const dataUrl = await imagemParaDataUrl(arquivo);
      setFoto(dataUrl);
    } catch (e) {
      setErro(e.message);
    }
  }

  function removerFoto() {
    setFoto(null);
  }

  async function salvar(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso('');

    if (novaSenha && novaSenha !== confirmarSenha) {
      setErro('A confirmação da nova senha não confere.');
      return;
    }

    if (novaSenha && !senhaAtual) {
      setErro('Digite sua senha atual para poder alterá-la.');
      return;
    }

    setCarregando(true);

    try {
      const { usuario: atualizado } = await atualizarPerfil({
        nome,
        email,
        telefone,
        foto,
        senhaAtual: novaSenha ? senhaAtual : undefined,
        novaSenha: novaSenha || undefined,
      });

      setFoto(atualizado.foto || null);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setSucesso(
        'Perfil atualizado com sucesso! Use seu novo e-mail e senha no próximo login.'
      );

      window.dispatchEvent(new Event(ESTADO_PERFIL_ATUALIZADO));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  const inputClasse =
    'w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-7 py-8">
        <div className="mb-8">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">
            Sua conta
          </span>

          <h1 className="text-3xl font-extrabold text-slate-800 mt-2">
            Meu perfil
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Escolha sua foto de perfil e mantenha seus dados atualizados. As
            alterações são salvas no banco de dados.
          </p>
        </div>

        <form onSubmit={salvar} className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-5">Foto de perfil</h2>

            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center shrink-0">
                {foto ? (
                  <img
                    src={foto}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-emerald-700">
                    {nome.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-4 py-2.5 rounded-lg cursor-pointer text-center transition">
                  Escolher foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={escolherFoto}
                    className="hidden"
                  />
                </label>

                {foto && (
                  <button
                    type="button"
                    onClick={removerFoto}
                    className="text-sm text-red-600 font-semibold hover:underline text-left"
                  >
                    Remover foto
                  </button>
                )}

                <p className="text-xs text-slate-400">
                  JPG ou PNG. A imagem é reduzida automaticamente.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-slate-800">Dados pessoais</h2>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="perfil-nome">
                Nome
              </label>
              <input
                id="perfil-nome"
                type="text"
                required
                maxLength={100}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClasse}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="perfil-email">
                E-mail
              </label>
              <input
                id="perfil-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasse}
              />
              <p className="text-xs text-slate-400 mt-1">
                Ao alterar, faça login com o novo e-mail na próxima vez.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="perfil-telefone">
                Telefone
              </label>
              <input
                id="perfil-telefone"
                type="tel"
                placeholder="(12) 99123-4567"
                maxLength={20}
                value={telefone || ''}
                onChange={(e) => setTelefone(e.target.value)}
                className={inputClasse}
              />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-slate-800">Alterar senha</h2>

            <p className="text-xs text-slate-500 -mt-3">
              Preencha apenas se quiser trocar de senha.
            </p>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="perfil-senha-atual">
                Senha atual
              </label>
              <input
                id="perfil-senha-atual"
                type="password"
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className={inputClasse}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="perfil-nova-senha">
                  Nova senha
                </label>
                <input
                  id="perfil-nova-senha"
                  type="password"
                  autoComplete="new-password"
                  minLength={novaSenha ? 6 : undefined}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={inputClasse}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="perfil-confirmar">
                  Confirmar nova senha
                </label>
                <input
                  id="perfil-confirmar"
                  type="password"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={inputClasse}
                />
              </div>
            </div>
          </section>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#063b29] hover:bg-emerald-800 disabled:opacity-60 text-white font-bold py-4 rounded-lg transition"
          >
            {carregando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export const ESTADO_PERFIL_ATUALIZADO = 'caragua-perfil-atualizado';

export default Perfil;
