
import { Player, PlayerPosition, Match, FinancialTransaction } from './types';

export const PLAYERS: Player[] = [
  {
    id: '1',
    name: 'GABRIEL S.',
    number: 1,
    position: PlayerPosition.GK,
    goals: 0,
    assists: 0,
    matches: 10,
    photo: 'https://images.unsplash.com/photo-1526232762683-21527234359d?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'RAFAEL L.',
    number: 10,
    position: PlayerPosition.MF,
    goals: 5,
    assists: 8,
    matches: 12,
    photo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&h=200&auto=format&fit=crop'
  }
];

export const MATCHES: Match[] = [
  {
    id: 'm1',
    date: '2026-05-20T15:00:00',
    opponent: 'UNIDOS DA VILA',
    location: 'Arena Central',
    type: 'Jogo',
    status: 'upcoming'
  },
  {
    id: 'm2',
    date: '2026-05-10T10:00:00',
    opponent: 'REAL MATISSE',
    location: 'Campo do Boa Vista',
    type: 'Jogo',
    status: 'finished',
    score: { team: 3, opponent: 1 },
    technicalReview: 'Excelente vitória em casa. O time manteve a posse de bola e explorou bem as laterais.',
    technicalSheet: {
      scorers: ['RAFAEL L.', 'RAFAEL L.', 'GABRIEL S.'],
      assists: [],
      yellowCards: ['RAFAEL L.'],
      redCards: []
    }
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const GALLERY_PHOTOS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop'
];
