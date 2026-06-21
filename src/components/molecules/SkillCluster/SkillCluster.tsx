import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { Tag } from '@/components/atoms/Tag/Tag';
import type { SkillGroup } from '@/data/profile';
import styles from './SkillCluster.module.css';

interface SkillClusterProps {
  group: SkillGroup;
}

export function SkillCluster({ group }: SkillClusterProps) {
  return (
    <GlassPanel interactive glow className={styles.cluster}>
      <h3 className={styles.label}>{group.label}</h3>
      <div className={styles.skills}>
        {group.skills.map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
    </GlassPanel>
  );
}
