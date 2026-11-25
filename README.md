# Caraguá Futuro

Aplicação de estudos para o litoral norte, com frontend React/Vite e API Express/MySQL. Inclui planejamento, cronograma, metas, registros de estudo, simulados de treinamento e autenticação por conta.

## Requisitos

- Node.js 24 LTS ou superior e npm.
- MySQL 8 ou MariaDB compatível para executar a API.

## Configuração local

1. Instale as dependências: `npm ci` (ou `npm install`).
2. Copie `.env.example` para `.env` e configure o banco e um `JWT_SECRET` aleatório. Em produção, o segredo precisa ter pelo menos 32 caracteres; nunca o inclua no Git nem em variáveis `VITE_*`.
3. Inicie o MySQL.
4. Execute `npm run dev` e acesse <http://localhost:5173>.

A API inicia na porta 3001 e o Vite encaminha `/api` para ela. Na primeira inicialização, a API cria o banco e aplica as migrations de `server/migrations/`; a conta MySQL precisa ter permissões para criar o banco e as tabelas.

## Scripts

| Comando                | Descrição                                   |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Inicia API e frontend para desenvolvimento  |
| `npm run web`          | Inicia apenas o Vite                        |
| `npm run server`       | Inicia apenas a API (requer MySQL e `.env`) |
| `npm run build`        | Gera o frontend de produção em `dist/`      |
| `npm run preview`      | Pré-visualiza o build do frontend           |
| `npm run lint`         | Executa ESLint                              |
| `npm run format:check` | Verifica formatação com Prettier            |
| `npm run format`       | Formata arquivos suportados pelo Prettier   |
| `npm test`             | Executa os testes Vitest                    |

## Testes e integração contínua

Os testes cobrem utilitários de simulados e isolamento de planos entre contas. O teste de API usa pool em memória, sem precisar de MySQL ou dados pessoais. GitHub Actions executa `npm ci`, lint, verificação de formatação, testes e build em pushes e pull requests.

```bash
npm run lint
npm run format:check
npm test
npm run build
```

## Implantação

A implantação requer frontend estático, API Node.js e MySQL/MariaDB. Publique os arquivos de `dist/` e configure o host (ou proxy reverso) para encaminhar `/api` ao backend na mesma origem do site. O proxy do Vite funciona somente em desenvolvimento e não acompanha o build. Se frontend e API ficarem em origens separadas, será necessário configurar uma URL de API no frontend e `CORS_ORIGIN` no backend.

Configure no ambiente do backend, nunca no frontend:

- `NODE_ENV=production`
- `JWT_SECRET`: segredo aleatório com pelo menos 32 caracteres
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`
- `PORT`, se exigido pelo host
- `CORS_ORIGIN`: origem(s) exata(s) do frontend
- `JSON_BODY_LIMIT`, opcional (padrão `2mb`)

O servidor recusa iniciar com `JWT_SECRET` ausente, padrão ou menor que 32 caracteres em produção. A conta do banco também precisa poder aplicar migrations. Use HTTPS, mantenha backups e planeje migrations de acordo com a política de deploy. Após publicar, verifique `GET /api/health` e as telas principais; a rota de saúde não substitui monitoramento nem backup.

## Organização

- `src/pages/`: páginas da aplicação.
- `src/components/`: componentes React compartilhados e de tela.
- `src/layouts/`: layout do React Router.
- `src/service/`: integração com API e dados locais.
- `src/utils/`: regras e utilitários puros.
- `server/routes/`: rotas Express.
- `server/migrations/`: alterações versionadas do banco.
- `.github/workflows/ci.yml`: verificações automatizadas.

Planos, metas, registros de estudo e resultados de simulados de usuários autenticados são associados à conta. Dados de visitante ficam no navegador até importação explícita. Os simulados usam questões de treinamento, não cadernos oficiais. Termos de Uso e Privacidade são preliminares e devem ser revisados pelo responsável antes da publicação definitiva.
