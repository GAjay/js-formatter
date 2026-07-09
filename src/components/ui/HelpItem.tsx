import type { ReactNode } from 'react';

interface HelpItemProps {
  icon: ReactNode;
  text: string;
}

export default function HelpItem({ icon, text }: HelpItemProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{icon}</div>
      <span style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.45 }}>{text}</span>
    </div>
  );
}
