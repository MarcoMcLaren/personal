import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'ember';

interface CommonProps {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Polymorphic button — renders as <a> or <button> depending on `as`,
 * so links and actions share one cosmic visual language.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', fullWidth, children, className, ...rest } = props;
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.full : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (props.as === 'a') {
    const { as: _as, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: string;
    };
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: string;
  };
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
