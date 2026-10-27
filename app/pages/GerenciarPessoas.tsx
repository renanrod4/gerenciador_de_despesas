import { useEffect, useState } from 'react';
import CriarPessoa from './GerenciarPessoas/CriarPessoa';
import ExcluirPessoa from './GerenciarPessoas/ExcluirPessoa';
import CardGerenciarPessoas from './GerenciarPessoas/PessoasNaCasa';
import { fetchPessoas } from '../api/fetchPessoas';
import type { pessoasType } from '../mockData';

export default function GerenciarPessoas() {
	const [pessoas, setPessoas] = useState<pessoasType>([]);

	useEffect(() => {
		fetchPessoas(setPessoas, () => {});
	}, []);

	return (
		<>
			<CardGerenciarPessoas pessoas={pessoas} onPessoaAtualizada={() => fetchPessoas(setPessoas, () => {})}/>
			<div className="criar-excluir-pessoa">
				<CriarPessoa onPessoaCriada={() =>fetchPessoas(setPessoas, () => {})} pessoas={pessoas} />
				<ExcluirPessoa pessoas={pessoas} onPessoasExcluidas={() => {
					console.log('Pessoas excluídas com sucesso!2');
					fetchPessoas(setPessoas, () => {})}
				} />
			</div>
		</>
	);
}
