import { CheckCircle2, XCircle } from 'lucide-react';
import type { Status } from '../../types';
import type { UITheme } from '../../types';

interface StatusBarProps {
  status: Status | null;
  ui: UITheme;
}

export default function StatusBar({ status, ui }: StatusBarProps) {
  if (!status) return null;

  const bg = status.valid ? '#ecfdf5' : '#fef2f2';
  const border = status.valid ? '#a7f3d0' : '#fecaca';
  const titleColor = status.valid ? '#065f46' : '#991b1b';
  const msgColor = status.valid ? '#047857' : '#b91c1c';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: bg,
        borderTop: `1px solid ${border}`,
        padding: '0.65rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {status.valid ? (
          <CheckCircle2 size={20} color={ui.success} />
        ) : (
          <XCircle size={20} color={ui.error} />
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: titleColor }}>
            {status.valid ? 'Valid JSON' : 'Invalid JSON'}
          </div>
          <div
            style={{
              fontSize: '0.76rem',
              color: msgColor,
              maxWidth: '600px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {status.message}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '0.76rem', color: msgColor, whiteSpace: 'nowrap' }}>
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        {' \u2022 '}
        {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </div>
    </div>
  );
}
