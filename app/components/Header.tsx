 // Componente dos Tabs da "pasta" de gerenciamento de pessoas, transações e painel geral

import type { Dispatch, SetStateAction } from "react";
import Tab from "./Tab";

export default function Header({
	activeTabId,
	setActiveTabId,
}: {
	activeTabId: number;
	setActiveTabId: Dispatch<SetStateAction<number>>;
}) {
	return (
		<header>
			<ul>
				<Tab
					label="Painel Geral"
					id={0}
					activeTabId={activeTabId}
					onClick={() => setActiveTabId(0)}
				/>
				<Tab
					label="Gerenciar Pessoas"
					id={1}
					activeTabId={activeTabId}
					onClick={() => setActiveTabId(1)}
				/>
				<Tab
					label="Lançar Transações"
					id={2}
					activeTabId={activeTabId}
					onClick={() => setActiveTabId(2)}
				/>
			</ul>
		</header>
	);
}
