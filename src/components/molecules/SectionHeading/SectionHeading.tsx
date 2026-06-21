import { Icon } from '@/components/atoms/Icon/Icon';
import { Reveal } from '@/components/atoms/Reveal/Reveal';
import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <Reveal className={`${styles.reveal} ${centered ? styles.centerReveal : ''}`}>
      <GlassPanel className={`${styles.wrap} ${centered ? styles.center : ''}`}>
        <span className={styles.eyebrow}>
          <Icon name="sparkle" size={16} />
          {eyebrow}
        </span>
        <h2 className={styles.title} id={id}>
          {title}
        </h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </GlassPanel>
    </Reveal>
  );
}
