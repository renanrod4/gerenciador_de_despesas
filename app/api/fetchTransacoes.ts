import type { Dispatch, SetStateAction } from "react";
import type { transacoesType } from "../mockData";

export async function fetchTransacoes(setTransacoes: Dispatch<SetStateAction<transacoesType>>) {
    try {
        const response = await fetch(`/api/transacoes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransacoes(data);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
    }}