export async function criarPessoa(nome: string, dataNascimento: string) {
	const response = await fetch(`/api/pessoas`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			nome,
			dataNascimento,
		}),
	});

	if (!response.ok) {
		throw new Error(`Erro ao adicionar pessoa: HTTP ${response.status}`);
	}
}
