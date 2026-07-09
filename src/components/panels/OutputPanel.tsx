import type { editor } from 'monaco-editor';
import { Braces, Copy, Download } from 'lucide-react';
import Panel from '../ui/Panel';
import Chip from '../ui/Chip';
import JsonEditor from './JsonEditor';
import type { EditorTheme, UITheme } from '../../types';

interface OutputPanelProps {
  value: string;
  onCopy: () => void;
  onDownload: () => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
  theme: EditorTheme;
  wordWrap: boolean;
  lineNumbers: boolean;
  copied: boolean;
  ui: UITheme;
}

export default function OutputPanel({
  value,
  onCopy,
  onDownload,
  onMount,
  theme,
  wordWrap,
  lineNumbers,
  copied,
  ui,
}: OutputPanelProps) {
  return (
    <Panel
      title="Output"
      subtitle="(Formatted JSON)"
      icon={<Braces size={14} color={ui.accent} />}
      ui={ui}
      actions={
        <>
          <Chip
            onClick={onCopy}
            icon={<Copy size={13} />}
            label={copied ? 'Copied!' : 'Copy'}
            ui={ui}
            active={copied}
          />
          <Chip onClick={onDownload} icon={<Download size={13} />} label="Download" ui={ui} />
        </>
      }
    >
      <div style={{ height: '340px' }}>
        {value ? (
          <JsonEditor
            value={value}
            readOnly
            theme={theme}
            wordWrap={wordWrap}
            lineNumbers={lineNumbers}
            onMount={onMount}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: ui.textMuted,
              fontSize: '0.85rem',
            }}
          >
            Formatted output will appear here
          </div>
        )}
      </div>
    </Panel>
  );
}
