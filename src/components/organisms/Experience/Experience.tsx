import { SectionHeading } from '@/components/molecules/SectionHeading/SectionHeading';
import { ExperienceCard } from '@/components/molecules/ExperienceCard/ExperienceCard';
import { experience } from '@/data/profile';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <section className="section section-shell" id="experience">
      <SectionHeading
        eyebrow="Trajectory"
        title="Experience"
        intro="Shipping production software for major organisations across insurance, mining, and media."
      />
      <div className={styles.timeline}>
        <ul className={styles.list}>
          {experience.map((item, i) => (
            <ExperienceCard key={item.role + item.period} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
