import { useEffect, useState } from 'react';
import SelectMenu from '../components/SelectMenu';
import { type transacoesType, type pessoasType } from '../mockData';
import { fetchTransacoes } from '../api/fetchTransacoes';
import { fetchPessoas } from '../api/fetchPessoas';

function calcularTotal(transacoes: { tipo: string; valor: number }[], tipo: string): number {
	return transacoes.filter(transacao => transacao.tipo === tipo).reduce((acc, transacao) => acc + transacao.valor, 0);
}
function formatarValor(valor: number): string {
	return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export default function PainelGeral() {
	const [isOpenMenu, setIsOpenMenu] = useState<null | number>(null);
	const [selectedOptionOrganizar, setSelectedOptionOrganizar] = useState<string | null>(null);
	const [selectedOptionPeriodo, setSelectedOptionPeriodo] = useState<string | null>(null);
	const [transacoes, setTransacoes] = useState<transacoesType>([]);
	const [pessoas, setPessoas] = useState<pessoasType>([]);

	useEffect(() => {
		fetchTransacoes(setTransacoes);
		fetchPessoas(setPessoas, () => {});
	}, []);


	const transacoesFiltradas = transacoes.filter(t => {
		if (selectedOptionPeriodo === 'Mês') {
			const dataLimite = new Date();
			dataLimite.setMonth(dataLimite.getMonth() - 1);
			return new Date(t.data) >= dataLimite;
		}

		if (selectedOptionPeriodo === 'Semestre') {
			const dataLimite = new Date();
			dataLimite.setMonth(dataLimite.getMonth() - 6);
			return new Date(t.data) >= dataLimite;
		}

		if (selectedOptionPeriodo === 'Ano') {
			const dataLimite = new Date();
			dataLimite.setFullYear(dataLimite.getFullYear() - 1);
			return new Date(t.data) >= dataLimite;
		}
    if (selectedOptionPeriodo === "Todo o Histórico") {
        return true;
    }

		return true;
	});
	const receita = calcularTotal(transacoesFiltradas, 'receita');
	const despesa = calcularTotal(transacoesFiltradas, 'despesa');
	const saldo = receita - despesa;

	return (
		<div className="painel-geral">
			<div className="controls">
				<SelectMenu
					text="Ordenar"
					options={['Nome', 'Total Receitas', 'Total Despesas', 'Saldo']}
					isOpen={isOpenMenu === 1}
					onToggle={() => setIsOpenMenu(isOpenMenu === 1 ? null : 1)}
					setValue={setSelectedOptionOrganizar}
					value={selectedOptionOrganizar}
				/>
				<SelectMenu
					text="Período"
					options={['Mês', 'Semestre', 'Ano', 'Todo o Histórico']}
					isOpen={isOpenMenu === 2}
					onToggle={() => setIsOpenMenu(isOpenMenu === 2 ? null : 2)}
					setValue={setSelectedOptionPeriodo}
					value={selectedOptionPeriodo}
				/>
			</div>
			<div className="informacoes-totais">
				<div className="info-cards total-receitas">
					<p className="info-cards-title">Total Receitas</p>
					<div className="info-cards-value">{formatarValor(receita)}</div>
				</div>
				<div className="info-cards total-despesas">
					<p className="info-cards-title">Total Despesas</p>
					<div className="info-cards-value">{formatarValor(despesa)}</div>
				</div>
				<div className="info-cards saldo-liquido-geral">
					<p className="info-cards-title">Saldo Líquido Geral</p>
					<div className="info-cards-value">{formatarValor(saldo)}</div>
				</div>
			</div>
			<div className="informacoes-individuais">
				<div className="header">
					<p>Nome</p>
					<p>Total Receitas</p>
					<p>Total Despesas</p>
					<p>Saldo</p>
				</div>
				<div className="informacoes-individuais-cards">
					{pessoas
						.sort((a, b) => {
							// Usar as transações filtradas para calcular os totais de receitas e despesas
							const transacoesA = transacoesFiltradas.filter(t => t.pessoaId === a.id);
							const transacoesB = transacoesFiltradas.filter(t => t.pessoaId === b.id);

							const totalReceitasA = calcularTotal(transacoesA, 'receita');
							const totalReceitasB = calcularTotal(transacoesB, 'receita');
							const totalDespesasA = calcularTotal(transacoesA, 'despesa');
							const totalDespesasB = calcularTotal(transacoesB, 'despesa');
							const saldoA = totalReceitasA - totalDespesasA;
							const saldoB = totalReceitasB - totalDespesasB;

							switch (selectedOptionOrganizar) {
								case 'Nome':
									return a.nome.localeCompare(b.nome);
								case 'Total Receitas':
									return totalReceitasB - totalReceitasA;
								case 'Total Despesas':
									return totalDespesasB - totalDespesasA;
								case 'Saldo':
									return saldoB - saldoA;
								default:
									return a.nome.localeCompare(b.nome); // Ordenação padrão por nome
							}
						})
						.map(pessoa => {
							const totalReceitasPessoa = calcularTotal(
								transacoesFiltradas.filter(t => t.pessoaId === pessoa.id),
								'receita',
							);
							const totalDespesasPessoa = calcularTotal(
								transacoesFiltradas.filter(t => t.pessoaId === pessoa.id),
								'despesa',
							);
							const saldoPessoa = totalReceitasPessoa - totalDespesasPessoa;
              const idade = new Date().getFullYear() - new Date(pessoa.dataNascimento).getFullYear();
							return (
								<div key={pessoa.id} className="informacoes-individuais-card">
									<p className="nome">{pessoa.nome}</p>
									<p className="total-receitas">
										{idade < 18 ? '- - -' : formatarValor(totalReceitasPessoa)}
									</p>
									<p className="total-despesas">{formatarValor(totalDespesasPessoa)}</p>
									<p
										className={`saldo ${saldoPessoa < 0 ? 'negativo' : 'positivo'}`}
									>
										{formatarValor(Math.abs(saldoPessoa))}
									</p>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}
