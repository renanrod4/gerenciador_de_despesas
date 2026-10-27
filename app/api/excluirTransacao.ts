export async function excluirTransacao(id: string) {
	try {
		const response = await fetch(`/api/transacoes/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error(`Erro ao excluir transação: HTTP ${response.status}`);
		}
	} catch (error) {
		console.error('Erro ao excluir transação:', error);
		throw error;
	}
}
