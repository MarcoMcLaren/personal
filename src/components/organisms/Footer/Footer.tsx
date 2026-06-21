import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { profile } from '@/data/profile';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={`${styles.footer} section-shell`}>
      <GlassPanel className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.name}>{profile.name}</span>
          <span className={styles.role}>
            {profile.title} · {profile.location}
          </span>
        </div>
        <div className={styles.meta}>
          <span>© {year} {profile.name}. All rights reserved.</span>
          <span className={styles.builtWith}>
            Crafted with React, Three.js &amp; a little stardust ✦
          </span>
        </div>
      </GlassPanel>
    </footer>
  );
}
