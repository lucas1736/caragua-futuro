import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import EstadoCarregamento from './components/EstadoCarregamento.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import ImportarDadosVisitante from './components/ImportarDadosVisitante.jsx';
import MainLayout from './layouts/MainLayout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Planejamento = lazy(() => import('./pages/Planejamento.jsx'));
const Progresso = lazy(() => import('./pages/Progresso.jsx'));
const Cronograma = lazy(() => import('./pages/Cronograma.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Perfil = lazy(() => import('./pages/Perfil.jsx'));
const Assistente = lazy(() => import('./pages/Assistente.jsx'));
const MeusPlanos = lazy(() => import('./pages/MeusPlanos.jsx'));
const Metas = lazy(() => import('./pages/Metas.jsx'));
const Simulados = lazy(() => import('./pages/Simulados.jsx'));
const RealizarSimulado = lazy(() => import('./pages/RealizarSimulado.jsx'));
const Termos = lazy(() => import('./pages/Termos.jsx'));
const Privacidade = lazy(() => import('./pages/Privacidade.jsx'));
const Suporte = lazy(() => import('./pages/Suporte.jsx'));
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada.jsx'));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ImportarDadosVisitante />
        <Suspense fallback={<EstadoCarregamento mensagem="Carregando página..." />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/planejamento" element={<Planejamento />} />
              <Route
                path="/progresso"
                element={
                  <RotaProtegida>
                    <Progresso />
                  </RotaProtegida>
                }
              />
              <Route path="/cronograma" element={<Cronograma />} />
              <Route path="/simulados" element={<Simulados />} />
              <Route path="/simulados/:materia" element={<RealizarSimulado />} />
              <Route path="/assistente" element={<Assistente />} />
              <Route
                path="/meus-planos"
                element={
                  <RotaProtegida>
                    <MeusPlanos />
                  </RotaProtegida>
                }
              />
              <Route
                path="/metas"
                element={
                  <RotaProtegida>
                    <Metas />
                  </RotaProtegida>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
