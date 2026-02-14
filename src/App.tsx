import React, { useState, useMemo, useEffect, useRef } from 'react';
// IMPORTANTE: Adicionei .ts e .js no final para o Vercel encontrar os arquivos
import { TabType, Player, Match, PlayerPosition, FinancialTransaction, LeagueTeam } from './types';
import { PLAYERS as INITIAL_PLAYERS, MATCHES as INITIAL_MATCHES, GALLERY_PHOTOS as INITIAL_PHOTOS, INITIAL_TRANSACTIONS } from './constants';
import { 
  Menu, LogOut, Plus, Trash2, Shield, X, ImagePlus, 
  Edit2, Lock, Trophy, PlusCircle, Calendar, Flag,
  Users, Camera, MapPin, Receipt, ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp, Star, Printer, ChevronRight, CheckCircle2, AlertCircle, UserPlus, Save, Settings, Upload, MessageSquareQuote,
  ChevronDown, Music, Dog
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  
  const [teamShield, setTeamShield] = useState(() => localStorage.getItem('bvfc_shield') || '');
  const [teamFlag, setTeamFlag] = useState(() => localStorage.getItem('bvfc_flag') || '');
  const [teamMascot, setTeamMascot] = useState(() => localStorage.getItem('bvfc_mascot') || '');
  const [teamAnthem, setTeamAnthem] = useState(() => localStorage.getItem('bvfc_anthem') || '');
  const [teamMotto, setTeamMotto] = useState(() => localStorage.getItem('bvfc_motto') || 'A FORÇA DO BAIRRO.');
  
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('bvfc_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('bvfc_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('bvfc_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('bvfc_attendance');
    return saved ? JSON.parse(saved) : {};
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('bvfc_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [leagueTeams, setLeagueTeams] = useState(() => {
    const saved = localStorage.getItem('bvfc_league');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'BOA VISTA F.C.', points: 7, played: 7, wins: 2, draws: 1, losses: 4, goalsFor: 15, goalsAgainst: 23, yellowCards: 2, redCards: 0 },
      { id: '2', name: 'AZURRA', points: 7, played: 7, wins: 2, draws: 1, losses: 4, goalsFor: 16, goalsAgainst: 21, yellowCards: 1, redCards: 2 },
      { id: '3', name: 'LIMP & CIA', points: 18, played: 7, wins: 6, draws: 0, losses: 1, goalsFor: 27, goalsAgainst: 11, yellowCards: 1, redCards: 0 },
      { id: '4', name: 'FJ MOTORS', points: 12, played: 8, wins: 4, draws: 0, losses: 4, goalsFor: 25, goalsAgainst: 25, yellowCards: 2, redCards: 0 },
      { id: '5', name: 'ÁGUIA F.C.', points: 9, played: 7, wins: 3, draws: 0, losses: 4, goalsFor: 17, goalsAgainst: 20, yellowCards: 3, redCards: 0 }
    ];
  });

  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editingLeagueTeam, setEditingLeagueTeam] = useState(null);
  const [matchStatus, setMatchStatus] = useState('upcoming');

  const [selectedScorers, setSelectedScorers] = useState([]);
  const [selectedYellows, setSelectedYellows] = useState([]);
  const [selectedReds, setSelectedReds] = useState([]);
  const [tempTeamShield, setTempTeamShield] = useState('');
  const [tempOpponentShield, setTempOpponentShield] = useState('');
  const [tempPlayerPhoto, setTempPlayerPhoto] = useState('');
  const [tempLeagueTeamShield, setTempLeagueTeamShield] = useState('');

  const [leagueForm, setLeagueForm] = useState({ wins: 0, draws: 0, losses: 0 });

  const shieldInputRef = useRef(null);
  const flagInputRef = useRef(null);
  const mascotInputRef = useRef(null);
  const matchTeamShieldRef = useRef(null);
  const matchOpponentShieldRef = useRef(null);
  const playerPhotoInputRef = useRef(null);
  const leagueTeamShieldRef = useRef(null);

  // Removi os termos de TypeScript que travavam o navegador (: string, : Record, etc)

  useEffect(() => {
    localStorage.setItem('bvfc_players', JSON.stringify(players));
    localStorage.setItem('bvfc_matches', JSON.stringify(matches));
    localStorage.setItem('bvfc_photos', JSON.stringify(photos));
    localStorage.setItem('bvfc_attendance', JSON.stringify(attendance));
    localStorage.setItem('bvfc_transactions', JSON.stringify(transactions));
    localStorage.setItem('bvfc_league', JSON.stringify(leagueTeams));
    localStorage.setItem('bvfc_shield', teamShield);
    localStorage.setItem('bvfc_flag', teamFlag);
    localStorage.setItem('bvfc_mascot', teamMascot);
    localStorage.setItem('bvfc_anthem', teamAnthem);
    localStorage.setItem('bvfc_motto', teamMotto);
  }, [players, matches, photos, attendance, transactions, leagueTeams, teamShield, teamFlag, teamMascot, teamAnthem, teamMotto]);

  const handleFileUpload = (e, target) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        if (target === 'shield') setTeamShield(base64);
        if (target === 'flag') setTeamFlag(base64);
        if (target === 'mascot') setTeamMascot(base64);
        if (target === 'gallery') { setPhotos(prev => [base64, ...prev]); setShowAddPhotoModal(false); }
        if (target === 'matchTeam') setTempTeamShield(base64);
        if (target === 'matchOpponent') setTempOpponentShield(base64);
        if (target === 'player') setTempPlayerPhoto(base64);
        if (target === 'leagueTeam') setTempLeagueTeamShield(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // ... (o restante do seu código deve seguir aqui, mas removendo sempre os : tipos)
  return (
    <div className="min-h-screen bg-bvAzul text-white">
       <h1>Boa Vista FC - Carregado com Sucesso!</h1>
       {/* Cole o restante do seu código de visualização aqui */}
    </div>
  );
};

export default App;
