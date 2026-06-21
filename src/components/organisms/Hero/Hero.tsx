import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { cvUrl, profile } from '@/data/profile';
import styles from './Hero.module.css';

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.2, duration: 0.6 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section className={`${styles.hero} section-shell`} id="top">
      <motion.div
        className={styles.content}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.span className={styles.eyebrow} variants={item}>
          {profile.location}
        </motion.span>

        <motion.h1 className={styles.name} variants={item}>
          {profile.firstName}
          <span className={`${styles.last} gradient-text`}>{profile.lastName}</span>
        </motion.h1>

        <motion.p className={styles.title} variants={item}>
          {profile.title}
          <span className={styles.divider}>/</span>
          {profile.subtitle}
        </motion.p>

        <motion.p className={styles.tagline} variants={item}>
          {profile.tagline} Strong foundation in .NET and Azure, delivering
          production systems across insurance, mining, and media.
        </motion.p>

        <motion.div className={styles.actions} variants={item}>
          <Button as="a" href="#experience" variant="primary">
            Explore my work
            <Icon name="arrow-down" size={18} />
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
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={styles.scrollCue}
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className={styles.mouse} aria-hidden="true">
          <span className={styles.wheel} />
        </span>
        Scroll
      </motion.a>
    </section>
  );
}
