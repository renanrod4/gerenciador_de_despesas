import database from "../../../../lib/db";

type PessoaInput = {
  nome?: string;
  dataNascimento?: string;
};

export async function PUT(
  request: Request,
  context: RouteContext<"/api/pessoas/[id]">,
) {
  const { id } = await context.params;
  const input = (await request.json()) as PessoaInput;

  if (!input.nome?.trim() || !input.dataNascimento) {
    return Response.json(
      { error: "Nome e data de nascimento são obrigatórios." },
      { status: 400 },
    );
  }

  const result = database
    .prepare(
      `UPDATE pessoas
       SET nome = @nome, data_nascimento = @dataNascimento
       WHERE id = @id`,
    )
    .run({
      id,
      nome: input.nome.trim(),
      dataNascimento: input.dataNascimento,
    });

  if (result.changes === 0) {
    return Response.json({ error: "Pessoa não encontrada." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/pessoas/[id]">,
) {
  const { id } = await context.params;
  const result = database.prepare("DELETE FROM pessoas WHERE id = ?").run(id);

  if (result.changes === 0) {
    return Response.json({ error: "Pessoa não encontrada." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
