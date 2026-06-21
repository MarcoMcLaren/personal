import { SectionHeading } from '@/components/molecules/SectionHeading/SectionHeading';
import { StatCard } from '@/components/molecules/StatCard/StatCard';
import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Reveal } from '@/components/atoms/Reveal/Reveal';
import { education, languages, profile, stats } from '@/data/profile';
import styles from './About.module.css';

export function About() {
  return (
    <section className="section section-shell" id="about">
      <SectionHeading
        eyebrow="Origin Story"
        title="About me"
        intro="A backend-leaning engineer who likes turning fuzzy requirements into resilient, cloud-native systems."
      />

      <div className={styles.grid}>
        <Reveal>
          <GlassPanel className={styles.leadPanel} interactive glow>
            <p className={styles.lead}>
              {profile.summary.split('Award-winning')[0]}
              <strong>Award-winning</strong>
              {profile.summary.split('Award-winning')[1]}
            </p>
          </GlassPanel>
        </Reveal>

        <Reveal className={styles.side} delay={0.1}>
          <GlassPanel className={styles.block} interactive glow>
            <h3>
              <Icon name="graduation" size={16} /> Education
            </h3>
            <p className={styles.eduTitle}>{education.fullDegree}</p>
            <p className={styles.eduMeta}>
              {education.institution}
              <br />
              {education.period}
            </p>
            <span className={styles.eduNote}>{education.note}</span>
          </GlassPanel>

          <GlassPanel className={styles.block} interactive glow>
            <h3>
              <Icon name="sparkle" size={16} /> Languages
            </h3>
            <div className={styles.langs}>
              {languages.map((lang) => (
                <div className={styles.lang} key={lang.name}>
                  <span className={styles.langName}>{lang.name}</span>
                  <span className={styles.langLevel}>{lang.level}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </Reveal>
      </div>

      <div className={styles.stats}>
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <StatCard value={stat.value} label={stat.label} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
