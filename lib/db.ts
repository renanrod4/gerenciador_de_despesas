import Database from "better-sqlite3";
import path from "node:path";

const database = new Database(path.join(process.cwd(), "data", "app.db"));

database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS pessoas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    data_nascimento TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transacoes (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    data TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    pessoa_id TEXT NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE
  );
`);

export default database;
