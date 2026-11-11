# Caraguá Futuro

Projeto convertido para React + Vite + Tailwind CSS, mantendo as páginas e funcionalidades existentes do protótipo.

## Como executar

1. Instale Node.js.
2. Abra esta pasta no VS Code.
3. No terminal, execute `npm install`.
4. Depois execute `npm run dev`.
5. Abra o endereço local mostrado pelo Vite.

## Organização

- `src/pages/`: páginas Início, Planejamento, Progresso e Cronograma.
- `src/layouts/`: layout principal do React Router.
- `src/legacy/`: scripts JavaScript originais que controlam os formulários, cronograma, timer e progresso.
- `src/assets/` e `public/assets/`: imagens do projeto.
- `src/App.jsx`: rotas e importações das páginas.
- `src/main.jsx`: ponto de entrada do React.

Os scripts legados são carregados depois que cada página é montada para que os elementos HTML já existam. `node_modules` não está incluído; ele será criado ao executar `npm install`.

## Como rodar (rápido)

1. Ligue o MySQL.
2. Abra o arquivo `.env` e coloque a senha do seu MySQL em `DB_PASSWORD=`.
3. `npm install` (só na primeira vez).
4. `npm run dev` — liga a API (porta 3001) e o site (porta 5173) juntos.
5. Abra http://localhost:5173/login e use **Criar conta**.

O banco `caragua_futuro` e as tabelas são criados automaticamente.

## CRUD de Planos de Estudo

Tabela `planos` (veja `server/schema.sql`), sempre ligada ao usuário logado.

| Operação | Rota da API | Onde usar no site |
| --- | --- | --- |
| Create | `POST /api/planos` | Planejamento → "Confirmar plano" e Meus Planos → "+ Novo plano" |
| Read | `GET /api/planos` e `GET /api/planos/:id` | Meus Planos |
| Update | `PUT /api/planos/:id` | Meus Planos → "Editar" |
| Delete | `DELETE /api/planos/:id` | Meus Planos → "Excluir" |

As tabelas são criadas automaticamente ao iniciar a API (`server/schema.sql` fica como referência).

## CRUD de Metas de Estudo (2º CRUD)

Tabela `metas` (veja `server/schema.sql`), sempre ligada ao usuário logado.
Campos: título, matéria, descrição, prioridade (Baixa/Média/Alta), prazo e se está concluída.

| Operação | Rota da API | Onde usar no site |
| --- | --- | --- |
| Create | `POST /api/metas` | Metas → "+ Nova meta" |
| Read | `GET /api/metas` e `GET /api/metas/:id` | Metas (lista, barra de progresso e filtros) |
| Update | `PUT /api/metas/:id` | Metas → "Editar" ou o checkbox de concluir |
| Delete | `DELETE /api/metas/:id` | Metas → "Excluir" |
