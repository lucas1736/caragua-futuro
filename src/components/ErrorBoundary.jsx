import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { erro: false };
  }

  static getDerivedStateFromError() {
    return { erro: true };
  }

  componentDidCatch(erro) {
    console.error('Erro ao renderizar a página:', erro);
  }

  render() {
    if (this.state.erro) {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-5 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Não foi possível exibir esta página</h1>
          <p className="mt-3 text-base text-slate-700">
            Ocorreu um erro inesperado. Tente voltar ao início.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ erro: false })}
            className="mt-6 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Voltar ao início
          </Link>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
