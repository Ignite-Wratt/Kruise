import React from 'react';

/** Seamless CSS marquee — duplicates its children once so the loop has no gap. */
export function KruiseMarquee({ children, className = '', fast = false }: { children: React.ReactNode; className?: string; fast?: boolean }) {
  return (
    <div className={`mq${fast ? ' mq--fast' : ''} ${className}`.trim()}>
      <div className="mq__track">
        <div className="mq__set">{children}</div>
        <div className="mq__set" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
