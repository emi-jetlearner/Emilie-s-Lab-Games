import { GameMetadata } from '../types';

export const GAMES: GameMetadata[] = [
  {
    id: 'crystal-growing',
    title: 'Crystal Growing',
    shortDescription: 'Drop supersaturated mineral solutions to nucleate and grow sparkling 3D crystals with customizable shapes and colors.',
    category: 'Chemistry & Mineralogy',
    themeColor: '#8B5CF6',
    accentBg: 'bg-purple-100 dark:bg-purple-950/40',
    accentText: 'text-purple-600 dark:text-purple-400',
    badge: 'Mineral Lab'
  },
  {
    id: 'dna-creatures',
    title: 'DNA Creatures',
    shortDescription: 'Breed cats, dogs, doves, and unicorns. Mix parental alleles to discover adorable offspring traits and Mendelian genetics.',
    category: 'Genetics & Biology',
    themeColor: '#EC4899',
    accentBg: 'bg-pink-100 dark:bg-pink-950/40',
    accentText: 'text-pink-600 dark:text-pink-400',
    badge: 'Adopt & Breed'
  },
  {
    id: 'circuit-testing',
    title: 'Circuit Testing',
    shortDescription: 'Assemble realistic 3D toy components in series and parallel. Power glowing lamps, spinning fans, and switches with batteries or hand generators.',
    category: 'Physics & Electronics',
    themeColor: '#F59E0B',
    accentBg: 'bg-amber-100 dark:bg-amber-950/40',
    accentText: 'text-amber-600 dark:text-amber-400',
    badge: 'Ohm Lab'
  },
  {
    id: 'catastrophe-simulations',
    title: 'Catastrophe Simulations',
    shortDescription: 'Trigger volcanic eruptions with glowing branching lava, simulate ocean tsunamis flooding shores, and test earthquake tremors.',
    category: 'Earth Sciences & Geology',
    themeColor: '#EF4444',
    accentBg: 'bg-rose-100 dark:bg-rose-950/40',
    accentText: 'text-rose-600 dark:text-rose-400',
    badge: 'Geo Hazard Lab'
  },
  {
    id: 'rocket-launching',
    title: 'Rocket Launching',
    shortDescription: 'Customize rocket stages and launch contrails with smoke, sparkles, rainbow, or stars. Fire your rocket into high orbit with real telemetry.',
    category: 'Aerospace Engineering',
    themeColor: '#3B82F6',
    accentBg: 'bg-blue-100 dark:bg-blue-950/40',
    accentText: 'text-blue-600 dark:text-blue-400',
    badge: 'Aerospace'
  },
  {
    id: 'defying-gravity',
    title: 'Defying Gravity',
    shortDescription: 'Drop apples, bowling balls, feathers, and gold bars across Earth, Moon, Mars, Jupiter, or custom G-force environments in vacuum or air.',
    category: 'Classical Mechanics',
    themeColor: '#10B981',
    accentBg: 'bg-emerald-100 dark:bg-emerald-950/40',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    badge: 'Galileo Chamber'
  }
];
