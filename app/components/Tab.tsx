// componente Tab são as abas do Header
export default function Tab({
	label,
	activeTabId,
	id,
	onClick,
}: {
	label: string;
	activeTabId: number;
	id: number;
	onClick: () => void;
}) {
	const isActive = activeTabId === id;
	return (
		<li
			className={isActive ? 'active' : ''}
			onClick={onClick}
			// criar sistema de cores por distância entre as tabs, aplicando 10% de diferença entre cada tab, 
			// também move a tab para baixo de acordo com a distância entre as tabs, aplicando 2.5px de diferença entre cada tab
			style={{
				backgroundColor: isActive
					? 'var(--cor-botao)'
					: `color-mix(in srgb, color-mix(in srgb, var(--cor-fundo-pasta) 40%, var(--cor-botao) 60%) ${100 - Math.abs(activeTabId - id) * 15}%, #000)`,
				transform: isActive ? ``: `translateY(${Math.abs(activeTabId - id) * 2.5}px)`,
			}}
		>
			{label}
		</li>
	);
}
