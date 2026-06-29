import { useCallback, useMemo, useState } from "react";

export type Indentation = 2 | 4 | "\t";

interface JsonStats {
  lines: number;
  characters: number;
  size: string;
}

export const useJsonFormatter = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [indentation, setIndentation] = useState<Indentation>(2);

  const validate = useCallback(
    (text: string = value) => {
      try {
        JSON.parse(text);
        setError("");
        return true;
      } catch (e: any) {
        setError(e.message);
        return false;
      }
    },
    [value]
  );

  const format = useCallback(() => {
    try {
      setLoading(true);

      const formatted = JSON.stringify(
        JSON.parse(value),
        null,
        indentation === "\t" ? "\t" : indentation
      );

      setValue(formatted);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [value, indentation]);

  const minify = useCallback(() => {
    try {
      setLoading(true);

      const formatted = JSON.stringify(JSON.parse(value));

      setValue(formatted);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [value]);

  const clear = useCallback(() => {
    setValue("");
    setError("");
  }, []);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
  }, [value]);

  const download = useCallback(() => {
    const blob = new Blob([value], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "formatted.json";
    a.click();

    URL.revokeObjectURL(url);
  }, [value]);

  const upload = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setValue(reader.result as string);
      setError("");
    };

    reader.readAsText(file);
  }, []);

  const stats: JsonStats = useMemo(() => {
    const size = new Blob([value]).size;

    return {
      lines: value ? value.split("\n").length : 0,
      characters: value.length,
      size:
        size < 1024
          ? `${size} B`
          : `${(size / 1024).toFixed(2)} KB`,
    };
  }, [value]);

  return {
    value,
    setValue,

    error,
    loading,

    indentation,
    setIndentation,

    format,
    minify,
    validate,

    clear,
    copy,
    download,
    upload,

    stats,
  };
};