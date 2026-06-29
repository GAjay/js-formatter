import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme?: "vs-dark" | "light";
  readOnly?: boolean;
  height?: string;
}

export default function JsonEditor({
  value,
  onChange,
  theme = "vs-dark",
  readOnly = false,
  height = "calc(100vh - 180px)",
}: JsonEditorProps) {
  const editorRef =
    useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.focus();

    editor.getAction("editor.action.formatDocument");
  };

  return (
    <Editor
      height={height}
      language="json"
      value={value}
      theme={theme}
      onMount={handleMount}
      onChange={(v) => onChange(v ?? "")}
      options={{
        readOnly,

        automaticLayout: true,

        minimap: {
          enabled: false,
        },

        fontSize: 14,

        fontFamily:
          "JetBrains Mono, Fira Code, monospace",

        tabSize: 2,

        insertSpaces: true,

        detectIndentation: true,

        formatOnPaste: true,

        formatOnType: true,

        wordWrap: "off",

        lineNumbers: "on",

        folding: true,

        foldingStrategy: "indentation",

        smoothScrolling: true,

        mouseWheelZoom: true,

        scrollBeyondLastLine: false,

        cursorBlinking: "smooth",

        cursorSmoothCaretAnimation: "on",

        renderWhitespace: "selection",

        renderControlCharacters: true,

        renderLineHighlight: "all",

        bracketPairColorization: {
          enabled: true,
        },

        guides: {
          bracketPairs: true,
          indentation: true,
        },

        quickSuggestions: true,

        suggestOnTriggerCharacters: true,

        occurrencesHighlight: "singleFile",

        selectionHighlight: true,

        links: true,

        contextmenu: true,

        fixedOverflowWidgets: true,

        unicodeHighlight: {
          ambiguousCharacters: false,
        },
      }}
    />
  );
}