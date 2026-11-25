import { Link } from 'react-router-dom';

const linkClasse = 'text-xs text-gray-300 hover:text-emerald-300 py-1';

function Footer() {
  return (
    <footer className="bg-[#063b29] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-7 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-lg font-extrabold">Caraguá Futuro</h2>
            <p className="text-xs text-gray-300 leading-relaxed mt-3 max-w-xs">
              Ajudando estudantes de Caraguatatuba e região a transformarem rotinas em conquistas
              acadêmicas.
            </p>
          </div>

          <div className="md:col-start-2">
            <h3 className="text-sm font-bold">Plataforma</h3>
            <div className="flex flex-col items-start gap-2 mt-3">
              <Link className={linkClasse} to="/">
                Início
              </Link>
              <Link className={linkClasse} to="/planejamento">
                Planejamento
              </Link>
              <Link className={linkClasse} to="/progresso">
                Progresso
              </Link>
              <Link className={linkClasse} to="/cronograma">
                Cronograma
              </Link>
              <Link className={linkClasse} to="/assistente">
                Assistente (em breve)
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Contato</h3>
            <div className="flex flex-col items-start gap-2 mt-3">
              <Link className={linkClasse} to="/suporte">
                Suporte
              </Link>
              <Link className={linkClasse} to="/termos">
                Termos de Uso
              </Link>
              <Link className={linkClasse} to="/privacidade">
                Privacidade
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#174c3b] mt-8 pt-7">
          <p className="text-xs text-gray-300">
            © 2026 Caraguá Futuro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
