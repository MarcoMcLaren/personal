import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Reveal } from '@/components/atoms/Reveal/Reveal';
import { SocialLinks } from '@/components/molecules/SocialLinks/SocialLinks';
import { cvUrl, profile } from '@/data/profile';
import styles from './Contact.module.css';

export function Contact() {
  return (
    <section className="section section-shell" id="contact">
      <Reveal>
        <GlassPanel className={styles.panel}>
          <span className={styles.eyebrow}>
            <Icon name="sparkle" size={14} /> Let&apos;s connect
          </span>

          <h2 className={styles.title}>
            Ready to build something <span className="gradient-text">stellar</span>
          </h2>

          <p className={styles.blurb}>
            I&apos;m open to roles where I can help architect and ship ambitious,
            cloud-native systems. If that sounds like your team, my inbox is open.
          </p>

          <span className={styles.nod}>
            <Icon name="star" size={16} /> Setting course for Anthropic
          </span>

          <a className={`${styles.email} gradient-text`} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          <div className={styles.actions}>
            <Button as="a" href={`mailto:${profile.email}`} variant="ember">
              Send a message
              <Icon name="mail" size={18} />
            </Button>
            <Button
              as="a"
              href={cvUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
              <Icon name="arrow-up-right" size={18} />
            </Button>
          </div>

          <div className={styles.socials}>
            <SocialLinks labelled />
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
