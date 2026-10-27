import { useState } from 'react';

export default function Tooltip({ children, content, position = "top" }: { children: React.ReactNode; content: React.ReactNode; position?: "top" | "bottom" | "left" | "right" }) {
  const [active, setActive] = useState(false);
  if (content === '') {
    return <>{children}</>;
  }
  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
      {active && (
        <div className={`tooltip-box ${position}`}>
          {content}
        </div>
      )}
    </div>
  );
}