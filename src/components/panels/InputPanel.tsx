import { useRef } from 'react';
import type { editor } from 'monaco-editor';
import { Braces, FolderOpen, Trash2 } from 'lucide-react';
import Panel from '../ui/Panel';
import Chip from '../ui/Chip';
import JsonEditor from './JsonEditor';
import type { EditorTheme, UITheme } from '../../types';

interface InputPanelProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
  theme: EditorTheme;
  wordWrap: boolean;
  lineNumbers: boolean;
  ui: UITheme;
}

export default function InputPanel({
  value,
  onChange,
  onClear,
  onMount,
  theme,
  wordWrap,
  lineNumbers,
  ui,
}: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Panel
      title="Input"
      subtitle="(Unformatted JSON)"
      icon={<Braces size={14} color={ui.accent} />}
      ui={ui}
      actions={
        <>
          <Chip onClick={handleOpen} icon={<FolderOpen size={13} />} label="Open" ui={ui} />
          <Chip onClick={onClear} icon={<Trash2 size={13} />} label="Clear" ui={ui} />
          <span style={{ fontSize: '0.74rem', color: ui.textMuted, marginLeft: '0.3rem' }}>
            {value.length} chars
          </span>
        </>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div style={{ height: '260px' }}>
        <JsonEditor
          value={value}
          onChange={(val) => onChange(val ?? '')}
          theme={theme}
          wordWrap={wordWrap}
          lineNumbers={lineNumbers}
          onMount={onMount}
        />
      </div>
    </Panel>
  );
}
