import type { ReactNode } from 'react';
import { Button, Tooltip } from '@/shared/asriui';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface IconToolButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  variant?: IconButtonVariant;
  /** Toolbar = outline icons; pane = ghost icons in compact headers. */
  appearance?: 'toolbar' | 'pane' | 'float';
  /** Show text beside icon (floating action bar). */
  showLabel?: boolean;
  children: ReactNode;
}

/** Icon-only control with accessible name and hover tooltip. */
export function IconToolButton({
  label,
  onClick,
  disabled,
  loading,
  active,
  variant,
  appearance = 'toolbar',
  showLabel = false,
  children,
}: IconToolButtonProps) {
  const resolvedVariant =
    variant ??
    (active ? 'secondary' : appearance === 'pane' ? 'ghost' : appearance === 'float' ? 'outline' : 'outline');

  const btn = (
    <Button
      type="button"
      variant={resolvedVariant}
      size="sm"
      aria-label={label}
      disabled={disabled || loading}
      loading={loading}
      onClick={onClick}
      className={`formatter-icon-btn${showLabel ? ' formatter-float-tool-btn' : ''}`}
    >
      <span className="formatter-float-tool-btn-inner">
        {children}
        {showLabel ? <span className="formatter-float-tool-label">{label}</span> : null}
      </span>
    </Button>
  );

  if (showLabel) return btn;

  if (appearance === 'pane') {
    return (
      <span className="formatter-pane-action-wrap" title={label}>
        {btn}
      </span>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger className="formatter-tooltip-trigger">{btn}</Tooltip.Trigger>
      <Tooltip.Content placement={appearance === 'float' ? 'top' : 'bottom'} sideOffset={6}>
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
}
