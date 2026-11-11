function Footer() {
  return (
    <footer className="bg-[#063b29] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-7 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-lg font-extrabold">Caraguá Futuro</h2>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-3 max-w-xs">
              Ajudando estudantes de Caraguatatuba e região a transformarem
              rotinas em conquistas acadêmicas.
            </p>
          </div>

          <div className="md:col-start-2">
            <h3 className="text-xs font-bold">Plataforma</h3>
            <div className="flex flex-col gap-2 mt-3">
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/">Início</a>
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/planejamento">Planejamento</a>
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/progresso">Progresso</a>
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/cronograma">Cronograma</a>
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="/assistente">Assistente IA</a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold">Contato</h3>
            <div className="flex flex-col gap-2 mt-3">
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="#">Suporte</a>
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="#">Termos de Uso</a>
              <a className="text-[9px] text-gray-400 hover:text-emerald-400" href="#">Privacidade</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#174c3b] mt-8 pt-7">
          <p className="text-[9px] text-gray-500">
            © 2026 Caraguá Futuro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
