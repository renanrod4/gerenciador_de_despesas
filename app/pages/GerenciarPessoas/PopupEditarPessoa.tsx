import { useState } from 'react';
import { createPortal } from 'react-dom';
import { editarPessoa } from '../../api/editarPessoa';
import type { pessoasType } from '../../mockData';

export default function PopupEditarPessoa({ nome, pessoas, onClose, onPessoaAtualizada }: { nome:string; pessoas: pessoasType; onClose: () => void; onPessoaAtualizada: () => void }) {
	const [novoNome, setNovoNome] = useState(nome);
	const [novaDataNascimento, setNovaDataNascimento] = useState('');
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await editarPessoa(pessoas.find(pessoa => pessoa.nome === nome)?.id||'',novoNome,novaDataNascimento);
        onPessoaAtualizada();
        onClose();
    }

	return createPortal(
		<div className="overlay">
			<div className="popup popup-editar-pessoa">
				<form className="formulario" onSubmit={handleSubmit}>
					<p>Nome:</p>
					<input
						type="text"
						name="nome"
						id="nome"
						value={novoNome}
						onChange={e => setNovoNome(e.target.value)}
					/>
					<p>Data de Nascimento:</p>
					<input
						type="date"
						name="dataNascimento"
						id="dataNascimento"
						value={novaDataNascimento}
						onChange={e => setNovaDataNascimento(e.target.value)}
					/>
					<div className="botoes">
						<button type="submit">Salvar</button>
						<button type="button" onClick={onClose} className='botao-cancelar'>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body,
	);
}
