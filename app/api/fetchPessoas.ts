import type { Dispatch, SetStateAction } from "react";
import type { pessoasType } from "../mockData";

export async function fetchPessoas(setPessoas: Dispatch<SetStateAction<pessoasType>>, setSelectedPessoa: Dispatch<SetStateAction<pessoasType[number] | null>>) {
	const response = await fetch(`/api/pessoas`);
	if (!response.ok) {
		throw new Error(`Erro ao buscar pessoas: HTTP ${response.status}`);
	}

	const data: pessoasType = await response.json();
	setPessoas(data);
	if (data.length > 0) {
		setSelectedPessoa(data[0]);
	}
}
