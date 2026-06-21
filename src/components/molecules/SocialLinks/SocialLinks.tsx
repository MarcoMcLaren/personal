import { Icon } from '@/components/atoms/Icon/Icon';
import { socials } from '@/data/profile';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  labelled?: boolean;
}

/** Renders the profile's social/contact links as icon buttons. */
export function SocialLinks({ labelled = false }: SocialLinksProps) {
  return (
    <ul className={styles.list}>
      {socials.map((social) => {
        const external = social.icon === 'github' || social.icon === 'linkedin';
        return (
          <li key={social.label}>
            <a
              className={`${styles.link} ${labelled ? styles.labelled : ''}`}
              href={social.href}
              aria-label={`${social.label}: ${social.handle}`}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <Icon name={social.icon} size={20} />
              {labelled && (
                <span className={styles.labelledText}>
                  <small>{social.label}</small>
                  {social.handle}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
