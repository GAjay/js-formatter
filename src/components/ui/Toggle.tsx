interface ToggleProps {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
    ui: { text: string };
  }
  
  export default function Toggle({ label, value, onChange, ui }: ToggleProps) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: ui.text }}>{label}</span>
        <button
          onClick={() => onChange(!value)}
          role="switch"
          aria-checked={value}
          style={{
            width: '38px',
            height: '22px',
            borderRadius: '11px',
            border: 'none',
            background: value ? '#6366f1' : '#cbd5e1',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s ease',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: '3px',
              left: value ? '19px' : '3px',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </button>
      </div>
    );
  }
  