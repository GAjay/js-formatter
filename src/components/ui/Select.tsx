import { ChevronDown } from 'lucide-react';

interface SelectProps<T extends string | number> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
  ui: { border: string; text: string; inputBg: string };
}

export default function Select<T extends string | number>({
  value,
  options,
  onChange,
  ui,
}: SelectProps<T>) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          const num = Number(raw);
          onChange((isNaN(num) ? raw : num) as T);
        }}
        style={{
          width: '100%',
          padding: '0.5rem 2rem 0.5rem 0.75rem',
          borderRadius: '8px',
          border: `1px solid ${ui.border}`,
          background: ui.inputBg,
          color: ui.text,
          fontSize: '0.85rem',
          appearance: 'none',
          cursor: 'pointer',
          outline: 'none',
          fontWeight: 500,
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: 'absolute',
          right: '0.625rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: ui.text,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
