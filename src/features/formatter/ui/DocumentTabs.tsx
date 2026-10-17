import { Icon, Tooltip } from '@/shared/asriui';
import { Plus } from 'lucide-react';
import type { JsonTab } from '../model/types';

interface DocumentTabsProps {
  tabs: JsonTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: () => void;
}

export function DocumentTabs({ tabs, activeTabId, onSelectTab, onCloseTab, onAddTab }: DocumentTabsProps) {
  return (
    <div className="formatter-tabbar">
      <div className="formatter-tabs-scroll" role="tablist" aria-label="Documents">
        {tabs.map((tab) => {
          const active = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={active}
              className={`formatter-doc-tab${active ? ' formatter-doc-tab--active' : ''}`}
            >
              <button type="button" className="formatter-doc-tab-select" onClick={() => onSelectTab(tab.id)}>
                <span className="formatter-doc-tab-name">{tab.name}</span>
                {tab.status && (
                  <span
                    className={`formatter-doc-tab-dot ${tab.status.valid ? 'formatter-doc-tab-dot--ok' : 'formatter-doc-tab-dot--err'}`}
                    aria-label={tab.status.valid ? 'Valid' : 'Invalid'}
                  />
                )}
              </button>
              {tabs.length > 1 && (
                <button
                  type="button"
                  className="formatter-doc-tab-close"
                  aria-label={`Close ${tab.name}`}
                  title={`Close ${tab.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                >
                  <Icon name="x" size="sm" aria-hidden />
                </button>
              )}
            </div>
          );
        })}

        <Tooltip>
          <Tooltip.Trigger className="formatter-doc-tab-new-trigger">
            <button type="button" className="formatter-doc-tab formatter-doc-tab--new" onClick={onAddTab} aria-label="New tab">
              <Plus size={15} strokeWidth={2.25} aria-hidden />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content placement="bottom" sideOffset={6}>
            New tab
          </Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
}
