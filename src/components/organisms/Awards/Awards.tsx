import { SectionHeading } from '@/components/molecules/SectionHeading/SectionHeading';
import { AwardCard } from '@/components/molecules/AwardCard/AwardCard';
import { Reveal } from '@/components/atoms/Reveal/Reveal';
import { awards } from '@/data/profile';
import styles from './Awards.module.css';

export function Awards() {
  return (
    <section className="section section-shell" id="awards">
      <SectionHeading
        eyebrow="Recognition"
        title="Awards & honours"
        intro="A track record recognised for best-in-class software systems and drive."
      />
      <div className={styles.grid}>
        {awards.map((award, i) => (
          <Reveal key={award.title} delay={i * 0.07}>
            <AwardCard award={award} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
