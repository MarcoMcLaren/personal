import styles from './Tag.module.css';

interface TagProps {
  children: string;
  withDot?: boolean;
}

/** A small skill / keyword chip. */
export function Tag({ children, withDot = true }: TagProps) {
  return (
    <span className={styles.tag}>
      {withDot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
