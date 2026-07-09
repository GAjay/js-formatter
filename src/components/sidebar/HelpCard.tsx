import { Info, Wand2, CheckCircle2, Wrench } from 'lucide-react';
import Card from '../ui/Card';
import HelpItem from '../ui/HelpItem';
import type { UITheme } from '../../types';

interface HelpCardProps {
  ui: UITheme;
}

export default function HelpCard({ ui }: HelpCardProps) {
  return (
    <Card title="Help" icon={<Info size={14} color={ui.accent} />} ui={ui}>
      <HelpItem icon={<Info size={14} color={ui.accent} />} text="Paste your JSON data in the input editor." />
      <HelpItem icon={<Wand2 size={14} color={ui.accent} />} text="Click Format JSON to beautify it." />
      <HelpItem icon={<CheckCircle2 size={14} color={ui.success} />} text="Use Validate JSON to check for errors." />
      <HelpItem icon={<Wrench size={14} color={ui.warning} />} text="Repair JSON fixes trailing commas and unquoted keys." />
    </Card>
  );
}
