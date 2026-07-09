import { Plus, X, FileJson } from 'lucide-react';
import type { JsonTab, UITheme } from '../../types';

interface TabBarProps {
  tabs: JsonTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: () => void;
  ui: UITheme;
}

export default function TabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
  ui,
}: TabBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.5rem 0.5rem 0 0.5rem',
        overflowX: 'auto',
        borderBottom: `1px solid ${ui.border}`,
        background: ui.card,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.7rem 0.45rem 0.65rem',
              borderRadius: '8px 8px 0 0',
              background: isActive ? ui.inputBg : 'transparent',
              border: isActive ? `1px solid ${ui.border}` : '1px solid transparent',
              borderBottom: isActive ? '1px solid transparent' : `1px solid ${ui.border}`,
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? ui.text : ui.textMuted,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              marginBottom: '-1px',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = ui.accentLight;
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <FileJson size={13} color={isActive ? ui.accent : ui.textMuted} />
            <span>{tab.name}</span>
            {tab.status && (
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: tab.status.valid ? ui.success : ui.error,
                  flexShrink: 0,
                }}
              />
            )}
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'transparent',
                  color: ui.textMuted,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${ui.error}20`;
                  e.currentTarget.style.color = ui.error;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = ui.textMuted;
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onAddTab}
        title="New tab"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          borderRadius: '6px',
          border: `1px solid ${ui.border}`,
          background: 'transparent',
          color: ui.textMuted,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = ui.accentLight;
          e.currentTarget.style.color = ui.accent;
          e.currentTarget.style.borderColor = ui.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = ui.textMuted;
          e.currentTarget.style.borderColor = ui.border;
        }}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
