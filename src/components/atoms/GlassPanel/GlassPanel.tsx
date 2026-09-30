import type { HTMLAttributes, ReactNode } from 'react';
import styles from './GlassPanel.module.css';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  interactive?: boolean;
  glow?: boolean;
}

/** Reusable glassmorphism surface used by every card on the site. */
export function GlassPanel({
  children,
  padded = true,
  interactive = false,
  glow = false,
  className,
  ...rest
}: GlassPanelProps) {
  const classes = [
    styles.panel,
    padded ? styles.padded : '',
    interactive ? styles.interactive : '',
    glow ? styles.glow : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} data-mesh-ui {...rest}>
      {children}
    </div>
  );
}
