import React from 'react';

type IconProps = { size?: number; color?: string };
const base = (size = 20, color = 'currentColor'): React.SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color,
  strokeWidth: 2.25, strokeLinecap: 'round', strokeLinejoin: 'round',
});

export function Search({ size, color }: IconProps) {
  return <svg {...base(size, color)}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}
export function User({ size, color }: IconProps) {
  return <svg {...base(size, color)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
export function ShoppingBag({ size, color }: IconProps) {
  return <svg {...base(size, color)}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
}
export function ArrowRight({ size, color }: IconProps) {
  return <svg {...base(size, color)}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}
