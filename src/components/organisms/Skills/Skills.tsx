import { SectionHeading } from '@/components/molecules/SectionHeading/SectionHeading';
import { SkillCluster } from '@/components/molecules/SkillCluster/SkillCluster';
import { Reveal } from '@/components/atoms/Reveal/Reveal';
import { skillGroups } from '@/data/profile';
import styles from './Skills.module.css';

export function Skills() {
  return (
    <section className="section section-shell" id="skills">
      <SectionHeading
        eyebrow="Constellation"
        title="Tech stack & skills"
        intro="The tools I reach for when building scalable, cloud-native systems."
      />
      <div className={styles.grid}>
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={i * 0.08}>
            <SkillCluster group={group} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
