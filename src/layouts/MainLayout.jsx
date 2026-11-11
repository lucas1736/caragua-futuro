import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';

function MainLayout() {
  const { pathname } = useLocation();
  const semHeader = pathname === '/login';

  return (
    <>
      {!semHeader && <Header />}
      <Outlet />
    </>
  );
}

export default MainLayout;
