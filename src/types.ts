export type GameId = 
  | 'crystal-growing'
  | 'dna-creatures'
  | 'circuit-testing'
  | 'catastrophe-simulations'
  | 'rocket-launching'
  | 'defying-gravity';

export interface GameMetadata {
  id: GameId;
  title: string;
  shortDescription: string;
  category: string;
  themeColor: string;
  accentBg: string;
  accentText: string;
  badge: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}
