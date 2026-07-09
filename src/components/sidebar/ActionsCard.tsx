import { Wand2, Minimize2, CheckCircle2, Wrench, Copy } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { ProcessingState, UITheme } from '../../types';

interface ActionsCardProps {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onRepair: () => void;
  onCopy: () => void;
  processing: ProcessingState;
  ready: boolean;
  copied: boolean;
  ui: UITheme;
}

export default function ActionsCard({
  onFormat,
  onMinify,
  onValidate,
  onRepair,
  onCopy,
  processing,
  ready,
  copied,
  ui,
}: ActionsCardProps) {
  const isProcessing = processing !== 'idle';

  return (
    <Card title="Actions" ui={ui}>
      <Button
        variant="primary"
        size="lg"
        icon={<Wand2 size={16} />}
        loading={processing === 'formatting'}
        onClick={onFormat}
        disabled={!ready || (isProcessing && processing !== 'formatting')}
        ui={ui}
      >
        {processing === 'formatting' ? 'Formatting...' : 'Format JSON'}
      </Button>
      <Button
        variant="secondary"
        icon={<Minimize2 size={15} />}
        loading={processing === 'minifying'}
        onClick={onMinify}
        disabled={!ready || (isProcessing && processing !== 'minifying')}
        ui={ui}
      >
        {processing === 'minifying' ? 'Minifying...' : 'Minify JSON'}
      </Button>
      <Button
        variant="secondary"
        icon={<CheckCircle2 size={15} />}
        loading={processing === 'validating'}
        onClick={onValidate}
        disabled={!ready || (isProcessing && processing !== 'validating')}
        ui={ui}
      >
        {processing === 'validating' ? 'Validating...' : 'Validate JSON'}
      </Button>
      <Button
        variant="secondary"
        icon={<Wrench size={15} />}
        loading={processing === 'repairing'}
        onClick={onRepair}
        disabled={!ready || (isProcessing && processing !== 'repairing')}
        ui={ui}
      >
        {processing === 'repairing' ? 'Repairing...' : 'Repair JSON'}
      </Button>
      <Button
        variant="secondary"
        icon={<Copy size={15} />}
        onClick={onCopy}
        disabled={isProcessing}
        ui={ui}
      >
        {copied ? 'Copied!' : 'Copy Input'}
      </Button>
    </Card>
  );
}
