import { createElement, type Dispatch, type SetStateAction } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export default function SelectMenu({
	text,
	options,
	isOpen,
	onToggle,
	setValue,
    value,
	classname,
	customIcon
}: {
	text: string;
	options: string[];
	isOpen?: boolean;
	onToggle?: () => void;
	setValue?: Dispatch<SetStateAction<string|null>>;
    value?: string|null;
	classname?: string;
	customIcon?: IconType;
}) {
	return (
		<div className={`select-menu ${classname ? classname : ''}`}>
			<button type="button" className="select-menu-button" onClick={onToggle}>
				{value ? value : text}
				{customIcon ? createElement(customIcon, { className: `select-menu-icon filter ${isOpen ? 'open' : ''}` }) : <FaAngleDown className={`select-menu-icon ${isOpen ? 'open' : ''}`} />}
			</button>
			{isOpen && (
				<ul className="select-menu-options">
					{options.map((option, index) => (
						<li
							key={index}
							className="select-menu-option"
							onClick={() => {
								if (setValue) {
									setValue(option);
								}
								if (onToggle) {
									onToggle();
								}
                                if (value === option && setValue) {
                                    setValue(null);
                                }
							}}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
