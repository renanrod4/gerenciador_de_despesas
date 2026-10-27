import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import type { pessoasType } from '../../mockData';
import { excluirPessoa } from '../../api/excluirPessoa';

export default function ExcluirPessoa({
	pessoas,
	onPessoasExcluidas,
}: {
	pessoas: pessoasType;
	onPessoasExcluidas: () => void;
}) {
	const [showPopUp, setShowPopUp] = useState(false);
	const [selectedPessoa, setSelectedPessoa] = useState<pessoasType[number] | null>(null);
	useEffect(() => {
		function setInitialSelectedPessoa() {
			if (pessoas.length > 0) {
				setSelectedPessoa(pessoas[0]);
			} else {
				setSelectedPessoa(null);
			}
		}
		setInitialSelectedPessoa();
	}, [pessoas]);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setShowPopUp(true);
	}

	function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const pessoa = pessoas.find(pessoa => pessoa.nome === event.currentTarget.value) || null;
		setSelectedPessoa(pessoa);
	}
	return (
		<>
			<div className="gerenciar-pessoas-cards excluirPessoa">
				<h2>Excluir pessoa</h2>
				<form className="formulario" onSubmit={handleSubmit}>
					<p>nome:</p>
					{/* input de escolha com nomes */}
					<select name="nome" id="nome" onChange={handleSelectChange} value={selectedPessoa?.nome || ''}>
						{pessoas.map(pessoa => (
							<option className="option" key={pessoa.id} value={pessoa.nome}>
								{pessoa.nome}
							</option>
						))}
					</select>
					<button type="submit">
						Excluir
					</button>
				</form>
			</div>
			{showPopUp && (
				<PopUpExcluirPessoa
					setShowPopUp={setShowPopUp}
					pessoaId={selectedPessoa?.id || ''}
					onPessoasExcluidas={onPessoasExcluidas}
					setSelectedPessoa={setSelectedPessoa}
				/>
			)}
		</>
	);
}

function PopUpExcluirPessoa({
	setShowPopUp,
	pessoaId,
	onPessoasExcluidas,
}: {
	setShowPopUp: Dispatch<SetStateAction<boolean>>;
	pessoaId: string;
	onPessoasExcluidas: () => void;
	setSelectedPessoa: Dispatch<SetStateAction<pessoasType[number] | null>>;
}) {
	const [hidePopUp, setHidePopUp] = useState(false);
	async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
		const target = event.currentTarget as HTMLButtonElement;
		event.preventDefault();

		function hide() {
			setHidePopUp(true);
			// Adiciona um atraso para permitir que a animação de desaparecimento seja concluída antes de remover o pop-up
			setTimeout(() => {
				setShowPopUp(false);
			}, 300);
		}

		if (target.className === 'botao-excluir') {
			console.log('Excluindo pessoa com ID:', pessoaId);
			await excluirPessoa(pessoaId)
			console.log('Pessoa excluída com sucesso!');
			onPessoasExcluidas();
			hide();
		}
		if (target.className === 'botao-cancelar') {
			hide();
		}
	}
	// usa `createPortal` para renderizar o popup em um lugar separado do DOM,
	// permitindo que ele seja exibido acima de outros elementos da página
	return createPortal(
		<div className={`overlay ${hidePopUp ? 'hide' : ''}`}>
			<div className={`popup popup-excluir-pessoa ${hidePopUp ? 'hide' : ''}`}>
				<h2>Tem certeza que deseja excluir essa pessoa?</h2>
				<p>Ao excluir uma pessoa, todas as transações relacionadas a ela também serão excluídas!</p>
				<div className="botoes">
					<button className="botao-cancelar" onClick={handleClick}>
						Cancelar
					</button>
					<button className="botao-excluir" onClick={handleClick}>
						Excluir
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
