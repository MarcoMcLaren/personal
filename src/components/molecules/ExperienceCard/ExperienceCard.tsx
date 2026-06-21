import { Icon } from '@/components/atoms/Icon/Icon';
import { Tag } from '@/components/atoms/Tag/Tag';
import { Reveal } from '@/components/atoms/Reveal/Reveal';
import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import type { ExperienceItem } from '@/data/profile';
import styles from './ExperienceCard.module.css';

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
}

/** A single role on the experience timeline. */
export function ExperienceCard({ item, index }: ExperienceCardProps) {
  return (
    <Reveal as="li" className={styles.item} delay={index * 0.05}>
      <span className={styles.node} aria-hidden="true" />
      <GlassPanel className={styles.card} interactive glow>
        <div className={styles.header}>
          <h3 className={styles.role}>{item.role}</h3>
          <span className={styles.period}>{item.period}</span>
        </div>
        <p className={styles.company}>{item.company}</p>
        {item.context && <p className={styles.context}>{item.context}</p>}

        <ul className={styles.highlights}>
          {item.highlights.map((highlight) => (
            <li key={highlight} className={styles.highlight}>
              <Icon name="sparkle" size={15} />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className={styles.stack}>
          {item.stack.map((tech) => (
            <Tag key={tech} withDot={false}>
              {tech}
            </Tag>
          ))}
        </div>
      </GlassPanel>
    </Reveal>
  );
}
