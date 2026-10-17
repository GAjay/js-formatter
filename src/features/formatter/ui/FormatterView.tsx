import { useRef, useState } from 'react';
import { Icon } from '@/shared/asriui';
import { useAppTheme } from '@/shared/providers';
import { useJsonFormatter } from '../hooks/useJsonFormatter';
import { LANGUAGE_OPTIONS } from '../constants';
import { formatByteSize } from '../lib/json/stats';
import { FormatterBottomDock } from './FormatterBottomDock';
import { FormatterTopBar } from './FormatterTopBar';
import { PaneIconAction, SplitEditorPane } from './SplitEditorPane';
import type { MonacoJsonEditorHandle } from './MonacoJsonEditor';
import './formatter-layout.css';

function paneMeta(language: string, text: string, readOnly: boolean): string {
  const lang = LANGUAGE_OPTIONS.find((o) => o.value === language)?.label ?? language;
  const chars = text.length.toLocaleString();
  const bytes = formatByteSize(new TextEncoder().encode(text).length);
  const lines = text ? text.split('\n').length : 0;
  const linePart = lines > 0 ? ` · ${lines.toLocaleString()} lines` : '';
  const ro = readOnly ? ' · read-only' : '';
  return `${lang} · ${chars} chars · ${bytes}${linePart}${ro}`;
}

export function FormatterView() {
  const { resolvedTheme } = useAppTheme();
  const fmt = useJsonFormatter();
  const inputEditorRef = useRef<MonacoJsonEditorHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorColumn, setCursorColumn] = useState(1);

  const inputBytes = new TextEncoder().encode(fmt.activeTab.input).length;
  const outputBytes = new TextEncoder().encode(fmt.activeTab.output).length;
  const busy = fmt.activeTab.processing !== 'idle';

  const goToError = () => {
    const pos = fmt.activeTab.status?.position;
    if (pos) inputEditorRef.current?.focusAt(pos.line, pos.column);
  };

  const inputMeta = fmt.activeTab.input.trim()
    ? paneMeta(fmt.settings.language, fmt.activeTab.input, false)
    : `${LANGUAGE_OPTIONS.find((o) => o.value === fmt.settings.language)?.label ?? 'JSON'} · empty`;

  const outputMeta = fmt.activeTab.output.trim()
    ? paneMeta('json', fmt.activeTab.output, true)
    : 'JSON · waiting for format';

  const hasOutput = Boolean(fmt.activeTab.output.trim());

  const inputSideActions = (
    <>
      <PaneIconAction label="Paste" onClick={fmt.handlePaste} disabled={busy}>
        <Icon name="copy" size="sm" aria-hidden />
      </PaneIconAction>
      <PaneIconAction label="Upload" onClick={() => fileInputRef.current?.click()} disabled={busy}>
        <Icon name="image" size="sm" aria-hidden />
      </PaneIconAction>
      <PaneIconAction label="Sample" onClick={fmt.handleSample} disabled={busy}>
        <Icon name="form" size="sm" aria-hidden />
      </PaneIconAction>
      <PaneIconAction label="Clear" onClick={fmt.handleClear} disabled={busy}>
        <Icon name="x" size="sm" aria-hidden />
      </PaneIconAction>
    </>
  );

  const outputSideActions = (
    <>
      <PaneIconAction
        label={fmt.outputCopied ? 'Copied' : 'Copy'}
        onClick={fmt.handleCopyOutput}
        disabled={busy || !hasOutput}
        active={fmt.outputCopied}
      >
        <Icon name="copy" size="sm" aria-hidden />
      </PaneIconAction>
      <PaneIconAction label="Download" onClick={fmt.handleDownload} disabled={busy || !hasOutput}>
        <Icon name="package" size="sm" aria-hidden />
      </PaneIconAction>
      <PaneIconAction label="Use as input" onClick={fmt.handleUseOutputAsInput} disabled={busy || !hasOutput}>
        <Icon name="chevron-right" size="sm" aria-hidden />
      </PaneIconAction>
    </>
  );

  return (
    <div
      className={`formatter-studio formatter-studio--bottom-dock${resolvedTheme === 'dark' ? ' formatter-studio--dark' : ''}`}
    >
      <FormatterTopBar
        tabs={fmt.tabs}
        activeTabId={fmt.activeTabId}
        onSelectTab={fmt.setActiveTabId}
        onCloseTab={fmt.handleCloseTab}
        onAddTab={fmt.handleAddTab}
        settings={fmt.settings}
        onLanguageChange={fmt.setLanguage}
        onIndentChange={fmt.setIndent}
        onThemeChange={fmt.setTheme}
      />

      <div className="formatter-studio-frame">
        <main className="formatter-studio-main">
          <SplitEditorPane
            key={`${fmt.activeTabId}-in`}
            pane="input"
            title="Input"
            meta={inputMeta}
            value={fmt.activeTab.input}
            onChange={(v) => fmt.dispatch({ type: 'SET_INPUT', id: fmt.activeTabId, input: v })}
            editorTheme={fmt.settings.theme}
            language={fmt.settings.language}
            lineNumbers={fmt.settings.showLineNumbers}
            wordWrap={fmt.settings.wrapText}
            editorRef={inputEditorRef}
            onCursorPositionChange={(line, column) => {
              setCursorLine(line);
              setCursorColumn(column);
            }}
            onDropFiles={fmt.handleOpenFiles}
            sideActions={inputSideActions}
          />

          <SplitEditorPane
            key={`${fmt.activeTabId}-out`}
            pane="output"
            title="Output"
            meta={outputMeta}
            value={fmt.activeTab.output}
            readOnly
            editorTheme={fmt.settings.theme}
            language="json"
            lineNumbers={fmt.settings.showLineNumbers}
            wordWrap={fmt.settings.wrapText}
            emptyHint="Use Format or Minify in the bottom action bar."
            sideActions={outputSideActions}
          />
        </main>
      </div>

      <FormatterBottomDock
        settings={fmt.settings}
        onLineNumbersChange={fmt.setLineNumbers}
        onWrapTextChange={fmt.setWrapText}
        onSortKeysChange={fmt.setSortKeysOnFormat}
        processing={fmt.activeTab.processing}
        ready={fmt.ready}
        onFormat={fmt.handleFormat}
        onMinify={fmt.handleMinify}
        onValidate={fmt.handleValidate}
        onRepair={fmt.handleRepair}
        onSortKeys={fmt.handleSortKeys}
        onEscape={fmt.handleEscape}
        onUnescape={fmt.handleUnescape}
        editorLanguage={fmt.settings.language}
        status={fmt.activeTab.status}
        hasInput={Boolean(fmt.activeTab.input.trim())}
        stats={fmt.activeTab.stats}
        inputBytes={inputBytes}
        outputBytes={outputBytes}
        cursorLine={cursorLine}
        cursorColumn={cursorColumn}
        onGoToError={goToError}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        hidden
        onChange={(e) => {
          const list = e.target.files;
          if (list?.length) fmt.handleOpenFiles(list);
          e.target.value = '';
        }}
      />
    </div>
  );
}
