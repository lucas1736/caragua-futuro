
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Planejamento from './pages/Planejamento.jsx';
import Progresso from './pages/Progresso.jsx';
import Cronograma from './pages/Cronograma.jsx';
import Login from './pages/Login.jsx';
import Assistente from './pages/Assistente.jsx';
import MeusPlanos from './pages/MeusPlanos.jsx';
import Metas from './pages/Metas.jsx';
import Simulados from './pages/Simulados.jsx';
import RealizarSimulado from './pages/RealizarSimulado.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/planejamento" element={<Planejamento />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/simulados" element={<Simulados />} />
          <Route path="/simulados/:materia" element={<RealizarSimulado />} />
          <Route path="/assistente" element={<Assistente />} />
          <Route path="/meus-planos" element={<MeusPlanos />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
