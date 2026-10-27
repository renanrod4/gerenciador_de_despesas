import { randomUUID } from "node:crypto";
import database from "../../../lib/db";

type PessoaInput = {
  nome?: string;
  dataNascimento?: string;
};

function isValidPessoa(input: PessoaInput): input is Required<PessoaInput> {
  return Boolean(input.nome?.trim() && input.dataNascimento);
}

export function GET() {
  const pessoas = database
    .prepare(
      `SELECT id, nome, data_nascimento AS dataNascimento
       FROM pessoas
       ORDER BY nome`,
    )
    .all();

  return Response.json(pessoas);
}

export async function POST(request: Request) {
  const input = (await request.json()) as PessoaInput;

  if (!isValidPessoa(input)) {
    return Response.json(
      { error: "Nome e data de nascimento são obrigatórios." },
      { status: 400 },
    );
  }

  const pessoa = {
    id: randomUUID(),
    nome: input.nome.trim(),
    dataNascimento: input.dataNascimento,
  };

  database
    .prepare(
      `INSERT INTO pessoas (id, nome, data_nascimento)
       VALUES (@id, @nome, @dataNascimento)`,
    )
    .run(pessoa);

  return Response.json(pessoa, { status: 201 });
}
