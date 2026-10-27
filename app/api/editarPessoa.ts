export async function editarPessoa(id: string, nome: string, dataNascimento: string): Promise<void> {
    const response = await fetch(`/api/pessoas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, dataNascimento }),
    });

    if (!response.ok) {
        throw new Error(`Erro ao editar pessoa: HTTP ${response.status}`);
    }
}