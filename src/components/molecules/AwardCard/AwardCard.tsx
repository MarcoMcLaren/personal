import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { Icon } from '@/components/atoms/Icon/Icon';
import type { AwardItem } from '@/data/profile';
import styles from './AwardCard.module.css';

interface AwardCardProps {
  award: AwardItem;
}

export function AwardCard({ award }: AwardCardProps) {
  return (
    <GlassPanel interactive glow className={styles.card}>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon name="trophy" size={24} />
      </span>
      <div className={styles.body}>
        <span className={styles.year}>{award.year}</span>
        <h3 className={styles.title}>{award.title}</h3>
        <p className={styles.detail}>{award.detail}</p>
      </div>
    </GlassPanel>
  );
}
