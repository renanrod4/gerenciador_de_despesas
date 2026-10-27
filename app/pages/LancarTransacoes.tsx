import { FaPlus } from 'react-icons/fa';
import TransacaoCards from './LancarTransacoes/TransacaoCards';
import TransacaoCardsHeader from './LancarTransacoes/TransacaoCardsHeader';
import { useEffect, useState } from 'react';
import PopupLancarTransacao from './LancarTransacoes/PopupLancarTransacao';
import type { pessoasType, transacoesType } from '../mockData';
import { fetchPessoas } from '../api/fetchPessoas';
import { fetchTransacoes } from '../api/fetchTransacoes';
import SelectMenu from '../components/SelectMenu';
import { FaFilter } from 'react-icons/fa';

export default function LancarTransacoes() {
	const [isLancarTransacaoOpen, setIsLancarTransacaoOpen] = useState(false);
	function handleClick() {
		setIsLancarTransacaoOpen(true);
	}
	const [transacoes, setTransacoes] = useState<transacoesType>([]);
	const [pessoas, setPessoas] = useState<pessoasType>([]);
	const [isOpenMenu, setIsOpenMenu] = useState<number | null>(null);
	const [selectedOptionOrganizar, setSelectedOptionOrganizar] = useState<string | null>(null);
	const [selectedOptionPeriodo, setSelectedOptionPeriodo] = useState<string | null>(null);
	const [selectedOptionFiltrar, setSelectedOptionFiltrar] = useState<string | null>(null);
	const [selectedOptionFiltrarTipo, setSelectedOptionFiltrarTipo] = useState<string | null>(null);
	const [selectedOptionFiltrarNome, setSelectedOptionFiltrarNome] = useState<string | null>(null);

	// Função para filtrar as transações com base nas opções selecionadas: Periodo, Tipo e Nome
	const transacoesFiltradas = transacoes
		.filter(t => {
			// console.log('selectedOptionFiltrarTipo', selectedOptionFiltrarTipo);
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
			if (selectedOptionPeriodo === 'Todo o Histórico') {
				return true;
			}
			return true;
		})
		.filter(t => {
			if (selectedOptionFiltrarTipo) {
				return t.tipo === selectedOptionFiltrarTipo.toLowerCase();
			}
			return true;
		})
		.filter(t => {
			if (selectedOptionFiltrarNome) {
				const pessoa = pessoas.find(p => p.id === t.pessoaId);
				if (pessoa) {
					const nomeCompleto = pessoa.nome.toLowerCase().split(' ').slice(0, 2).join(' ');
					const nomeFiltrado = selectedOptionFiltrarNome.toLowerCase();
					return nomeCompleto === nomeFiltrado;
				}
			}
			return true;
		});

	useEffect(() => {
		fetchPessoas(setPessoas, () => {});
		fetchTransacoes(setTransacoes);
	}, []);
	if (pessoas.length === 0) {
		return <div className="lancar-transacoes-cards"></div>;
	}
	return (
		<>
			<div className="lancar-transacoes-cards">
				<div className="header">
					<h2>Histórico de transações</h2>
					<div className="botoes">
						<SelectMenu
							text="Ordenar"
							options={['Data', 'Nome', 'Descrição', 'Valor']}
							isOpen={isOpenMenu === 1}
							onToggle={() => setIsOpenMenu(isOpenMenu === 1 ? null : 1)}
							setValue={setSelectedOptionOrganizar}
							value={selectedOptionOrganizar}
							classname="transacao"
						/>
						<SelectMenu
							text="Período"
							options={['Mês', 'Semestre', 'Ano', 'Todo o Histórico']}
							isOpen={isOpenMenu === 2}
							onToggle={() => setIsOpenMenu(isOpenMenu === 2 ? null : 2)}
							setValue={setSelectedOptionPeriodo}
							value={selectedOptionPeriodo}
							classname="transacao"
						/>
						<SelectMenu
							text="Filtrar"
							options={['Tipo', 'Nome']}
							isOpen={isOpenMenu === 3}
							onToggle={() => setIsOpenMenu(isOpenMenu === 3 ? null : 3)}
							setValue={setSelectedOptionFiltrar}
							value={selectedOptionFiltrar}
							classname="transacao"
							customIcon={FaFilter}
						/>
						{selectedOptionFiltrar ? (
							<SelectMenu
								text={selectedOptionFiltrar}
								options={
									selectedOptionFiltrar === 'Tipo'
										? ['Receita', 'Despesa']
										: pessoas.map(pessoa => pessoa.nome.split(' ').slice(0, 2).join(' '))
								}
								isOpen={isOpenMenu === 4}
								onToggle={() => setIsOpenMenu(isOpenMenu === 4 ? null : 4)}
								setValue={
									selectedOptionFiltrar === 'Tipo'
										? setSelectedOptionFiltrarTipo
										: setSelectedOptionFiltrarNome
								}
								value={
									selectedOptionFiltrar === 'Tipo'
										? selectedOptionFiltrarTipo
										: selectedOptionFiltrarNome
								}
								classname="transacao"
							></SelectMenu>
						) : (
							<></>
						)}
						<button className="lancar-transacao" onClick={handleClick}>
							<FaPlus />
							<p>Lançar transação</p>
						</button>
					</div>
				</div>
				<TransacaoCardsHeader />
				<TransacaoCards transacoes={transacoesFiltradas} pessoas={pessoas} sortBy={selectedOptionOrganizar} onDeleteTransacao={() => fetchTransacoes(setTransacoes)} />
			</div>
			{isLancarTransacaoOpen && (
				<PopupLancarTransacao
					setIsLancarTransacaoOpen={setIsLancarTransacaoOpen}
					pessoas={pessoas}
					onCriarTransacao={() => fetchTransacoes(setTransacoes)}
				/>
			)}
		</>
	);
}
