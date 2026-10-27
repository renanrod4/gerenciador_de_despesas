import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { IoCopyOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { excluirTransacao } from '../../api/excluirTransacao';
import { createPortal } from 'react-dom';

export default function TransacaoCard({
	id,
	nome,
	valor,
	data,
	tipo,
	descricao,
	onDelete,
}: {
	id: string;
	nome: string;
	valor: number;
	data: string;
	tipo: 'despesa' | 'receita';
	descricao: string;
	onDelete: () => void;
}) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [popupConfirmDeleteOpen, setPopupConfirmDeleteOpen] = useState(false);
	function handleDelete() {
		// await excluirTransacao(id);
		// onDelete();
		setPopupConfirmDeleteOpen(true);
	}
	return (
		<div className="transacao-card">
			<div className="header">
				<div className="idCard">
					{/* Não mostra o ID inteiro para não ocupar muito espaço, porém implementa opção de copiar */}
					<p className="id">ID: {id.slice(0, 8) + '...'}</p>
					<button className="copyButton" onClick={() => navigator.clipboard.writeText(id)}>
						<IoCopyOutline />
					</button>
				</div>
				{/* Mostra apenas os 2 primeiros nomes do usuário, caso ele tenha mais de 2 nomes */}
				<p className="nome">{nome.split(' ').slice(0, 2).join(' ')}</p>

				{/* transformar data no formato pt-br */}
				<p className="data">{new Date(data).toLocaleDateString('pt-BR')}</p>
				<p className="hora">
					{new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
				</p>

				{/* a cor do `valor` vai mudar de acordo com o tipo(despesa ou receita) */}
				{/* muda o valor para o formato usado no Brasil, com vírgula como separador decimal e ponto como separador de milhar */}
				<p className={`valor ${tipo}`}>
					{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
				</p>
				<div className="botoes">
					<button className="lixeira-btn" onClick={handleDelete}>
						<RiDeleteBin6Line />
					</button>
					<button
						className={`descricao-btn ` + (isDropdownOpen ? 'open' : '')}
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<FaAngleDown />
					</button>
					{/* dropdown que abre e fecha a descrição da transação */}
				</div>
			</div>
			<div className={'descricao-container ' + (isDropdownOpen ? 'open' : '')}>
				<p className="descricao">{descricao}</p>
			</div>
			{/* popup de confirmação de exclusão */}
			{popupConfirmDeleteOpen && <PopupConfirmDelete onClose={() => setPopupConfirmDeleteOpen(false)} onDelete={onDelete} id={id} />}
		</div>
	);
}

function PopupConfirmDelete({
	onClose,
	onDelete,
	id,
}: {
	onClose: () => void;
	onDelete: () => void;
	id: string;
}) {
	async function handleDelete() {
		await excluirTransacao(id);
		onDelete();
		onClose();
	}
	return createPortal(
		<div className="overlay">
			<div className="popup popup-confirm-delete">
				<h2>Confirmar exclusão</h2>
				<>Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.</>
				<div className="botoes">
					<button className="botao-cancelar" onClick={onClose}>
						Cancelar
					</button>
					<button className="botao-excluir" onClick={handleDelete}>
						Excluir
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}
