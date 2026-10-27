 "use client";

import { useState } from 'react';
import Header from './components/Header';
import PainelGeral from './pages/PainelGeral';
import GerenciarPessoas from './pages/GerenciarPessoas';
import LancarTransacoes from './pages/LancarTransacoes';

export default function App() {
	const [activeTabId, setActiveTabId] = useState<number>(0);
	return (
		<div>
			<Header activeTabId={activeTabId} setActiveTabId={setActiveTabId} />

			<main>
        {activeTabId === 0 && <PainelGeral />}
        {activeTabId === 1 && <GerenciarPessoas />}
        {activeTabId === 2 && <LancarTransacoes />}
      </main>
		</div>
	);
}