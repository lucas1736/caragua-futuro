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

## Como trabalhar neste projeto (passo a passo)

### 1. O que instalar antes

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) (versão LTS)
- [VS Code](https://code.visualstudio.com/)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (precisa estar instalado e rodando)

### 2. Baixar o projeto

Abra o terminal do VS Code (Terminal → New Terminal), vá até a pasta onde quer guardar o projeto e rode:

```
git clone https://github.com/lucas1736/caragua-futuro.git
cd caragua-futuro
code .
npm install
```

### 3. Configurar o ambiente (.env)

1. Na raiz do projeto, crie um arquivo chamado `.env`.
2. Cole o modelo abaixo e preencha com os seus dados:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=caragua_futuro

PORT=3001
JWT_SECRET=coloque-uma-frase-longa-e-aleatoria-aqui
```

3. **Nunca envie o `.env` para o GitHub.** Ele já está no `.gitignore`.

### 4. Banco de dados

Basta ter o MySQL rodando. O servidor cria o banco `caragua_futuro` e as tabelas automaticamente na primeira execução. Só garanta que o usuário e a senha no `.env` estão corretos.

### 5. Rodar o projeto

Um único comando sobe o servidor (API) e o site juntos:

```
npm run dev
```

Se precisar rodar separado: `npm run server` (API) e `npm run web` (site).

### 6. Fluxo de trabalho (sempre em branch)

**Nunca trabalhe direto na `main`.**

```
git checkout main
git pull
git checkout -b nome-da-tarefa
```

Faça suas alterações e depois:

```
git add .
git commit -m "Descreva o que você fez"
git push -u origin nome-da-tarefa
```

### 7. Abrir um Pull Request

1. No GitHub, abra o repositório e clique em **Compare & pull request**.
2. Descreva rapidamente o que foi feito.
3. Aguarde a revisão. O responsável clica em **Merge** quando estiver tudo certo.

Depois do merge, volte para a `main` e atualize:

```
git checkout main
git pull
```

### 8. Regras do grupo

- Combine quem faz cada página/arquivo para evitar conflitos.
- Rode `git pull` antes de começar a mexer.
- Faça commits pequenos, com mensagens claras.
- Nunca envie senhas, tokens ou arquivos `.env`.
- Em caso de conflito, avise o grupo antes de resolver.
