import { Braces, Moon, Sun, HelpCircle, Share2 } from 'lucide-react';
import IconButton from '../ui/IconButton';
import type { UITheme } from '../../types';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  ui: UITheme;
}

export default function Header({ darkMode, onToggleDarkMode, ui }: HeaderProps) {
  return (
    <header
      style={{
        background: ui.card,
        borderBottom: `1px solid ${ui.border}`,
        padding: '0 1.5rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: `linear-gradient(135deg, ${ui.accent}, #818cf8)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
          }}
        >
          <Braces size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: ui.text, lineHeight: 1.2 }}>
            JSON Formatter
          </div>
          <div style={{ fontSize: '0.7rem', color: ui.textMuted, lineHeight: 1.2 }}>
            Format, validate & beautify JSON
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <IconButton onClick={onToggleDarkMode} title="Toggle theme" ui={ui}>
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>
        <IconButton title="Help" ui={ui}>
          <HelpCircle size={17} />
        </IconButton>
      
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '7px',
            border: `1px solid ${ui.border}`,
            background: ui.card,
            color: ui.text,
            fontWeight: 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            marginLeft: '0.2rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = ui.accentLight)}
          onMouseLeave={(e) => (e.currentTarget.style.background = ui.card)}
        >
          <Share2 size={13} /> Share
        </button>
      </div>
    </header>
  );
}
