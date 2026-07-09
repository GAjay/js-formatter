import type { ReactNode } from 'react';

interface ChipProps {
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  ui: { textMuted: string };
  active?: boolean;
}

export default function Chip({ onClick, icon, label, ui, active }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.3rem 0.55rem',
        borderRadius: '6px',
        border: 'none',
        background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
        color: active ? '#6366f1' : ui.textMuted,
        fontSize: '0.78rem',
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      {label}
    </button>
  );
}
