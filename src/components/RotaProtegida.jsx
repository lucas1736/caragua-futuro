import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../service/auth.js';

function RotaProtegida({ children }) {
  const localizacao = useLocation();
  if (!getToken()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: `${localizacao.pathname}${localizacao.search}${localizacao.hash}` }}
      />
    );
  }
  return children;
}

export default RotaProtegida;
