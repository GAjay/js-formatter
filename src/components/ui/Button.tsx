import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
  ui: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    accentLight: string;
    error: string;
  };
}

const sizeStyles: Record<Size, { padding: string; fontSize: string; iconSize: number }> = {
  sm: { padding: '0.35rem 0.65rem', fontSize: '0.78rem', iconSize: 13 },
  md: { padding: '0.5rem 0.85rem', fontSize: '0.85rem', iconSize: 15 },
  lg: { padding: '0.65rem 1.1rem', fontSize: '0.9rem', iconSize: 16 },
};

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  ui,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const s = sizeStyles[size];

  const base: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    width: '100%',
    padding: s.padding,
    borderRadius: '8px',
    fontSize: s.fontSize,
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.55 : 1,
    border: 'none',
    background: 'transparent',
    color: ui.text,
    ...style,
  };

  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: loading ? ui.accentHover : ui.accent,
      color: '#fff',
      fontWeight: 600,
    },
    secondary: {
      border: `1px solid ${ui.border}`,
      background: ui.card,
    },
    ghost: {
      border: '1px solid transparent',
    },
    danger: {
      border: `1px solid ${ui.error}40`,
      background: `${ui.error}10`,
      color: ui.error,
    },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.background = ui.accentHover;
          else if (variant === 'secondary' || variant === 'ghost')
            e.currentTarget.style.background = ui.accentLight;
          else if (variant === 'danger') e.currentTarget.style.background = `${ui.error}20`;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.background = ui.accent;
        else if (variant === 'secondary') e.currentTarget.style.background = ui.card;
        else if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
        else if (variant === 'danger') e.currentTarget.style.background = `${ui.error}10`;
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: s.iconSize,
            height: s.iconSize,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
