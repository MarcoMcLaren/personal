import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';
import { navLinks, profile } from '@/data/profile';
import styles from './Navbar.module.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label={`${profile.name} — home`}>
          <span className={styles.mark} aria-hidden="true">
            {profile.initials}
          </span>
          <span className={styles.brandText}>
            {profile.firstName} <span>{profile.lastName}</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a className={styles.navLink} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button as="a" href="#contact" variant="ghost">
            Get in touch
          </Button>
        </nav>

        <button
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className={styles.drawer}
            aria-label="Mobile"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                className={styles.drawerLink}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
              >
                {link.label}
              </motion.a>
            ))}
            <p className={styles.drawerHint}>{profile.location}</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
