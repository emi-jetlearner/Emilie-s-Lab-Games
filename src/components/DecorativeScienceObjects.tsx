import React from 'react';

interface FloatingObject {
  id: string;
  type: 'microscope' | 'atom' | 'planet' | 'star' | 'flask' | 'test-tube' | 'magnet' | 'telescope' | 'dna';
  position: string;
  color: string;
  size: number;
  rotationSpeedClass: string;
  delay: string;
}

const DECORATIVE_ITEMS: FloatingObject[] = [
  // Top border
  { id: 'top-1', type: 'atom', position: 'top-3 left-[15%]', color: '#A855F7', size: 34, rotationSpeedClass: 'animate-slow-spin', delay: '0s' },
  { id: 'top-2', type: 'star', position: 'top-4 left-[38%]', color: '#FBBF24', size: 28, rotationSpeedClass: 'animate-reverse-spin', delay: '1s' },
  { id: 'top-3', type: 'planet', position: 'top-3 right-[35%]', color: '#38BDF8', size: 36, rotationSpeedClass: 'animate-slow-spin', delay: '2s' },
  { id: 'top-4', type: 'flask', position: 'top-4 right-[15%]', color: '#34D399', size: 32, rotationSpeedClass: 'animate-float', delay: '0.5s' },

  // Left border
  { id: 'left-1', type: 'microscope', position: 'top-[22%] left-3', color: '#818CF8', size: 38, rotationSpeedClass: 'animate-float', delay: '1.5s' },
  { id: 'left-2', type: 'dna', position: 'top-[48%] left-3', color: '#F472B6', size: 34, rotationSpeedClass: 'animate-reverse-spin', delay: '2.5s' },
  { id: 'left-3', type: 'test-tube', position: 'top-[75%] left-3', color: '#F87171', size: 32, rotationSpeedClass: 'animate-slow-spin', delay: '0.8s' },

  // Right border
  { id: 'right-1', type: 'telescope', position: 'top-[20%] right-3', color: '#60A5FA', size: 36, rotationSpeedClass: 'animate-float', delay: '0.3s' },
  { id: 'right-2', type: 'atom', position: 'top-[50%] right-3', color: '#C084FC', size: 34, rotationSpeedClass: 'animate-slow-spin', delay: '1.8s' },
  { id: 'right-3', type: 'magnet', position: 'top-[76%] right-3', color: '#FB923C', size: 34, rotationSpeedClass: 'animate-reverse-spin', delay: '2.2s' },

  // Bottom border
  { id: 'bot-1', type: 'star', position: 'bottom-4 left-[18%]', color: '#FCD34D', size: 26, rotationSpeedClass: 'animate-slow-spin', delay: '1.2s' },
  { id: 'bot-2', type: 'planet', position: 'bottom-3 left-[42%]', color: '#F43F5E', size: 34, rotationSpeedClass: 'animate-reverse-spin', delay: '0.7s' },
  { id: 'bot-3', type: 'flask', position: 'bottom-4 right-[38%]', color: '#2DD4BF', size: 30, rotationSpeedClass: 'animate-float', delay: '2.0s' },
  { id: 'bot-4', type: 'star', position: 'bottom-3 right-[16%]', color: '#A78BFA', size: 30, rotationSpeedClass: 'animate-slow-spin', delay: '1.6s' }
];

export const DecorativeScienceObjects: React.FC = () => {
  const renderIcon = (type: FloatingObject['type'], color: string, size: number) => {
    switch (type) {
      case 'atom':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
            <ellipse cx="20" cy="20" rx="17" ry="6" transform="rotate(30 20 20)" strokeOpacity="0.8" />
            <ellipse cx="20" cy="20" rx="17" ry="6" transform="rotate(-30 20 20)" strokeOpacity="0.8" />
            <ellipse cx="20" cy="20" rx="17" ry="6" transform="rotate(90 20 20)" strokeOpacity="0.8" />
            <circle cx="20" cy="20" r="3.5" fill={color} />
          </svg>
        );
      case 'microscope':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 34h16M20 34v-5M15 10l8 12M17 6l10 15M23 25a7 7 0 10-6.5-6.5M10 25h12" />
            <circle cx="15" cy="8" r="2" fill={color} />
          </svg>
        );
      case 'planet':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5">
            <circle cx="20" cy="20" r="11" fill={`${color}22`} stroke={color} />
            <path d="M6 24c4-7 18-12 28-6M8 20c3 6 17 9 24 2" stroke={color} strokeLinecap="round" />
            <circle cx="16" cy="16" r="2" fill={color} />
          </svg>
        );
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill={color} stroke={color} strokeWidth="1">
            <path d="M20 5l4.2 9.5 10.3.9-7.8 7 2.3 10.1-9-5.3-9 5.3 2.3-10.1-7.8-7 10.3-.9z" opacity="0.85" />
          </svg>
        );
      case 'flask':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8h8M18 8v7l-8 15a2 2 0 002 3h16a2 2 0 002-3l-8-15V8" />
            <path d="M13 27h14" strokeWidth="2" strokeDasharray="2 2" />
            <circle cx="17" cy="23" r="1.5" fill={color} />
            <circle cx="22" cy="25" r="1" fill={color} />
          </svg>
        );
      case 'test-tube':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 7h10M17 7v20a5 5 0 0010 0V7" transform="rotate(-25 20 20)" />
            <circle cx="20" cy="24" r="1.5" fill={color} />
          </svg>
        );
      case 'magnet':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 10v12a8 8 0 0016 0V10M12 15h6M22 15h6" />
            <path d="M10 10h4M26 10h4" strokeWidth="3" />
          </svg>
        );
      case 'telescope':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 16l18-9 4 7-18 9zM18 20l-6 15M22 18l5 17M15 29h8" />
          </svg>
        );
      case 'dna':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 8c10 8 10 16 0 24M30 8c-10 8-10 16 0 24" strokeOpacity="0.85" />
            <line x1="14" y1="12" x2="26" y2="12" />
            <line x1="18" y1="20" x2="22" y2="20" />
            <line x1="14" y1="28" x2="26" y2="28" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-85">
      {DECORATIVE_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`absolute ${item.position} transform-gpu transition-all duration-700 hidden sm:block`}
          style={{ animationDelay: item.delay }}
        >
          <div className={`${item.rotationSpeedClass} hover:scale-110 drop-shadow-sm`}>
            {renderIcon(item.type, item.color, item.size)}
          </div>
        </div>
      ))}
    </div>
  );
};
