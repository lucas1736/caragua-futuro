import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getUsuario, logoutUsuario, ESTADO_AUTH_EVENTO } from '../service/auth.js';

const links = [
  { nome: 'Início', to: '/' },
  { nome: 'Planejamento', to: '/planejamento' },
  { nome: 'Progresso', to: '/progresso' },
  { nome: 'Cronograma', to: '/cronograma' },
  { nome: 'Meus Planos', to: '/meus-planos' },
  { nome: 'Metas', to: '/metas' },
  { nome: 'Assistente IA', to: '/assistente' },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(() => getUsuario());
  const [menuAberto, setMenuAberto] = useState(false);

  // Relê o usuário a cada troca de página e quando o login/logout acontece
  useEffect(() => {
    setUsuario(getUsuario());
    setMenuAberto(false);
  }, [location.pathname]);

  useEffect(() => {
    const atualizar = () => setUsuario(getUsuario());
    window.addEventListener(ESTADO_AUTH_EVENTO, atualizar);
    window.addEventListener('storage', atualizar);
    return () => {
      window.removeEventListener(ESTADO_AUTH_EVENTO, atualizar);
      window.removeEventListener('storage', atualizar);
    };
  }, []);

  function sair() {
    logoutUsuario();
    setUsuario(null);
    setMenuAberto(false);
    navigate('/login');
  }

  const classeLink = ({ isActive }) =>
    isActive
      ? 'relative text-emerald-400 font-medium'
      : 'hover:text-emerald-400 transition';

  const inicial = usuario?.nome?.charAt(0).toUpperCase() || '?';

  return (
    <header className="bg-[#063b29] text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-7 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">🎓</span>
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none">Caraguá Futuro</h1>
            <p className="text-[8px] text-emerald-400 tracking-wide mt-1">
              PLATAFORMA DE ESTUDOS
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-300">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={classeLink}>
              {link.nome}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                {inicial}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-white font-semibold text-sm max-w-[140px] truncate">
                  {usuario.nome}
                </p>
                <button
                  type="button"
                  onClick={sair}
                  className="text-emerald-300 text-xs hover:underline"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block bg-emerald-500 hover:bg-emerald-400 text-[#063b29] font-bold text-[11px] px-5 py-2 rounded-md transition"
            >
              Entrar
            </Link>
          )}

          <button
            type="button"
            className="lg:hidden text-white text-2xl px-2"
            aria-label="Abrir menu de navegação"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuAberto && (
        <div className="lg:hidden px-4 sm:px-7 pb-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block py-3 border-t border-[#174c3b] transition ${
                  isActive ? 'text-emerald-400' : 'text-white hover:text-emerald-400'
                }`
              }
            >
              {link.nome}
            </NavLink>
          ))}

          {usuario ? (
            <div className="sm:hidden border-t border-[#174c3b] pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold truncate">{usuario.nome}</span>
              <button type="button" onClick={sair} className="text-emerald-300 text-sm">
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="sm:hidden block mt-3 bg-emerald-500 text-[#063b29] font-bold text-center text-xs py-3 rounded-md"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
