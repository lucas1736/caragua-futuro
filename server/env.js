import dotenv from 'dotenv';

import path from 'node:path';

import { fileURLToPath } from 'node:url';

// Carrega o .env da raiz do projeto, mesmo se o comando for rodado de outra pasta.

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const resultado = dotenv.config({ path: path.join(raiz, '.env') });

if (resultado.error) {
  console.warn(`Aviso: não consegui ler o arquivo ${path.join(raiz, '.env')}`);

  console.warn('Crie o .env na raiz do projeto (veja o .env.example).');
}
