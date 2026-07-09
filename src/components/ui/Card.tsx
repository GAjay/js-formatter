import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  title?: string;
  icon?: ReactNode;
  ui: { card: string; border: string; text: string };
  children: ReactNode;
  headerExtra?: ReactNode;
  bodyStyle?: CSSProperties;
  noPadding?: boolean;
}

export default function Card({ title, icon, ui, children, headerExtra, bodyStyle, noPadding }: CardProps) {
  return (
    <div
      style={{
        background: ui.card,
        border: `1px solid ${ui.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: `1px solid ${ui.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon}
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: ui.text, letterSpacing: '0.01em' }}>
              {title}
            </span>
          </div>
          {headerExtra}
        </div>
      )}
      <div
        style={{
          padding: noPadding ? 0 : '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
