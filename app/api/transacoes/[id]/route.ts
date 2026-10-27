import database from "../../../../lib/db";

type TransacaoInput = {
  descricao?: string;
  valor?: number;
  data?: string;
  tipo?: string;
  pessoaId?: string;
};

export async function PUT(
  request: Request,
  context: RouteContext<"/api/transacoes/[id]">,
) {
  const { id } = await context.params;
  const input = (await request.json()) as TransacaoInput;

  if (
    !input.descricao?.trim() ||
    typeof input.valor !== "number" ||
    !input.data ||
    !["receita", "despesa"].includes(input.tipo ?? "") ||
    !input.pessoaId
  ) {
    return Response.json({ error: "Dados da transação inválidos." }, { status: 400 });
  }

  const result = database
    .prepare(
      `UPDATE transacoes
       SET descricao = @descricao, valor = @valor, data = @data,
           tipo = @tipo, pessoa_id = @pessoaId
       WHERE id = @id`,
    )
    .run({
      id,
      descricao: input.descricao.trim(),
      valor: input.valor,
      data: input.data,
      tipo: input.tipo,
      pessoaId: input.pessoaId,
    });

  if (result.changes === 0) {
    return Response.json({ error: "Transação não encontrada." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/transacoes/[id]">,
) {
  const { id } = await context.params;
  const result = database.prepare("DELETE FROM transacoes WHERE id = ?").run(id);

  if (result.changes === 0) {
    return Response.json({ error: "Transação não encontrada." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
