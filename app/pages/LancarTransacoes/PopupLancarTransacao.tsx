import { useState, type Dispatch, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import Tooltip from '../../components/Tooltip';
import type { pessoasType } from '../../mockData';
import { criarTransacao } from '../../api/criarTransacao';

export default function PopupLancarTransacao({
	setIsLancarTransacaoOpen,
	pessoas,
	onCriarTransacao = () => {},
}: {
	setIsLancarTransacaoOpen: Dispatch<SetStateAction<boolean>>;
	pessoas: pessoasType;
	onCriarTransacao?: () => void;
}) {
	const [valor, setValor] = useState('R$ 0,00');
	const [nomeSelecionado, setNomeSelecionado] = useState(pessoas[0].nome);
	const [data, setData] = useState(new Date().toISOString().split('T')[0]);
	const [hora, setHora] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
	const [descricao, setDescricao] = useState('');
	const pessoaSelecionada = pessoas.find(pessoa => pessoa.nome === nomeSelecionado);
	const idade = pessoaSelecionada
		? new Date().getFullYear() - new Date(pessoaSelecionada.dataNascimento).getFullYear()
		: 0;
	const menorDeIdade = pessoaSelecionada ? idade < 18 : false;
	const [tipoSelecionado, setTipoSelecionado] = useState(menorDeIdade ? 'despesa' : 'receita');

	function handleClose() {
		setIsLancarTransacaoOpen(false);
	}
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const pessoa = pessoas.find(pessoa => pessoa.nome === nomeSelecionado);
		if (!pessoa) {
			alert('Pessoa não encontrada!');
			return;
		}
		await criarTransacao(pessoa.id, parseFloat(valor.replace(/\D/g, '')) / 100, `${data}T${hora}`, tipoSelecionado as 'receita' | 'despesa', descricao);
		onCriarTransacao();
		setIsLancarTransacaoOpen(false);

	}

	function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
		const inputValor = e.target.value;
		// Remove todos os caracteres que não sejam números e formata o valor como moeda brasileira
		const apenasNumeros = inputValor.replace(/\D/g, '');
		const valorFormatado = new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(Number(apenasNumeros) / 100);
		setValor(valorFormatado);
	}
	function handleNomeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const nome = e.target.value;
		setNomeSelecionado(nome);
		const pessoa = pessoas.find(pessoa => pessoa.nome === nome);
		const idade = pessoa ? new Date().getFullYear() - new Date(pessoa.dataNascimento).getFullYear() : 0;
		if (pessoa) setTipoSelecionado(tipoSelecionado => (idade < 18 ? 'despesa' : tipoSelecionado));
	}

	return createPortal(
		<div className="overlay">
			<div className="popup popup-lancar-transacao">
				<h2>Lançar transação</h2>
				<form className="formulario" onSubmit={handleSubmit}>
					<div className="form-left">
						<p>Nome:</p>
						<select name="nome" id="nome" value={nomeSelecionado} onChange={handleNomeChange}>
							{pessoas.map(pessoa => (
								<option key={pessoa.id} value={pessoa.nome}>
									{pessoa.nome}
								</option>
							))}
						</select>
						<p>Valor:</p>
						{/* input com formatação de dinheiro */}
						<input
							type="text"
							name="valor"
							id="valor"
							value={valor}
							onChange={handleValorChange}
							style={{ color: tipoSelecionado === 'despesa' ? 'red' : 'green' }}
						/>
						<p>Data:</p>
						<div className="data">
							<input
								type="date"
								name="data"
								id="data"
								value={data}
								onChange={e => setData(e.target.value)}
							/>
							<input
								type="time"
								name="hora"
								id="hora"
								value={hora}
								onChange={e => setHora(e.target.value)}
							/>
						</div>
						<p>Tipo:</p>
						<Tooltip
							content={menorDeIdade ? 'Menores de idade só podem lançar despesas' : ''}
							position="top"
						>
							<select
								name="tipo"
								id="tipo"
								disabled={menorDeIdade}
								value={tipoSelecionado}
								onChange={e => setTipoSelecionado(e.target.value)}
							>
								{!menorDeIdade ? <option value="receita">Receita</option> : null}
								<option value="despesa">Despesa</option>
							</select>
						</Tooltip>
					</div>
					<div className="descricao">
						<p>Descrição:</p>
						<textarea name="" id="" placeholder={tipoSelecionado === 'receita' ? 'Ex: Salário, Bônus, etc.' : 'Ex: Aluguel, Supermercado, etc.'}
						value={descricao} onChange={e => setDescricao(e.target.value)}>

						</textarea>
					</div>
					<div className="botoes">
						<button type="submit" className="botao-lancar">
							Lançar
						</button>
						<button type="button" className="botao-cancelar" onClick={handleClose}>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body,
	);
}
