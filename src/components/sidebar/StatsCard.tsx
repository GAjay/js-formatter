import { BarChart3, FileText, Hash, Key, ListTree, HardDrive } from 'lucide-react';
import Card from '../ui/Card';
import StatRow from '../ui/StatRow';
import type { Stats, UITheme } from '../../types';

interface StatsCardProps {
  stats: Stats;
  ui: UITheme;
}

export default function StatsCard({ stats, ui }: StatsCardProps) {
  return (
    <Card title="Statistics" icon={<BarChart3 size={14} color={ui.accent} />} ui={ui}>
      <StatRow label="Total Lines" value={stats.lines} icon={<FileText size={12} />} ui={ui} />
      <StatRow label="Characters" value={stats.chars} icon={<Hash size={12} />} ui={ui} />
      <StatRow label="Keys" value={stats.keys} icon={<Key size={12} />} ui={ui} />
      <StatRow label="Elements" value={stats.elements} icon={<ListTree size={12} />} ui={ui} />
      <StatRow label="Size" value={stats.size} icon={<HardDrive size={12} />} ui={ui} />
    </Card>
  );
}
