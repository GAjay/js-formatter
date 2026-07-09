import type { ReactNode } from 'react';

interface LabelProps {
  children: ReactNode;
  ui: { textMuted: string };
}

export default function Label({ children, ui }: LabelProps) {
  return (
    <span
      style={{
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: ui.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.35rem',
      }}
    >
      {children}
    </span>
  );
}
