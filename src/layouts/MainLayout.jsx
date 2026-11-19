import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';

function MainLayout() {
  const { pathname } = useLocation();
  const semHeader = pathname === '/login';
  const titulos = {
    '/': 'Início',
    '/planejamento': 'Planejamento',
    '/progresso': 'Progresso',
    '/cronograma': 'Cronograma',
    '/simulados': 'Simulados',
    '/assistente': 'Assistente',
    '/meus-planos': 'Meus Planos',
    '/metas': 'Metas',
    '/login': 'Entrar ou criar conta',
    '/perfil': 'Meu Perfil',
    '/termos': 'Termos de Uso',
    '/privacidade': 'Privacidade',
    '/suporte': 'Suporte',
  };
  const tituloPagina = pathname.startsWith('/simulados/') ? 'Realizar Simulado' : titulos[pathname] || 'Página não encontrada';

  useEffect(() => {
    document.title = `${tituloPagina} | Caraguá Futuro`;
  }, [tituloPagina]);

  return (
    <>
      {!semHeader && <Header />}
      <Outlet />
    </>
  );
}

export default MainLayout;
