import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  ui: { card: string; border: string; text: string; textMuted: string; accent: string; accentLight: string };
  actions?: ReactNode;
  children: ReactNode;
}

export default function Panel({ title, subtitle, icon, ui, actions, children }: PanelProps) {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderBottom: `1px solid ${ui.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: ui.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: ui.text }}>{title}</span>
            <span style={{ fontSize: '0.8rem', color: ui.textMuted, marginLeft: '0.4rem' }}>
              {subtitle}
            </span>
          </div>
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
