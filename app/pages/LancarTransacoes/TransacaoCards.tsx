import type { pessoasType, transacoesType } from '../../mockData';
import TransacaoCard from './TransacaoCard';

export default function TransacaoCards({
	transacoes,
	pessoas,
	sortBy,
	onDeleteTransacao,
}: {
	transacoes: transacoesType;
	pessoas: pessoasType;
	sortBy?: string | null;
	onDeleteTransacao: () => void;
}) {
	return (
		<div className="transacao-cards">
			{transacoes
				.sort((a, b) => {
					if (sortBy === 'Data') {
						return new Date(b.data).getTime() - new Date(a.data).getTime();
					} else if (sortBy === 'Nome') {
						const nomeA = pessoas.find(pessoa => pessoa.id === a.pessoaId)?.nome || '';
						const nomeB = pessoas.find(pessoa => pessoa.id === b.pessoaId)?.nome || '';
						return nomeA.localeCompare(nomeB);
					} else if (sortBy === 'Descrição') {
						const descricaoA = a.descricao.toLowerCase();
						const descricaoB = b.descricao.toLowerCase();
						return descricaoA.localeCompare(descricaoB);
					} else if (sortBy === 'Valor') {
						return b.valor - a.valor;
					}
					// padrão por data
					return new Date(b.data).getTime() - new Date(a.data).getTime();
				})
				.map(transacao => (
					<TransacaoCard
						key={transacao.id}
						id={transacao.id}
						nome={pessoas.find(pessoa => pessoa.id === transacao.pessoaId)?.nome || 'Pessoa não encontrada'}
						valor={transacao.valor}
						data={transacao.data}
						tipo={transacao.tipo as 'despesa' | 'receita'}
						descricao={transacao.descricao}
						onDelete={onDeleteTransacao}
					/>
				))}
		</div>
	);
}
