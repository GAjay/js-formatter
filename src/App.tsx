import { useReducer, useCallback, useRef, useState, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import Header from './components/layout/Header';
import StatusBar from './components/layout/StatusBar';
import TabBar from './components/layout/TabBar';
import InputPanel from './components/panels/InputPanel';
import OutputPanel from './components/panels/OutputPanel';
import ActionsCard from './components/sidebar/ActionsCard';
import SettingsCard from './components/sidebar/SettingsCard';
import StatsCard from './components/sidebar/StatsCard';
import HelpCard from './components/sidebar/HelpCard';
import { useJsonWorker } from './hooks/useJsonWorker';
import { tabReducer, settingsReducer, defaultSettings, createTab } from './hooks/reducer';
import { getUITheme, DEFAULT_INPUT } from './constants';
import type { IndentSize, EditorTheme } from './types';

export default function App() {
  const { ready, format, minify, validate, repair } = useJsonWorker();

  const [tabs, dispatch] = useReducer(tabReducer, [createTab('Tab 1', DEFAULT_INPUT)]);
  const [settings, dispatchSettings] = useReducer(settingsReducer, defaultSettings);
  const [activeTabId, setActiveTabId] = useState(() => tabs[0].id);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);

  const inputEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const ui = getUITheme(darkMode);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const clearErrorMarkers = useCallback(() => {
    const monaco = (window as any).monaco;
    const editorInst = inputEditorRef.current;
    if (monaco && editorInst) {
      monaco.editor.setModelMarkers(editorInst.getModel(), 'json', []);
    }
  }, []);

  const showErrorInEditor = useCallback((msg: string, position?: { line: number; column: number }) => {
    const monaco = (window as any).monaco;
    const editorInst = inputEditorRef.current;
    if (!monaco || !editorInst) return;
    const model = editorInst.getModel();
    if (!model) return;

    let line = position?.line;
    let column = position?.column;

    const posMatch = msg.match(/position (\d+)/i);
    if (posMatch && !line) {
      const offset = parseInt(posMatch[1], 10);
      const pos = model.getPositionAt(offset);
      line = pos.lineNumber;
      column = pos.column;
    }

    if (line) {
      monaco.editor.setModelMarkers(model, 'json', [
        {
          startLineNumber: line,
          startColumn: column || 1,
          endLineNumber: line,
          endColumn: (column || 1) + 10,
          message: msg,
          severity: monaco.MarkerSeverity.Error,
        },
      ]);
      editorInst.revealLineInCenter(line);
    }
  }, []);

  const handleFormat = useCallback(async () => {
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'formatting' });
    clearErrorMarkers();
    const res = await format(activeTab.input, settings.indent);
    if (res.ok && 'result' in res) {
      dispatch({ type: 'SET_OUTPUT', id: activeTabId, output: res.result, stats: res.stats });
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: true, message: 'Valid JSON — formatted successfully.' } });
    } else if (!res.ok && 'error' in res) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: false, message: res.error, position: res.position } });
      showErrorInEditor(res.error, res.position);
    }
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'idle' });
  }, [activeTabId, activeTab.input, settings.indent, format, clearErrorMarkers, showErrorInEditor]);

  const handleMinify = useCallback(async () => {
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'minifying' });
    clearErrorMarkers();
    const res = await minify(activeTab.input);
    if (res.ok && 'result' in res) {
      dispatch({ type: 'SET_OUTPUT', id: activeTabId, output: res.result, stats: res.stats });
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: true, message: 'Valid JSON — minified successfully.' } });
    } else if (!res.ok && 'error' in res) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: false, message: res.error, position: res.position } });
      showErrorInEditor(res.error, res.position);
    }
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'idle' });
  }, [activeTabId, activeTab.input, minify, clearErrorMarkers, showErrorInEditor]);

  const handleValidate = useCallback(async () => {
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'validating' });
    clearErrorMarkers();
    const res = await validate(activeTab.input);
    if (res.ok && 'stats' in res) {
      dispatch({ type: 'SET_STATS', id: activeTabId, stats: res.stats });
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: true, message: 'JSON is well-formed and valid.' } });
    } else if (!res.ok && 'error' in res) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: false, message: res.error, position: res.position } });
      showErrorInEditor(res.error, res.position);
    }
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'idle' });
  }, [activeTabId, activeTab.input, validate, clearErrorMarkers, showErrorInEditor]);

  const handleRepair = useCallback(async () => {
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'repairing' });
    clearErrorMarkers();
    const res = await repair(activeTab.input);
    if (res.ok && 'result' in res) {
      dispatch({ type: 'REPAIR_TAB', id: activeTabId, input: res.result, output: res.result, stats: res.stats });
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: true, message: 'JSON repaired successfully.' } });
    } else if (!res.ok && 'error' in res) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: false, message: res.error } });
    }
    dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'idle' });
  }, [activeTabId, activeTab.input, repair, clearErrorMarkers]);

  const handleCopyInput = useCallback(() => {
    navigator.clipboard.writeText(activeTab.input).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activeTab.input]);

  const handleCopyOutput = useCallback(() => {
    navigator.clipboard.writeText(activeTab.output).then(() => {
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 2000);
    });
  }, [activeTab.output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([activeTab.output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab.name || 'formatted'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeTab.output, activeTab.name]);

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR_TAB', id: activeTabId });
    clearErrorMarkers();
  }, [activeTabId, clearErrorMarkers]);

  const handleAddTab = useCallback(() => {
    const tabNum = tabs.length + 1;
    dispatch({ type: 'ADD_TAB', name: `Tab ${tabNum}` });
    setActiveTabId(`tab-${Date.now()}-${tabNum}`);
  }, [tabs.length]);

  const handleCloseTab = useCallback(
    (id: string) => {
      if (id === activeTabId) {
        const idx = tabs.findIndex((t) => t.id === id);
        const remaining = tabs.filter((t) => t.id !== id);
        const newActive = remaining[Math.max(0, idx - 1)];
        if (newActive) setActiveTabId(newActive.id);
      }
      dispatch({ type: 'CLOSE_TAB', id });
    },
    [activeTabId, tabs]
  );

  // Debounced auto-validate for active tab
  useEffect(() => {
    if (!activeTab.input.trim()) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: null });
      dispatch({ type: 'SET_STATS', id: activeTabId, stats: null });
      clearErrorMarkers();
      return;
    }
    const timer = setTimeout(async () => {
      const res = await validate(activeTab.input);
      if (res.ok && 'stats' in res) {
        dispatch({ type: 'SET_STATS', id: activeTabId, stats: res.stats });
        dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: true, message: 'JSON is valid.' } });
        clearErrorMarkers();
      } else if (!res.ok && 'error' in res) {
        dispatch({ type: 'SET_STATUS', id: activeTabId, status: { valid: false, message: res.error, position: res.position } });
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab.input, activeTabId]);

  return (
    <div
      style={{
        background: ui.bg,
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} ui={ui} />

      <div style={{ flex: 1, maxWidth: '1320px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={handleCloseTab}
          onAddTab={handleAddTab}
          ui={ui}
        />

        <main
          style={{
            padding: '1.25rem 0',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: '1.25rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Editors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InputPanel
              key={activeTabId}
              value={activeTab.input}
              onChange={(v) => dispatch({ type: 'SET_INPUT', id: activeTabId, input: v })}
              onClear={handleClear}
              onMount={(editorInst) => {
                inputEditorRef.current = editorInst;
              }}
              theme={settings.theme}
              wordWrap={settings.wrapText}
              lineNumbers={settings.showLineNumbers}
              ui={ui}
            />

            <OutputPanel
              key={`${activeTabId}-output`}
              value={activeTab.output}
              onCopy={handleCopyOutput}
              onDownload={handleDownload}
              onMount={() => {}}
              theme={settings.theme}
              wordWrap={settings.wrapText}
              lineNumbers={settings.showLineNumbers}
              copied={outputCopied}
              ui={ui}
            />
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ActionsCard
              onFormat={handleFormat}
              onMinify={handleMinify}
              onValidate={handleValidate}
              onRepair={handleRepair}
              onCopy={handleCopyInput}
              processing={activeTab.processing}
              ready={ready}
              copied={copied}
              ui={ui}
            />
            <SettingsCard
              settings={settings}
              onIndentChange={(v: IndentSize) => dispatchSettings({ type: 'SET_INDENT', value: v })}
              onThemeChange={(v: EditorTheme) => dispatchSettings({ type: 'SET_THEME', value: v })}
              onLineNumbersChange={(v: boolean) => dispatchSettings({ type: 'SET_LINE_NUMBERS', value: v })}
              onWrapTextChange={(v: boolean) => dispatchSettings({ type: 'SET_WRAP_TEXT', value: v })}
              ui={ui}
            />
            {activeTab.stats && <StatsCard stats={activeTab.stats} ui={ui} />}
            <HelpCard ui={ui} />
          </div>
        </main>
      </div>

      <StatusBar status={activeTab.status} ui={ui} />
    </div>
  );
}
