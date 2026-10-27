import { randomUUID } from "node:crypto";
import database from "../../../lib/db";

type TransacaoInput = {
  descricao?: string;
  valor?: number;
  data?: string;
  tipo?: string;
  pessoaId?: string;
};

function isValidTransacao(
  input: TransacaoInput,
): input is Required<TransacaoInput> {
  return Boolean(
    input.descricao?.trim() &&
      typeof input.valor === "number" &&
      Number.isFinite(input.valor) &&
      input.valor >= 0 &&
      input.data &&
      (input.tipo === "receita" || input.tipo === "despesa") &&
      input.pessoaId,
  );
}

export function GET() {
  const transacoes = database
    .prepare(
      `SELECT id, descricao, valor, data, tipo, pessoa_id AS pessoaId
       FROM transacoes
       ORDER BY data DESC`,
    )
    .all();

  return Response.json(transacoes);
}

export async function POST(request: Request) {
  const input = (await request.json()) as TransacaoInput;

  if (!isValidTransacao(input)) {
    return Response.json({ error: "Dados da transação inválidos." }, { status: 400 });
  }

  const pessoa = database
    .prepare("SELECT id, data_nascimento AS dataNascimento FROM pessoas WHERE id = ?")
    .get(input.pessoaId) as { id: string; dataNascimento: string } | undefined;

  if (!pessoa) {
    return Response.json({ error: "Pessoa não encontrada." }, { status: 404 });
  }

  const transacao = {
    id: randomUUID(),
    descricao: input.descricao.trim(),
    valor: input.valor,
    data: input.data,
    tipo:
      input.tipo === "receita" && calcularIdade(pessoa.dataNascimento) < 18
        ? "despesa"
        : input.tipo,
    pessoaId: input.pessoaId,
  };

  database
    .prepare(
      `INSERT INTO transacoes (id, descricao, valor, data, tipo, pessoa_id)
       VALUES (@id, @descricao, @valor, @data, @tipo, @pessoaId)`,
    )
    .run(transacao);

  return Response.json(transacao, { status: 201 });
}

function calcularIdade(dataNascimento: string) {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aniversarioAindaNaoOcorreu =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate());

  if (aniversarioAindaNaoOcorreu) idade -= 1;
  return idade;
}
