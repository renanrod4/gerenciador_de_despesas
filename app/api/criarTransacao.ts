export async function criarTransacao(pessoaId: string, valor: number, data: string, tipo: 'receita' | 'despesa', descricao: string) {
    const response = await fetch(`/api/transacoes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pessoaId, valor, data, tipo, descricao }),
    });

    if (!response.ok) {
        throw new Error(`Erro ao adicionar transação: HTTP ${response.status}`);
    }
}