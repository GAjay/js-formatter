import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    FileJson,
    AlignLeft,
    Type,
    HardDrive,
  } from "lucide-react";
  
  interface Stats {
    lines: number;
    characters: number;
    size: string;
  }
  
  interface StatusBarProps {
    loading: boolean;
    error: string;
    stats: Stats;
  }
  
  export default function StatusBar({
    loading,
    error,
    stats,
  }: StatusBarProps) {
    return (
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t bg-gray-50 px-4 py-3 text-sm">
  
        <div className="flex items-center gap-6">
  
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Formatting...
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              Invalid JSON
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Valid JSON
            </div>
          )}
  
        </div>
  
        <div className="flex flex-wrap items-center gap-6 text-gray-700">
  
          <div className="flex items-center gap-1">
            <AlignLeft className="h-4 w-4" />
            <span>{stats.lines} Lines</span>
          </div>
  
          <div className="flex items-center gap-1">
            <Type className="h-4 w-4" />
            <span>{stats.characters} Characters</span>
          </div>
  
          <div className="flex items-center gap-1">
            <HardDrive className="h-4 w-4" />
            <span>{stats.size}</span>
          </div>
  
          <div className="flex items-center gap-1">
            <FileJson className="h-4 w-4 text-blue-600" />
            <span>JSON</span>
          </div>
  
        </div>
      </footer>
    );
  }