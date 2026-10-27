import { FaRegEdit } from "react-icons/fa";
import type { pessoasType } from "../../mockData";
import PopupEditarPessoa from "./PopupEditarPessoa";
import { useState } from "react";

export default function CardGerenciarPessoas({ pessoas, onPessoaAtualizada }: { pessoas: pessoasType; onPessoaAtualizada: () => void }) {
	return (
		<div className="gerenciar-pessoas-cards gerenciarPessoas">
			<h2>Pessoas na casa</h2>
			<ListaPessoas pessoas={pessoas} onPessoaAtualizada={onPessoaAtualizada} />
		</div>
	);
}

function ListaPessoas({ pessoas, onPessoaAtualizada  }: { pessoas: pessoasType; onPessoaAtualizada: () => void }) {
	return (
		<ul className="lista-pessoas">
			{pessoas.map(pessoa => {
				const idade = new Date().getFullYear() - new Date(pessoa.dataNascimento).getFullYear();
				return <Pessoa key={pessoa.id} nome={pessoa.nome} idade={idade} onPessoaAtualizada={onPessoaAtualizada} pessoas={pessoas} />;
			})}
		</ul>
	);
}
function Pessoa({ nome, idade, onPessoaAtualizada, pessoas}: { nome: string; idade: number; onPessoaAtualizada: () => void; pessoas: pessoasType }) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	function handleEditClick() {
		setIsPopupOpen(true);
	}
	return (
		<li className="pessoa">
			<p className="nome">{nome.split(' ').slice(0, 2).join(' ')}</p>
			<p className="idade">{idade} anos</p>
			<button className="edit" onClick={handleEditClick}>
				<FaRegEdit />
			</button>
			{isPopupOpen && <PopupEditarPessoa nome={nome} pessoas={pessoas} onClose={() => setIsPopupOpen(false)} onPessoaAtualizada={onPessoaAtualizada} />}
		</li>
	);
}