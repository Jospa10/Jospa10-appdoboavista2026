
export enum PlayerPosition {
  GK = 'Goleiro',
  DF = 'Defensor',
  MF = 'Meio-Campista',
  FW = 'Atacante'
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  goals: number;
  assists: number;
  matches: number;
  photo: string;
}

export interface Match {
  id: string;
  date: string;
  opponent: string;
  teamShield?: string;
  opponentShield?: string;
  location: string;
  type: 'Jogo' | 'Treino';
  score?: { team: number; opponent: number };
  status: 'upcoming' | 'finished' | 'canceled';
  technicalReview?: string;
  technicalSheet?: {
    scorers: string[];
    assists: string[];
    yellowCards: string[];
    redCards: string[];
  };
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface LeagueTeam {
  id: string;
  name: string;
  shield?: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  yellowCards: number;
  redCards: number;
}

export type TabType = 'home' | 'players' | 'calendar' | 'results' | 'stats' | 'attendance' | 'gallery' | 'symbols' | 'finance' | 'league';
