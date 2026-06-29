import { ChangeEvent } from "react";
import {
  CheckCircle2,
  Clipboard,
  Download,
  Eraser,
  FileJson,
  Minimize2,
  Upload,
  Wand2,
} from "lucide-react";
import { Indentation } from "../hooks/useJsonFormatter";

interface ToolbarProps {
  loading: boolean;
  indentation: Indentation;
  setIndentation: (value: Indentation) => void;

  format: () => void;
  minify: () => void;
  validate: () => void;
  copy: () => void;
  clear: () => void;
  download: () => void;
  upload: (file: File) => void;
}

const buttonClass =
  "flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50";

export default function Toolbar({
  loading,
  indentation,
  setIndentation,
  format,
  minify,
  validate,
  copy,
  clear,
  download,
  upload,
}: ToolbarProps) {
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    upload(file);

    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className={buttonClass} style={{ cursor: "pointer" }}>
          <Upload size={18} />
          Upload

          <input
            hidden
            type="file"
            accept=".json,application/json"
            onChange={handleUpload}
          />
        </label>

        <button
          className={buttonClass}
          disabled={loading}
          onClick={format}
        >
          <Wand2 size={18} />
          Format
        </button>

        <button
          className={buttonClass}
          disabled={loading}
          onClick={minify}
        >
          <Minimize2 size={18} />
          Minify
        </button>

        <button
          className={buttonClass}
          disabled={loading}
          onClick={validate}
        >
          <CheckCircle2 size={18} />
          Validate
        </button>

        <button
          className={buttonClass}
          disabled={loading}
          onClick={copy}
        >
          <Clipboard size={18} />
          Copy
        </button>

        <button
          className={buttonClass}
          disabled={loading}
          onClick={download}
        >
          <Download size={18} />
          Download
        </button>

        <button
          className={buttonClass}
          disabled={loading}
          onClick={clear}
        >
          <Eraser size={18} />
          Clear
        </button>
      </div>

      <div className="flex items-center gap-3">
        <FileJson className="text-blue-600" size={20} />

        <label className="text-sm font-medium">
          Indentation
        </label>

        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={indentation === "\t" ? "tab" : indentation}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "tab") {
              setIndentation("\t");
            } else {
              setIndentation(Number(value) as 2 | 4);
            }
          }}
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value="tab">Tab</option>
        </select>
      </div>
    </div>
  );
}