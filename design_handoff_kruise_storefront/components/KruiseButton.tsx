"use client";
import React from 'react';

export type ButtonVariant = 'primary' | 'accent' | 'flavor' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type Flavor = 'cherry' | 'tangerine' | 'lemon' | 'lime' | 'wave' | 'sky' | 'marine' | 'graphite';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  flavor?: Flavor;
  fullWidth?: boolean;
}

export function KruiseButton({ children, variant = 'primary', size = 'md', flavor = 'cherry', fullWidth = false, disabled = false, style = {}, ...rest }: ButtonProps) {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px', shadow: '0 3px 0 0' },
    md: { padding: '12px 24px', fontSize: '16px', shadow: '0 4px 0 0' },
    lg: { padding: '16px 32px', fontSize: '18px', shadow: '0 5px 0 0' },
  }[size];
  const flavorFill: Record<Flavor, string> = {
    cherry: 'var(--cherry)', tangerine: 'var(--tangerine)', lemon: 'var(--lemon)',
    lime: 'var(--lime)', wave: 'var(--wave)', sky: 'var(--sky)',
    marine: 'var(--marine)', graphite: 'var(--graphite)',
  };
  const flavorInk = (flavor === 'lemon' || flavor === 'tangerine' || flavor === 'sky') ? 'var(--ink-900)' : '#fff';
  const shadowInk = 'var(--ink-900)';

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: 'var(--blueberry)', color: '#fff', border: '3px solid var(--ink-900)', boxShadow: `${sizes.shadow} ${shadowInk}` },
    accent: { background: 'var(--cherry)', color: '#fff', border: '3px solid var(--ink-900)', boxShadow: `${sizes.shadow} ${shadowInk}` },
    flavor: { background: flavorFill[flavor], color: flavorInk, border: '3px solid var(--ink-900)', boxShadow: `${sizes.shadow} ${shadowInk}` },
    outline: { background: 'var(--white)', color: 'var(--blueberry-900)', border: '3px solid var(--ink-900)', boxShadow: `${sizes.shadow} ${shadowInk}` },
    ghost: { background: 'transparent', color: 'var(--blueberry)', border: '3px solid transparent', boxShadow: 'none' },
  };

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: sizes.fontSize, lineHeight: 1,
    padding: sizes.padding, borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
    display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : 'auto',
    alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'transform 120ms var(--ease-bounce), box-shadow 120ms var(--ease-bounce), background 120ms',
    opacity: disabled ? 0.5 : 1, userSelect: 'none',
    ...variants[variant], ...style,
  };

  const onDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || variant === 'ghost') return;
    e.currentTarget.style.transform = 'translateY(4px)';
    e.currentTarget.style.boxShadow = '0 0 0 0 var(--ink-900)';
  };
  const onUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || variant === 'ghost') return;
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = variants[variant].boxShadow as string;
  };

  return (
    <button type="button" disabled={disabled} style={base} onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp} {...rest}>
      {children}
    </button>
  );
}
