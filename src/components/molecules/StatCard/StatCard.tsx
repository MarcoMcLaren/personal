import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <GlassPanel padded={false} interactive glow className={styles.card}>
      <span className={`${styles.value} gradient-text`}>{value}</span>
      <span className={styles.label}>{label}</span>
    </GlassPanel>
  );
}
