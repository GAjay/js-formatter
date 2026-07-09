import type { ReactNode } from 'react';

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  ui: { text: string; textMuted: string; border: string };
}

export default function StatRow({ label, value, icon, ui }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.35rem 0',
        borderBottom: `1px solid ${ui.border}`,
      }}
    >
      <span
        style={{
          fontSize: '0.82rem',
          color: ui.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        {icon}
        {label}
      </span>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: ui.text }}>{value}</span>
    </div>
  );
}
