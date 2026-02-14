
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TabType, Player, Match, PlayerPosition, FinancialTransaction, LeagueTeam } from './types';
import { PLAYERS as INITIAL_PLAYERS, MATCHES as INITIAL_MATCHES, GALLERY_PHOTOS as INITIAL_PHOTOS, INITIAL_TRANSACTIONS } from './constants';
import { 
  Menu, LogOut, Plus, Trash2, Shield, X, ImagePlus, 
  Edit2, Lock, Trophy, PlusCircle, Calendar, Flag,
  Users, Camera, MapPin, Receipt, ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp, Star, Printer, ChevronRight, CheckCircle2, AlertCircle, UserPlus, Save, Settings, Upload, MessageSquareQuote,
  ChevronDown, Music, Dog
} from 'lucide-react';

type AttendanceStatus = 'vou' | 'nao-vou' | 'aguardando';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  
  const [teamShield, setTeamShield] = useState<string>(() => localStorage.getItem('bvfc_shield') || '');
  const [teamFlag, setTeamFlag] = useState<string>(() => localStorage.getItem('bvfc_flag') || '');
  const [teamMascot, setTeamMascot] = useState<string>(() => localStorage.getItem('bvfc_mascot') || '');
  const [teamAnthem, setTeamAnthem] = useState<string>(() => localStorage.getItem('bvfc_anthem') || '');
  const [teamMotto, setTeamMotto] = useState<string>(() => localStorage.getItem('bvfc_motto') || 'A FORÇA DO BAIRRO.');
  
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('bvfc_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('bvfc_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });
  const [photos, setPhotos] = useState<string[]>(() => {
    const saved = localStorage.getItem('bvfc_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const saved = localStorage.getItem('bvfc_attendance');
    return saved ? JSON.parse(saved) : {};
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('bvfc_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>(() => {
    const saved = localStorage.getItem('bvfc_league');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'BOA VISTA F.C.', points: 7, played: 7, wins: 2, draws: 1, losses: 4, goalsFor: 15, goalsAgainst: 23, yellowCards: 2, redCards: 0 },
      { id: '2', name: 'AZURRA', points: 7, played: 7, wins: 2, draws: 1, losses: 4, goalsFor: 16, goalsAgainst: 21, yellowCards: 1, redCards: 2 },
      { id: '3', name: 'LIMP & CIA', points: 18, played: 7, wins: 6, draws: 0, losses: 1, goalsFor: 27, goalsAgainst: 11, yellowCards: 1, redCards: 0 },
      { id: '4', name: 'FJ MOTORS', points: 12, played: 8, wins: 4, draws: 0, losses: 4, goalsFor: 25, goalsAgainst: 25, yellowCards: 2, redCards: 0 },
      { id: '5', name: 'ÁGUIA F.C.', points: 9, played: 7, wins: 3, draws: 0, losses: 4, goalsFor: 17, goalsAgainst: 20, yellowCards: 3, redCards: 0 }
    ];
  });

  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editingLeagueTeam, setEditingLeagueTeam] = useState<LeagueTeam | null>(null);
  const [matchStatus, setMatchStatus] = useState<'upcoming' | 'finished'>('upcoming');

  const [selectedScorers, setSelectedScorers] = useState<string[]>([]);
  const [selectedYellows, setSelectedYellows] = useState<string[]>([]);
  const [selectedReds, setSelectedReds] = useState<string[]>([]);
  const [tempTeamShield, setTempTeamShield] = useState<string>('');
  const [tempOpponentShield, setTempOpponentShield] = useState<string>('');
  const [tempPlayerPhoto, setTempPlayerPhoto] = useState<string>('');
  const [tempLeagueTeamShield, setTempLeagueTeamShield] = useState<string>('');

  const [leagueForm, setLeagueForm] = useState({
    wins: 0,
    draws: 0,
    losses: 0
  });

  const shieldInputRef = useRef<HTMLInputElement>(null);
  const flagInputRef = useRef<HTMLInputElement>(null);
  const mascotInputRef = useRef<HTMLInputElement>(null);
  const matchTeamShieldRef = useRef<HTMLInputElement>(null);
  const matchOpponentShieldRef = useRef<HTMLInputElement>(null);
  const playerPhotoInputRef = useRef<HTMLInputElement>(null);
  const leagueTeamShieldRef = useRef<HTMLInputElement>(null);

  const tabNames: Record<TabType, string> = {
    home: 'Início', league: 'Tabela', players: 'Plantel', calendar: 'Agenda', results: 'Placares',
    stats: 'Estatísticas', attendance: 'Presença', gallery: 'Galeria', symbols: 'Símbolos', finance: 'Financeiro'
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
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

  const handleOpenLeagueModal = (team: LeagueTeam | null) => {
    setEditingLeagueTeam(team);
    if (team) {
      setTempLeagueTeamShield(team.shield || '');
      setLeagueForm({ wins: team.wins, draws: team.draws, losses: team.losses });
    } else {
      setTempLeagueTeamShield('');
      setLeagueForm({ wins: 0, draws: 0, losses: 0 });
    }
    setShowLeagueModal(true);
  };

  const handleOpenMatchModal = (match: Match | null) => {
    setEditingMatch(match);
    if (match) {
      setMatchStatus(match.status === 'finished' ? 'finished' : 'upcoming');
      setTempTeamShield(match.teamShield || teamShield);
      setTempOpponentShield(match.opponentShield || '');
      setSelectedScorers(match.technicalSheet?.scorers || []);
      setSelectedYellows(match.technicalSheet?.yellowCards || []);
      setSelectedReds(match.technicalSheet?.redCards || []);
    } else {
      setMatchStatus('upcoming');
      setTempTeamShield(teamShield);
      setTempOpponentShield('');
      setSelectedScorers([]);
      setSelectedYellows([]);
      setSelectedReds([]);
    }
    setShowMatchModal(true);
  };

  const statsCalculated = useMemo(() => {
    const goalsMap: Record<string, number> = {};
    const cardsMap: Record<string, { yellow: number; red: number }> = {};
    let wins = 0, draws = 0, losses = 0, totalGames = 0, totalGoals = 0;

    const finishedMatches = matches.filter(m => m.status === 'finished').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    finishedMatches.forEach(m => {
      totalGames++;
      if (m.score) {
        totalGoals += m.score.team;
        if (m.score.team > m.score.opponent) wins++;
        else if (m.score.team === m.score.opponent) draws++;
        else losses++;
      }
      
      m.technicalSheet?.scorers.forEach(name => {
        goalsMap[name] = (goalsMap[name] || 0) + 1;
      });

      m.technicalSheet?.yellowCards.forEach(name => {
        if (!cardsMap[name]) cardsMap[name] = { yellow: 0, red: 0 };
        cardsMap[name].yellow++;
      });

      m.technicalSheet?.redCards.forEach(name => {
        if (!cardsMap[name]) cardsMap[name] = { yellow: 0, red: 0 };
        cardsMap[name].red++;
      });
    });

    const leaderboard = Object.entries(goalsMap)
      .map(([name, goals]) => ({ name, goals }))
      .sort((a, b) => b.goals - a.goals);

    const cardsLeaderboard = Object.entries(cardsMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => (b.red * 10 + b.yellow) - (a.red * 10 + a.yellow));

    const lastMatch = finishedMatches[0];

    return { leaderboard, cardsLeaderboard, wins, draws, losses, totalGames, totalGoals, lastMatch };
  }, [matches]);

  const homeMatches = useMemo(() => {
    const finished = matches.filter(m => m.status === 'finished').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const upcoming = matches.filter(m => m.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    return { finished, upcoming };
  }, [matches]);

  const sortedLeague = useMemo(() => {
    return [...leagueTeams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const sgB = b.goalsFor - b.goalsAgainst;
      const sgA = a.goalsFor - a.goalsAgainst;
      if (sgB !== sgA) return sgB - sgA;
      return b.wins - a.wins;
    });
  }, [leagueTeams]);

  const confirmedPlayers = useMemo(() => {
    const list = players.filter(p => attendance[p.id] === 'vou');
    const posOrder = { [PlayerPosition.GK]: 1, [PlayerPosition.DF]: 2, [PlayerPosition.MF]: 3, [PlayerPosition.FW]: 4 };
    return [...list].sort((a, b) => posOrder[a.position] - posOrder[b.position]);
  }, [players, attendance]);

  const financialSummary = useMemo(() => transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expenses += t.amount;
    acc.balance = acc.income - acc.expenses;
    return acc;
  }, { income: 0, expenses: 0, balance: 0 }), [transactions]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const rows = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; font-size: 11px;">${new Date(t.date).toLocaleDateString('pt-BR')}</td>
        <td style="padding: 12px; font-weight: bold; font-size: 12px;">${t.description.toUpperCase()}</td>
        <td style="padding: 12px; font-size: 11px;">${t.name || '-'}</td>
        <td style="padding: 12px; text-align: right; color: ${t.type === 'income' ? '#10b981' : '#ef4444'}; font-weight: bold;">
          ${t.type === 'income' ? '+' : '-'} R$ ${t.amount.toFixed(2)}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>BOA VISTA FC - FINANCEIRO</title>
          <style>
            body { font-family: sans-serif; color: #003366; padding: 40px; margin: 0; }
            .header { border-bottom: 5px solid #D4AF37; padding-bottom: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; }
            .summary { background: #f8fafc; padding: 20px; border-radius: 15px; display: flex; justify-content: space-around; margin: 20px 0; border: 1px solid #ddd; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #003366; color: white; padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="header">
            ${teamShield ? `<img src="${teamShield}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px;">` : '<div style="width:100px; height:100px; background:#003366; border-radius:50%; margin-bottom: 10px;"></div>'}
            <h1 style="margin: 0; font-size: 28px;">BOA VISTA FC</h1>
            <p style="margin: 5px 0; font-weight: bold; color: #D4AF37;">RELATÓRIO FINANCEIRO OFICIAL</p>
            <small>Emissão: ${new Date().toLocaleDateString('pt-BR')}</small>
          </div>
          <div class="summary">
            <div><small>ENTRADAS</small><br><b style="color: #10b981; font-size: 18px;">R$ ${financialSummary.income.toFixed(2)}</b></div>
            <div><small>SAÍDAS</small><br><b style="color: #ef4444; font-size: 18px;">R$ ${financialSummary.expenses.toFixed(2)}</b></div>
            <div><small>SALDO EM CAIXA</small><br><b style="font-size: 22px;">R$ ${financialSummary.balance.toFixed(2)}</b></div>
          </div>
          <table>
            <thead><tr><th>DATA</th><th>DESCRIÇÃO</th><th>RESPONSÁVEL</th><th style="text-align:right">VALOR</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-10 animate-in fade-in pb-20">
            {/* HERO CARD PRINCIPAL */}
            <div className="bg-bvBlue p-8 md:p-12 rounded-[3rem] text-white border-l-[15px] border-bvGold shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="relative z-10 flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">
                    BOA VISTA FC <br/>
                    {isAdmin ? (
                      <input 
                        className="bg-white/10 border-b-2 border-bvGold outline-none w-full max-w-lg text-bvGold placeholder:text-bvGold/30 p-2 rounded-lg text-xl"
                        value={teamMotto}
                        onChange={(e) => setTeamMotto(e.target.value)}
                        placeholder="Edite o lema do time..."
                      />
                    ) : (
                      <span className="text-bvGold text-xl md:text-2xl block mt-1">{teamMotto}</span>
                    )}
                  </h2>
                  <p className="text-[10px] md:text-xs font-bold opacity-50 italic tracking-widest uppercase mb-6">União, Garra e Respeito.</p>
                  
                  {/* QUICK STATS NA HOME */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                     <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl text-center min-w-[70px]">
                        <p className="text-bvGold font-black text-lg leading-none">{statsCalculated.totalGames}</p>
                        <p className="text-[6px] uppercase font-bold opacity-60">Jogos</p>
                     </div>
                     <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl text-center min-w-[70px]">
                        <p className="text-emerald-400 font-black text-lg leading-none">{statsCalculated.wins}</p>
                        <p className="text-[6px] uppercase font-bold opacity-60">Vitórias</p>
                     </div>
                     <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl text-center min-w-[70px]">
                        <p className="text-bvGold font-black text-lg leading-none">{statsCalculated.totalGoals}</p>
                        <p className="text-[6px] uppercase font-bold opacity-60">Gols</p>
                     </div>
                     <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl text-center min-w-[70px]">
                        <p className="text-blue-300 font-black text-lg leading-none">{players.length}</p>
                        <p className="text-[6px] uppercase font-bold opacity-60">Atletas</p>
                     </div>
                  </div>

                  <div className="mt-6 flex gap-3 justify-center md:justify-start">
                     <button onClick={() => setActiveTab('league')} className="bg-bvGold text-bvBlue px-5 py-2 rounded-xl font-black italic uppercase text-[8px] shadow-xl hover:scale-105 transition-transform">Tabela Master</button>
                     <button onClick={() => setActiveTab('calendar')} className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-xl font-black italic uppercase text-[8px] border border-white/20 hover:bg-white/20 transition-all">Próximos Jogos</button>
                  </div>
               </div>
               <div className="relative flex flex-col items-center gap-4">
                  <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center border-4 border-bvGold shadow-2xl overflow-hidden">
                    {teamShield ? <img src={teamShield} className="w-full h-full object-contain p-4" /> : <Shield size={60} className="text-bvBlue" />}
                  </div>
               </div>
            </div>

            {/* CARDS DE JOGO (ÚLTIMO E PRÓXIMO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* ÚLTIMO JOGO */}
               <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-bvBlue relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <Shield size={120} className="text-bvBlue" />
                  </div>
                  <span className="absolute -top-4 left-8 bg-bvBlue text-white px-4 py-1 rounded-full text-[8px] font-black uppercase italic tracking-widest">Último Resultado</span>
                  {homeMatches.finished ? (
                     <div className="flex flex-col items-center gap-6 relative z-10">
                        <div className="flex items-center justify-between w-full">
                           <div className="flex flex-col items-center gap-2 flex-1">
                              <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-bvBlue/10 flex items-center justify-center overflow-hidden shadow-sm">
                                 {homeMatches.finished.teamShield ? <img src={homeMatches.finished.teamShield} className="h-full object-contain p-2" /> : <Shield className="text-bvBlue opacity-20" />}
                              </div>
                              <span className="text-[9px] font-black text-bvBlue uppercase">BOA VISTA</span>
                           </div>
                           <div className="flex flex-col items-center px-4">
                              <div className="text-4xl font-black italic text-bvBlue drop-shadow-md">
                                 {homeMatches.finished.score?.team} <span className="text-bvGold opacity-40 mx-2">-</span> {homeMatches.finished.score?.opponent}
                              </div>
                              <span className="text-[8px] font-bold text-gray-400 uppercase mt-2">{new Date(homeMatches.finished.date).toLocaleDateString()}</span>
                           </div>
                           <div className="flex flex-col items-center gap-2 flex-1">
                              <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-bvGold/10 flex items-center justify-center overflow-hidden shadow-sm">
                                 {homeMatches.finished.opponentShield ? <img src={homeMatches.finished.opponentShield} className="h-full object-contain p-2" /> : <Shield className="text-gray-200" />}
                              </div>
                              <span className="text-[9px] font-black text-gray-400 uppercase truncate max-w-[80px]">{homeMatches.finished.opponent}</span>
                           </div>
                        </div>
                        <button onClick={() => setActiveTab('results')} className="w-full py-4 bg-gray-50 rounded-2xl font-black italic uppercase text-[9px] text-bvBlue border-2 border-bvBlue/5 hover:bg-bvBlue hover:text-white transition-all shadow-sm">Detalhes da Súmula</button>
                     </div>
                  ) : <div className="p-16 text-center text-gray-300 italic font-black uppercase">Nenhum resultado registrado.</div>}
               </div>

               {/* PRÓXIMO JOGO */}
               <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-bvGold relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <Calendar size={120} className="text-bvGold" />
                  </div>
                  <span className="absolute -top-4 left-8 bg-bvGold text-bvBlue px-4 py-1 rounded-full text-[8px] font-black uppercase italic tracking-widest">Próximo Jogo</span>
                  {homeMatches.upcoming ? (
                     <div className="flex flex-col items-center gap-6 relative z-10">
                        <div className="flex items-center justify-between w-full">
                           <div className="flex flex-col items-center gap-2 flex-1">
                              <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-bvBlue/10 flex items-center justify-center overflow-hidden shadow-sm">
                                 {homeMatches.upcoming.teamShield ? <img src={homeMatches.upcoming.teamShield} className="h-full object-contain p-2" /> : <Shield className="text-bvBlue opacity-20" />}
                              </div>
                              <span className="text-[9px] font-black text-bvBlue uppercase">BOA VISTA</span>
                           </div>
                           <div className="flex flex-col items-center gap-1 px-4">
                              <span className="text-bvGold font-black italic uppercase text-[12px] tracking-tighter">CONFRONTO</span>
                              <div className="bg-bvBlue text-white px-4 py-2 rounded-xl text-[12px] font-black italic shadow-lg">
                                 {new Date(homeMatches.upcoming.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                           </div>
                           <div className="flex flex-col items-center gap-2 flex-1">
                              <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-bvGold/10 flex items-center justify-center overflow-hidden shadow-sm">
                                 {homeMatches.upcoming.opponentShield ? <img src={homeMatches.upcoming.opponentShield} className="h-full object-contain p-2" /> : <Shield className="text-gray-200" />}
                              </div>
                              <span className="text-[9px] font-black text-gray-400 uppercase truncate max-w-[80px]">{homeMatches.upcoming.opponent}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] bg-gray-100 px-6 py-2 rounded-full border border-gray-200">
                           <MapPin size={12} className="text-bvGold"/> {homeMatches.upcoming.location}
                        </div>
                        <button onClick={() => setActiveTab('attendance')} className="w-full py-4 bg-bvGold text-bvBlue rounded-2xl font-black italic uppercase text-[9px] shadow-lg hover:scale-[1.02] transition-all">Confirmar Presença</button>
                     </div>
                  ) : <div className="p-16 text-center text-gray-300 italic font-black uppercase">Nenhum jogo agendado.</div>}
               </div>
            </div>
          </div>
        );

      case 'calendar':
        const upcoming = matches.filter(m => m.status === 'upcoming');
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border">
                <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">AGENDA DE JOGOS</h3>
                {isAdmin && <button onClick={() => handleOpenMatchModal(null)} className="bg-bvBlue text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase italic shadow-lg">AGENDAR JOGO</button>}
             </div>
             <div className="grid gap-6">
                {upcoming.length > 0 ? upcoming.map(m => (
                  <div key={m.id} className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-transparent hover:border-bvGold transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="bg-bvBlue p-4 rounded-2xl text-center min-w-[110px] text-white border-b-4 border-bvGold">
                        <p className="text-xl font-black italic mb-1">{new Date(m.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</p>
                        <p className="text-[10px] font-bold text-bvGold uppercase tracking-widest">{new Date(m.date).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</p>
                     </div>
                     <div className="flex-1 text-center md:text-left flex items-center gap-4">
                        <div className="flex -space-x-3">
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                              {m.teamShield ? <img src={m.teamShield} className="h-full object-contain p-2" /> : <Shield size={20} className="text-bvBlue opacity-20" />}
                           </div>
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                              {m.opponentShield ? <img src={m.opponentShield} className="h-full object-contain p-2" /> : <Shield size={20} className="text-gray-200" />}
                           </div>
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-bvBlue uppercase italic mb-1">{m.opponent}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center justify-center md:justify-start gap-2">
                              <MapPin size={14} className="text-bvGold"/> {m.location}
                           </p>
                        </div>
                     </div>
                     {isAdmin && <button onClick={() => handleOpenMatchModal(m)} className="p-4 bg-gray-50 rounded-2xl text-bvBlue hover:bg-bvGold hover:text-white transition-all shadow-sm"><Edit2 size={20}/></button>}
                  </div>
                )) : (
                  <div className="p-24 text-center border-4 border-dashed rounded-[3rem] text-gray-300">
                    <Calendar size={60} className="mx-auto mb-4 opacity-20" />
                    <p className="font-black italic uppercase tracking-tighter text-xl">Nenhum compromisso agendado.</p>
                    <p className="text-xs font-bold mt-2">Novas partidas aparecerão aqui após o cadastro.</p>
                  </div>
                )}
             </div>
          </div>
        );

      case 'symbols':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ESCUDO */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[8px] border-bvBlue text-center flex flex-col items-center">
                   <h4 className="font-black text-bvBlue uppercase italic mb-6 tracking-widest text-[10px]">ESCUDO</h4>
                   <div onClick={() => isAdmin && shieldInputRef.current?.click()} className="w-32 h-32 rounded-full border-4 border-dashed border-bvGold flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 relative group transition-all hover:scale-105 shadow-inner">
                      {teamShield ? <img src={teamShield} className="w-full h-full object-contain p-4" /> : <Shield size={48} className="text-gray-200" />}
                      {isAdmin && <div className="absolute inset-0 bg-bvBlue/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={24} className="text-white" /></div>}
                   </div>
                   <input type="file" ref={shieldInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'shield')} />
                </div>

                {/* BANDEIRA */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[8px] border-bvGold text-center flex flex-col items-center">
                   <h4 className="font-black text-bvBlue uppercase italic mb-6 tracking-widest text-[10px]">BANDEIRA</h4>
                   <div onClick={() => isAdmin && flagInputRef.current?.click()} className="w-32 h-32 rounded-[2rem] border-4 border-dashed border-bvBlue flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 relative group transition-all hover:scale-105 shadow-inner">
                      {teamFlag ? <img src={teamFlag} className="w-full h-full object-cover" /> : <Flag size={48} className="text-gray-200" />}
                      {isAdmin && <div className="absolute inset-0 bg-bvGold/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={24} className="text-white" /></div>}
                   </div>
                   <input type="file" ref={flagInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'flag')} />
                </div>

                {/* MASCOTE */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[8px] border-bvBlue text-center flex flex-col items-center">
                   <h4 className="font-black text-bvBlue uppercase italic mb-6 tracking-widest text-[10px]">MASCOTE</h4>
                   <div onClick={() => isAdmin && mascotInputRef.current?.click()} className="w-32 h-32 rounded-[2rem] border-4 border-dashed border-bvGold flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 relative group transition-all hover:scale-105 shadow-inner">
                      {teamMascot ? <img src={teamMascot} className="w-full h-full object-contain p-4" /> : <Dog size={48} className="text-gray-200" />}
                      {isAdmin && <div className="absolute inset-0 bg-bvBlue/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={24} className="text-white" /></div>}
                   </div>
                   <input type="file" ref={mascotInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'mascot')} />
                </div>

                {/* HINO */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[8px] border-bvGold text-center flex flex-col items-center relative overflow-hidden">
                   <h4 className="font-black text-bvBlue uppercase italic mb-6 tracking-widest text-[10px]">HINO</h4>
                   <div className="w-32 h-32 rounded-full bg-bvBlue/5 flex items-center justify-center text-bvBlue relative group shadow-inner border border-bvBlue/10">
                      <Music size={48} />
                      {isAdmin && (
                        <button onClick={() => {
                          const val = prompt("Cole a letra do hino oficial do Boa Vista FC:", teamAnthem);
                          if (val !== null) setTeamAnthem(val);
                        }} className="absolute inset-0 bg-bvGold/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                           <Edit2 size={24} className="text-bvBlue" />
                        </button>
                      )}
                   </div>
                   {teamAnthem && !isAdmin && (
                     <button 
                      onClick={() => alert(`LETRA DO HINO:\n\n${teamAnthem}`)}
                      className="mt-4 text-[9px] font-black text-bvBlue uppercase italic border-b border-bvBlue"
                     >
                       Ver Letra Completa
                     </button>
                   )}
                </div>
             </div>

             {teamAnthem && (
               <div className="bg-white p-10 rounded-[3rem] shadow-lg border-2 border-bvBlue/5 text-center">
                  <h3 className="text-xl font-black text-bvBlue uppercase italic mb-6 flex items-center justify-center gap-3">
                    <Music className="text-bvGold" /> LETRA DO HINO OFICIAL
                  </h3>
                  <div className="max-w-xl mx-auto whitespace-pre-line text-sm font-bold text-gray-500 italic leading-relaxed">
                    {teamAnthem}
                  </div>
               </div>
             )}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             {/* PAINEL DE DESEMPENHO GERAL */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border text-center border-b-8 border-bvBlue">
                   <p className="text-3xl font-black text-bvBlue italic leading-none">{statsCalculated.totalGames}</p>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">JOGOS</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[2rem] shadow-sm border border-emerald-100 text-center border-b-8 border-emerald-500">
                   <p className="text-3xl font-black text-emerald-600 italic leading-none">{statsCalculated.wins}</p>
                   <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-2">VITÓRIAS</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-[2rem] shadow-sm border border-yellow-100 text-center border-b-8 border-yellow-400">
                   <p className="text-3xl font-black text-yellow-600 italic leading-none">{statsCalculated.draws}</p>
                   <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest mt-2">EMPATES</p>
                </div>
                <div className="bg-red-50 p-6 rounded-[2rem] shadow-sm border border-red-100 text-center border-b-8 border-red-500">
                   <p className="text-3xl font-black text-red-600 italic leading-none">{statsCalculated.losses}</p>
                   <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mt-2">DERROTAS</p>
                </div>
             </div>

             {/* ANÁLISE DO PROFESSOR */}
             {statsCalculated.lastMatch && (
                <div className="bg-bvBlue p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-[15px] border-bvGold">
                   <MessageSquareQuote size={120} className="absolute -right-8 -top-8 text-white/5" />
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black text-bvGold uppercase italic mb-6 tracking-tighter flex items-center gap-3">
                         <Star size={24}/> ANÁLISE TÉCNICA DO ÚLTIMO JOGO
                      </h3>
                      <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10">
                         <p className="text-white font-bold italic leading-relaxed text-sm">
                            {statsCalculated.lastMatch.technicalReview || "O treinador ainda não publicou a análise técnica para este confronto."}
                         </p>
                         <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                            <div>
                               <p className="text-[9px] font-black text-bvGold uppercase tracking-widest">Confronto Recente</p>
                               <p className="text-white text-[10px] font-bold uppercase italic">vs {statsCalculated.lastMatch.opponent} • {new Date(statsCalculated.lastMatch.date).toLocaleDateString()}</p>
                            </div>
                            {isAdmin && (
                               <button onClick={() => handleOpenMatchModal(statsCalculated.lastMatch)} className="flex items-center gap-2 px-6 py-3 bg-bvGold text-bvBlue rounded-xl font-black text-[10px] uppercase italic shadow-lg hover:scale-105 transition-transform">
                                 <Edit2 size={14}/> EDITAR ANÁLISE
                               </button>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ARTILHARIA */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border text-center">
                   <h3 className="text-xl font-black text-bvBlue uppercase italic mb-8 border-b-4 border-bvGold inline-block pb-2 tracking-tighter">ARTILHARIA</h3>
                   <div className="grid gap-3">
                      {statsCalculated.leaderboard.length > 0 ? statsCalculated.leaderboard.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-l-8 border-bvBlue shadow-sm hover:bg-white transition-all">
                            <div className="flex items-center gap-3">
                               <span className="text-xl font-black text-bvGold italic leading-none">#{idx + 1}</span>
                               <span className="text-sm font-black text-bvBlue uppercase italic truncate max-w-[150px]">{item.name}</span>
                            </div>
                            <span className="bg-bvBlue text-white px-4 py-1.5 rounded-full font-black italic text-[10px] shadow-md">{item.goals} GOLS</span>
                         </div>
                      )) : <p className="p-10 text-gray-300 italic font-black uppercase text-xs">Nenhum gol registrado.</p>}
                   </div>
                </div>

                {/* CONTROLE DISCIPLINAR (CARTÕES) */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border text-center">
                   <h3 className="text-xl font-black text-bvBlue uppercase italic mb-8 border-b-4 border-bvGold inline-block pb-2 tracking-tighter">DISCIPLINA (CARTÕES)</h3>
                   <div className="grid gap-3">
                      {statsCalculated.cardsLeaderboard.length > 0 ? statsCalculated.cardsLeaderboard.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-l-8 border-gray-400 shadow-sm hover:bg-white transition-all">
                            <div className="flex items-center gap-3">
                               <span className="text-sm font-black text-bvBlue uppercase italic truncate max-w-[150px]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                               {item.yellow > 0 && (
                                 <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-lg border border-yellow-400/30">
                                    <div className="w-3 h-4 bg-yellow-400 rounded-sm shadow-sm"></div>
                                    <span className="text-[10px] font-black text-bvBlue">{item.yellow}</span>
                                 </div>
                               )}
                               {item.red > 0 && (
                                 <div className="flex items-center gap-1 bg-red-600/20 px-3 py-1 rounded-lg border border-red-600/30">
                                    <div className="w-3 h-4 bg-red-600 rounded-sm shadow-sm"></div>
                                    <span className="text-[10px] font-black text-red-600">{item.red}</span>
                                 </div>
                               )}
                            </div>
                         </div>
                      )) : <p className="p-10 text-gray-300 italic font-black uppercase text-xs">Nenhum cartão registrado.</p>}
                   </div>
                </div>
             </div>
          </div>
        );

      case 'results':
        const results = matches.filter(m => m.status === 'finished');
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="bg-white p-8 rounded-[2rem] shadow-sm border flex justify-between items-center">
                <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">HISTÓRICO DE PLACARES</h3>
                {isAdmin && <button onClick={() => handleOpenMatchModal(null)} className="bg-bvBlue text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase italic shadow-lg">LANÇAR PLACAR</button>}
             </div>
             <div className="grid gap-6">
                {results.length > 0 ? results.map(m => (
                   <div key={m.id} className="bg-white p-6 rounded-[2.5rem] shadow-md border-2 border-transparent hover:border-bvGold transition-all">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b">
                         <div className="bg-bvBlue p-4 rounded-2xl text-center min-w-[100px] text-white border-b-4 border-bvGold">
                            <p className="text-xs font-black italic">{new Date(m.date).toLocaleDateString('pt-BR')}</p>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center gap-1">
                               <div className="w-14 h-14 bg-gray-50 rounded-2xl border flex items-center justify-center overflow-hidden shadow-sm">
                                  {m.teamShield ? <img src={m.teamShield} className="h-full object-contain p-2" /> : <Shield size={20} className="text-bvBlue opacity-20" />}
                               </div>
                               <span className="text-[8px] font-black text-bvBlue uppercase">BOA VISTA</span>
                            </div>
                            <div className="bg-bvBlue text-white px-8 py-3 rounded-2xl font-black text-3xl italic shadow-xl border-b-4 border-bvGold">
                               {m.score?.team} <span className="text-bvGold mx-2 opacity-50">X</span> {m.score?.opponent}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                               <div className="w-14 h-14 bg-gray-50 rounded-2xl border flex items-center justify-center overflow-hidden shadow-sm">
                                  {m.opponentShield ? <img src={m.opponentShield} className="h-full object-contain p-2" /> : <Shield size={20} className="text-gray-200" />}
                               </div>
                               <span className="text-[8px] font-black text-gray-400 uppercase truncate max-w-[70px]">{m.opponent}</span>
                            </div>
                         </div>
                         {isAdmin && <button onClick={() => handleOpenMatchModal(m)} className="p-4 text-bvBlue hover:text-bvGold transition-all bg-gray-50 rounded-2xl"><Edit2 size={20}/></button>}
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-4 text-center justify-center md:justify-start">
                         {m.technicalSheet?.scorers && m.technicalSheet.scorers.length > 0 && (
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-bvBlue italic">GOLS ⚽:</span>
                               <span className="text-[10px] font-bold text-gray-500 uppercase italic">{m.technicalSheet.scorers.join(', ')}</span>
                            </div>
                         )}
                         {m.technicalSheet?.yellowCards && m.technicalSheet.yellowCards.length > 0 && (
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-yellow-500 italic">🟨:</span>
                               <span className="text-[10px] font-bold text-gray-500 uppercase italic">{m.technicalSheet.yellowCards.join(', ')}</span>
                            </div>
                         )}
                         {m.technicalSheet?.redCards && m.technicalSheet.redCards.length > 0 && (
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-red-600 italic">🟥:</span>
                               <span className="text-[10px] font-bold text-gray-500 uppercase italic">{m.technicalSheet.redCards.join(', ')}</span>
                            </div>
                         )}
                      </div>
                   </div>
                )) : <div className="p-20 text-center text-gray-300 italic font-black uppercase">Nenhum resultado finalizado.</div>}
             </div>
          </div>
        );

      case 'players':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border flex justify-between items-center">
                <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">ELENCO OFICIAL</h3>
                {isAdmin && (
                  <button onClick={() => { setTempPlayerPhoto(''); setShowPlayerModal(true); }} className="bg-bvBlue text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase italic shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    <UserPlus size={16}/> CADASTRAR ATLETA
                  </button>
                )}
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {players.length > 0 ? players.map(p => (
                   <div key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-md text-center border-2 border-transparent hover:border-bvGold transition-all relative group">
                      <div className="w-24 h-24 bg-gray-100 rounded-[1.5rem] mx-auto mb-4 overflow-hidden border-2 border-bvBlue shadow-lg">
                        <img src={p.photo} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-4 right-4 bg-bvBlue text-white w-8 h-8 rounded-full flex items-center justify-center font-black italic border-2 border-bvGold text-[10px]">{p.number}</div>
                      <p className="text-sm font-black text-bvBlue uppercase italic leading-none truncate">{p.name}</p>
                      <p className="text-[9px] font-bold text-bvGold uppercase tracking-widest mt-1">{p.position}</p>
                      {isAdmin && <button onClick={() => setPlayers(prev => prev.filter(x => x.id !== p.id))} className="mt-4 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>}
                   </div>
                )) : <div className="col-span-full p-20 text-center text-gray-300 italic border-4 border-dashed rounded-[3rem] font-black uppercase">Nenhum jogador cadastrado.</div>}
             </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-10 animate-in fade-in pb-20">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
                <h3 className="text-xl font-black text-bvBlue uppercase italic mb-8 tracking-tighter flex items-center gap-3">
                   <Clock size={24} className="text-bvGold" /> CHAMADA PRÓXIMO COMPROMISSO
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                   {players.map(p => (
                     <div key={p.id} className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${attendance[p.id] === 'vou' ? 'bg-emerald-50 border-emerald-500 shadow-emerald-100' : attendance[p.id] === 'nao-vou' ? 'bg-red-50 border-red-500 shadow-red-100' : 'bg-gray-50 border-transparent shadow-sm'}`}>
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                           <img src={p.photo} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-black uppercase italic text-bvBlue truncate w-full text-center leading-none">{p.name}</span>
                        <div className="flex flex-col gap-1 w-full">
                           <button onClick={() => setAttendance({...attendance, [p.id]: 'vou'})} className={`w-full py-1.5 text-[8px] font-black rounded-lg transition-colors ${attendance[p.id] === 'vou' ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-400'}`}>CONFIRMADO</button>
                           <button onClick={() => setAttendance({...attendance, [p.id]: 'nao-vou'})} className={`w-full py-1.5 text-[8px] font-black rounded-lg transition-colors ${attendance[p.id] === 'nao-vou' ? 'bg-red-600 text-white' : 'bg-white border text-gray-400'}`}>AUSENTE</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-bvBlue p-8 rounded-[3rem] shadow-2xl border-t-[10px] border-bvGold">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6 text-center">CONFIRMADOS POR POSIÇÃO</h3>
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl">
                   <table className="w-full text-left">
                      <thead className="bg-bvGold text-bvBlue text-[10px] font-black uppercase italic border-b">
                         <tr>
                            <th className="p-5">POSIÇÃO</th>
                            <th className="p-5">ATLETA</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y font-bold text-bvBlue">
                         {confirmedPlayers.length > 0 ? confirmedPlayers.map(p => (
                            <tr key={p.id} className="hover:bg-bvGold/5 transition-colors border-b last:border-0">
                               <td className="p-5 text-[11px] font-black uppercase text-bvGold italic">{p.position}</td>
                               <td className="p-5 text-sm font-black uppercase italic">{p.name}</td>
                            </tr>
                         )) : (
                            <tr><td colSpan={2} className="p-20 text-center text-gray-300 italic font-black uppercase">Nenhuma confirmação registrada.</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-md text-center border-b-8 border-bvGold">
                   <p className="text-4xl font-black text-bvBlue italic leading-none mb-2">R$ {financialSummary.balance.toFixed(2)}</p>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SALDO EM CAIXA</p>
                </div>
                <button onClick={() => isAdmin && setShowTransactionModal(true)} className="bg-bvBlue text-white p-8 rounded-3xl font-black uppercase italic shadow-xl hover:brightness-110 flex items-center justify-center gap-4 transition-all">
                  <PlusCircle size={24} /> NOVO LANÇAMENTO
                </button>
                <button onClick={handlePrint} className="bg-bvGold text-bvBlue p-8 rounded-3xl font-black uppercase italic shadow-xl hover:brightness-110 flex items-center justify-center gap-4 transition-all">
                  <Printer size={24} /> GERAR RELATÓRIO PDF
                </button>
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border">
                <h3 className="text-xl font-black text-bvBlue uppercase italic mb-8 flex items-center gap-3">
                   <Receipt size={24} className="text-bvGold" /> EXTRATO FINANCEIRO
                </h3>
                <div className="space-y-3">
                   {transactions.map(t => (
                      <div key={t.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-[2rem] border-l-8 border-gray-200 hover:bg-white transition-all shadow-sm">
                         <div>
                            <p className="text-sm font-black text-bvBlue uppercase italic">{t.description}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(t.date).toLocaleDateString()} • {t.name || 'Geral'}</p>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className={`text-xl font-black italic ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                               {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                            </span>
                            {isAdmin && <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== t.id))} className="text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'league':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border overflow-hidden">
                <div className="flex justify-between items-center mb-8 border-l-8 border-bvGold pl-4">
                   <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">CAMPEONATO MASTER CRB</h3>
                   {isAdmin && (
                     <button onClick={() => handleOpenLeagueModal(null)} className="bg-bvBlue text-white p-3 rounded-xl shadow-lg flex items-center gap-2 font-black italic text-[10px] uppercase">
                        <Settings size={16}/> ATUALIZAR TABELA
                     </button>
                   )}
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-bvBlue text-white text-[10px] font-black italic uppercase">
                         <tr>
                            <th className="p-4">POS</th>
                            <th className="p-4">EQUIPES</th>
                            <th className="p-4 text-center">PTS</th>
                            <th className="p-4 text-center">J</th>
                            <th className="p-4 text-center">V</th>
                            <th className="p-4 text-center">E</th>
                            <th className="p-4 text-center">D</th>
                            <th className="p-4 text-center">GP</th>
                            <th className="p-4 text-center">GC</th>
                            <th className="p-4 text-center">SG</th>
                            <th className="p-4 text-center">CA</th>
                            <th className="p-4 text-center">CV</th>
                            <th className="p-4 text-center">%</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y font-bold text-bvBlue">
                         {sortedLeague.map((team, idx) => {
                           const sg = team.goalsFor - team.goalsAgainst;
                           const aprov = team.played > 0 ? Math.round((team.points / (team.played * 3)) * 100) : 0;
                           const isBV = team.name.includes('BOA VISTA');
                           return (
                              <tr key={team.id} className={`${isBV ? 'bg-bvGold/10' : 'hover:bg-gray-50'} transition-colors`}>
                                 <td className={`p-4 font-black italic ${idx < 4 ? 'text-bvGold' : 'text-bvBlue opacity-50'}`}>{idx + 1}º</td>
                                 <td className="p-4 flex items-center gap-3">
                                    {isBV ? (teamShield ? <img src={teamShield} className="w-6 h-6 object-contain" /> : <Shield size={16} className="text-bvBlue" />) : (team.shield ? <img src={team.shield} className="w-6 h-6 object-contain" /> : <Shield size={16} className="text-gray-200" />)}
                                    <span className={isBV ? 'font-black' : ''}>{team.name}</span>
                                 </td>
                                 <td className="p-4 text-center font-black text-bvBlue italic bg-gray-50/50">{team.points}</td>
                                 <td className="p-4 text-center">{team.played}</td>
                                 <td className="p-4 text-center">{team.wins}</td>
                                 <td className="p-4 text-center">{team.draws}</td>
                                 <td className="p-4 text-center">{team.losses}</td>
                                 <td className="p-4 text-center text-emerald-600">{team.goalsFor}</td>
                                 <td className="p-4 text-center text-red-600">{team.goalsAgainst}</td>
                                 <td className={`p-4 text-center font-black ${sg > 0 ? 'text-emerald-600' : sg < 0 ? 'text-red-600' : ''}`}>{sg}</td>
                                 <td className="p-4 text-center"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[9px]">{team.yellowCards}</span></td>
                                 <td className="p-4 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px]">{team.redCards}</span></td>
                                 <td className="p-4 text-center text-[10px] opacity-60 italic">{aprov}%</td>
                              </tr>
                           );
                         })}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border flex justify-between items-center">
                <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">GALERIA DE MOMENTOS</h3>
                {isAdmin && <button onClick={() => setShowAddPhotoModal(true)} className="bg-bvBlue text-white p-3 rounded-xl shadow-lg hover:scale-110 transition-transform"><ImagePlus size={24} /></button>}
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-lg group cursor-pointer" onClick={() => setExpandedPhoto(p)}>
                    <img src={p} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    {isAdmin && <button onClick={(e) => { e.stopPropagation(); setPhotos(prev => prev.filter((_, idx) => idx !== i)); }} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>}
                  </div>
                ))}
             </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fbfcfd] font-sans antialiased overflow-x-hidden">
      <aside className={`fixed inset-y-0 left-0 z-[150] w-72 bg-bvBlue text-white lg:relative lg:translate-x-0 transform transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col border-r-[8px] border-bvGold shadow-2xl`}>
        <div className="p-10 text-center bg-black/20">
          <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-4 flex items-center justify-center border-4 border-bvGold overflow-hidden shadow-xl">
            {teamShield ? <img src={teamShield} className="w-full h-full object-contain p-3" /> : <Shield size={32} className="text-bvBlue" />}
          </div>
          <h1 className="text-lg font-black text-bvGold italic uppercase tracking-tighter leading-none">BOA VISTA FC</h1>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {(Object.keys(tabNames) as TabType[]).map(id => (
            <button key={id} onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase italic tracking-widest transition-all ${activeTab === id ? 'bg-bvGold text-bvBlue shadow-2xl translate-x-2' : 'text-blue-100/40 hover:text-white hover:bg-white/5'}`}>{tabNames[id]}</button>
          ))}
        </nav>
        <div className="p-8 bg-black/30">
          {isAdmin ? <button onClick={() => setIsAdmin(false)} className="w-full bg-red-600 py-4 rounded-xl text-[10px] font-black uppercase italic shadow-xl hover:brightness-110">SAIR MODO ADM</button> : <button onClick={() => setShowLoginModal(true)} className="w-full bg-bvGold text-bvBlue py-4 rounded-xl text-[10px] font-black uppercase italic shadow-2xl flex items-center justify-center gap-2"><Lock size={14}/> DIRETORIA</button>}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 z-40 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-bvBlue text-white rounded-2xl"><Menu size={24}/></button>
            <h2 className="text-xl font-black text-bvBlue uppercase italic tracking-tighter">{tabNames[activeTab]}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Status Conexão</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase italic">Online Sincronizado</span>
             </div>
             <div className="w-10 h-10 bg-bvGold/10 rounded-full flex items-center justify-center text-bvGold border border-bvGold/20">
                <Star size={18} />
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[#f8fafc] custom-scrollbar">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>

      {/* MODAL LEAGUE TEAM MANAGEMENT */}
      {showLeagueModal && (
        <div className="fixed inset-0 z-[2001] bg-bvBlue/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-10 border-t-[15px] border-bvGold relative my-auto">
            <button onClick={() => setShowLeagueModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-bvBlue transition-colors"><X size={30} /></button>
            <h3 className="text-2xl font-black text-bvBlue uppercase italic mb-8 text-center tracking-tighter">GERENCIAR EQUIPES DA LIGA</h3>
            
            <div className="space-y-6">
              <div className="max-h-64 overflow-y-auto border-2 rounded-3xl p-4 bg-gray-50 space-y-2 custom-scrollbar">
                 {leagueTeams.map(team => (
                   <div key={team.id} className="flex justify-between items-center p-3 bg-white rounded-2xl border shadow-sm">
                      <div className="flex items-center gap-3">
                         {team.shield ? <img src={team.shield} className="w-8 h-8 object-contain" /> : <Shield size={18} className="text-gray-200" />}
                         <span className="font-black uppercase italic text-bvBlue text-xs truncate max-w-[150px]">{team.name}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleOpenLeagueModal(team)} className="p-2 text-bvBlue hover:bg-bvBlue/5 rounded-xl transition-all"><Edit2 size={16}/></button>
                         <button onClick={() => setLeagueTeams(prev => prev.filter(t => t.id !== team.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="border-t pt-6">
                 <h4 className="font-black uppercase italic text-bvBlue text-sm mb-4 bg-bvGold/10 px-4 py-2 rounded-lg inline-block">{editingLeagueTeam ? 'EDITAR EQUIPE' : 'ADICIONAR NOVA EQUIPE'}</h4>
                 
                 <div className="flex flex-col items-center mb-6">
                    <div onClick={() => leagueTeamShieldRef.current?.click()} className="w-24 h-24 bg-gray-100 rounded-3xl border-4 border-dashed border-bvGold flex items-center justify-center cursor-pointer overflow-hidden relative group shadow-inner">
                       {tempLeagueTeamShield ? <img src={tempLeagueTeamShield} className="w-full h-full object-contain p-2" /> : <Upload className="text-gray-300" size={30}/>}
                       <div className="absolute inset-0 bg-bvBlue/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={20} className="text-bvBlue"/></div>
                    </div>
                    <p className="text-[9px] font-black uppercase text-gray-400 mt-2 tracking-widest italic">Escudo da Equipe</p>
                    <input type="file" ref={leagueTeamShieldRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'leagueTeam')} />
                 </div>

                 <form onSubmit={e => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    const wins = Number(leagueForm.wins);
                    const draws = Number(leagueForm.draws);
                    const losses = Number(leagueForm.losses);
                    const played = wins + draws + losses;
                    const points = (wins * 3) + draws;

                    const newTeam: LeagueTeam = {
                       id: editingLeagueTeam?.id || Date.now().toString(),
                       name: (f.get('name') as string).toUpperCase(),
                       shield: tempLeagueTeamShield,
                       points: points,
                       played: played,
                       wins: wins,
                       draws: draws,
                       losses: losses,
                       goalsFor: Number(f.get('gp')),
                       goalsAgainst: Number(f.get('gc')),
                       yellowCards: Number(f.get('ca')),
                       redCards: Number(f.get('cv'))
                    };
                    if (editingLeagueTeam) {
                       setLeagueTeams(prev => prev.map(t => t.id === newTeam.id ? newTeam : t));
                    } else {
                       setLeagueTeams(prev => [...prev, newTeam]);
                    }
                    setEditingLeagueTeam(null);
                    setTempLeagueTeamShield('');
                    setLeagueForm({ wins: 0, draws: 0, losses: 0 });
                    (e.target as HTMLFormElement).reset();
                 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-4 relative">
                       <input name="name" required placeholder="NOME EQUIPE" className="w-full p-4 bg-gray-50 rounded-2xl font-black uppercase italic outline-none border-2 border-transparent focus:border-bvBlue transition-all shadow-sm" defaultValue={editingLeagueTeam?.name || ''} />
                    </div>
                    
                    <div className="space-y-1">
                       <p className="text-[8px] font-black uppercase text-bvBlue italic">VITÓRIAS (V)</p>
                       <input type="number" required value={leagueForm.wins} onChange={e => setLeagueForm({...leagueForm, wins: Number(e.target.value)})} className="w-full p-3 bg-white border-2 border-bvBlue/10 rounded-xl font-bold outline-none focus:border-bvBlue shadow-sm" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[8px] font-black uppercase text-bvBlue italic">EMPATES (E)</p>
                       <input type="number" required value={leagueForm.draws} onChange={e => setLeagueForm({...leagueForm, draws: Number(e.target.value)})} className="w-full p-3 bg-white border-2 border-bvBlue/10 rounded-xl font-bold outline-none focus:border-bvBlue shadow-sm" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[8px] font-black uppercase text-bvBlue italic">DERROTAS (D)</p>
                       <input type="number" required value={leagueForm.losses} onChange={e => setLeagueForm({...leagueForm, losses: Number(e.target.value)})} className="w-full p-3 bg-white border-2 border-bvBlue/10 rounded-xl font-bold outline-none focus:border-bvBlue shadow-sm" />
                    </div>

                    <div className="space-y-1 bg-bvBlue/5 p-3 rounded-xl flex flex-col justify-center border-2 border-bvBlue/5">
                       <p className="text-[8px] font-black uppercase text-bvBlue opacity-50 italic">JOGOS (J)</p>
                       <div className="w-full font-black text-bvBlue text-lg leading-none">{leagueForm.wins + leagueForm.draws + leagueForm.losses}</div>
                    </div>

                    <div className="space-y-1 bg-bvGold/10 p-3 rounded-xl col-span-1 md:col-span-1 border-2 border-bvGold/20">
                       <p className="text-[8px] font-black uppercase text-bvGold italic">PONTOS</p>
                       <div className="w-full font-black text-bvGold text-lg leading-none">{(leagueForm.wins * 3) + leagueForm.draws}</div>
                    </div>

                    <div className="space-y-1"><p className="text-[8px] font-black uppercase text-bvBlue italic">GP</p><input name="gp" type="number" required defaultValue={editingLeagueTeam?.goalsFor || 0} className="w-full p-3 bg-gray-50 rounded-xl font-bold border-2 border-transparent" /></div>
                    <div className="space-y-1"><p className="text-[8px] font-black uppercase text-bvBlue italic">GC</p><input name="gc" type="number" required defaultValue={editingLeagueTeam?.goalsAgainst || 0} className="w-full p-3 bg-gray-50 rounded-xl font-bold border-2 border-transparent" /></div>
                    <div className="space-y-1"><p className="text-[8px] font-black uppercase text-bvBlue italic">CA</p><input name="ca" type="number" required defaultValue={editingLeagueTeam?.yellowCards || 0} className="w-full p-3 bg-gray-50 rounded-xl font-bold border-2 border-transparent" /></div>
                    <div className="space-y-1"><p className="text-[8px] font-black uppercase text-bvBlue italic">CV</p><input name="cv" type="number" required defaultValue={editingLeagueTeam?.redCards || 0} className="w-full p-3 bg-gray-50 rounded-xl font-bold border-2 border-transparent" /></div>
                    
                    <button type="submit" className="col-span-2 md:col-span-4 bg-bvBlue text-white py-5 rounded-2xl font-black uppercase italic shadow-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                       <Save size={20}/> {editingLeagueTeam ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR EQUIPE'}
                    </button>
                    {editingLeagueTeam && <button type="button" onClick={() => { setEditingLeagueTeam(null); setLeagueForm({wins:0,draws:0,losses:0}); setTempLeagueTeamShield(''); }} className="col-span-2 md:col-span-4 bg-gray-200 text-bvBlue py-3 rounded-2xl font-black text-[10px] uppercase italic tracking-widest">CANCELAR EDIÇÃO</button>}
                 </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ATLETA */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-[2001] bg-bvBlue/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 border-t-[15px] border-bvGold relative my-auto">
            <button onClick={() => setShowPlayerModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-bvBlue transition-colors"><X size={30} /></button>
            <div className="flex flex-col items-center mb-10">
               <div className="w-20 h-20 bg-bvGold/20 rounded-2xl flex items-center justify-center text-bvGold mb-4">
                  <UserPlus size={40}/>
               </div>
               <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">NOVO ATLETA BVFC</h3>
            </div>
            <form onSubmit={e => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const p: Player = {
                    id: Date.now().toString(),
                    name: (f.get('nome') as string).toUpperCase(),
                    number: Number(f.get('numero')),
                    position: f.get('posicao') as PlayerPosition,
                    goals: 0, assists: 0, matches: 0,
                    photo: tempPlayerPhoto || 'https://via.placeholder.com/200?text=CRAQUE'
                };
                setPlayers(prev => [...prev, p]);
                setTempPlayerPhoto('');
                setShowPlayerModal(false);
            }} className="space-y-6">
              <div className="text-center">
                <div onClick={() => playerPhotoInputRef.current?.click()} className="w-32 h-32 bg-gray-100 rounded-[2.5rem] mx-auto border-4 border-dashed border-bvGold flex items-center justify-center cursor-pointer overflow-hidden group relative transition-all shadow-lg hover:brightness-95">
                   {tempPlayerPhoto ? <img src={tempPlayerPhoto} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-300"/>}
                   <div className="absolute inset-0 bg-bvBlue/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Upload className="text-white"/></div>
                </div>
                <input type="file" ref={playerPhotoInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'player')} />
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest italic">Foto do Craque</p>
              </div>
              <input name="nome" required placeholder="NOME DO JOGADOR" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-bvBlue transition-all font-black uppercase italic outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                   <input name="numero" type="number" required placeholder="Nº CAMISA" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-bvBlue transition-all font-black text-center outline-none" />
                </div>
                <select name="posicao" required className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-bvBlue transition-all font-black uppercase italic outline-none">
                    <option value={PlayerPosition.GK}>GOLEIRO</option>
                    <option value={PlayerPosition.DF}>DEFENSOR</option>
                    <option value={PlayerPosition.MF}>MEIO-CAMPO</option>
                    <option value={PlayerPosition.FW}>ATACANTE</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-bvBlue text-white py-5 rounded-2xl font-black uppercase italic shadow-2xl mt-4 hover:scale-[1.02] transition-all">SALVAR NO ELENCO</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SÚMULA / PARTIDA - COM ANÁLISE TÉCNICA */}
      {showMatchModal && (
        <div className="fixed inset-0 z-[2001] bg-bvBlue/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-10 border-t-[15px] border-bvGold relative my-auto">
            <button onClick={() => setShowMatchModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-all"><X size={30} /></button>
            <div className="flex flex-col items-center mb-8">
               <Trophy size={40} className="text-bvGold mb-2" />
               <h3 className="text-2xl font-black text-bvBlue uppercase italic tracking-tighter">FECHAMENTO DE SÚMULA</h3>
            </div>
            
            <form onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const m: Match = {
                id: editingMatch?.id || Date.now().toString(),
                date: f.get('data') as string + 'T' + (f.get('hora') || '15:00') + ':00',
                opponent: f.get('opponent') as string,
                location: f.get('location') as string || 'Campo do Boa Vista',
                type: 'Jogo',
                status: matchStatus,
                teamShield: tempTeamShield,
                opponentShield: tempOpponentShield,
                technicalReview: f.get('review') as string || '',
                score: matchStatus === 'finished' ? { team: selectedScorers.length, opponent: Number(f.get('s2')) } : undefined,
                technicalSheet: matchStatus === 'finished' ? { 
                  scorers: selectedScorers, 
                  assists: [], 
                  yellowCards: selectedYellows, 
                  redCards: selectedReds 
                } : undefined
              };
              setMatches(prev => editingMatch ? prev.map(x => x.id === m.id ? m : x) : [m, ...prev]);
              setShowMatchModal(false);
            }} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
                 <div onClick={() => matchTeamShieldRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-2xl border-2 border-transparent group-hover:border-bvBlue flex items-center justify-center overflow-hidden shadow-sm transition-all">
                       {tempTeamShield ? <img src={tempTeamShield} className="h-full object-contain p-2" /> : <Shield className="text-bvBlue opacity-20" />}
                    </div>
                    <span className="text-[9px] font-black uppercase text-bvBlue italic">Escudo BV</span>
                    <input type="file" ref={matchTeamShieldRef} className="hidden" onChange={e => handleFileUpload(e, 'matchTeam')} />
                 </div>
                 <div onClick={() => matchOpponentShieldRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-2xl border-2 border-transparent group-hover:border-bvGold flex items-center justify-center overflow-hidden shadow-sm transition-all">
                       {tempOpponentShield ? <img src={tempOpponentShield} className="h-full object-contain p-2" /> : <Shield size={20} className="text-gray-200" />}
                    </div>
                    <span className="text-[9px] font-black uppercase text-gray-400 italic">Escudo Rival</span>
                    <input type="file" ref={matchOpponentShieldRef} className="hidden" onChange={e => handleFileUpload(e, 'matchOpponent')} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-bvBlue opacity-50 italic">Data do Jogo</p>
                   <input name="data" type="date" required className="w-full p-4 bg-gray-50 rounded-xl border font-bold outline-none" defaultValue={editingMatch?.date.split('T')[0] || new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-bvBlue opacity-50 italic">Horário</p>
                   <input name="hora" type="time" required className="w-full p-4 bg-gray-50 rounded-xl border font-bold outline-none" defaultValue={editingMatch?.date.split('T')[1]?.substring(0,5) || "15:00"} />
                </div>
              </div>
              <input name="opponent" required placeholder="NOME DO ADVERSÁRIO" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-bvBlue transition-all font-black uppercase italic outline-none shadow-sm" defaultValue={editingMatch?.opponent || ''} />
              
              <div className="relative">
                 <select value={matchStatus} onChange={e => setMatchStatus(e.target.value as any)} className="w-full p-4 bg-bvBlue text-white rounded-xl font-black uppercase italic outline-none shadow-xl appearance-none pr-10">
                   <option value="upcoming">AGENDA (NÃO REALIZADO)</option>
                   <option value="finished">FINALIZADO (REGISTRAR RESULTADO)</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-bvGold pointer-events-none" />
              </div>

              {matchStatus === 'finished' && (
                <div className="space-y-4 border-t-4 border-bvGold/10 pt-6 animate-in slide-in-bottom">
                   <div className="flex items-center gap-6 bg-bvGold/5 p-6 rounded-[2rem] border-2 border-bvGold/20 shadow-inner">
                      <div className="flex-1 flex flex-col items-center">
                         <span className="text-[8px] font-black text-bvBlue uppercase mb-2">Boa Vista</span>
                         <div className="w-full p-5 bg-bvBlue text-white rounded-2xl font-black text-center text-5xl shadow-2xl border-b-4 border-bvGold">{selectedScorers.length}</div>
                      </div>
                      <div className="flex-none flex items-center justify-center">
                         <span className="font-black italic text-bvGold text-2xl drop-shadow-sm">X</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                         <span className="text-[8px] font-black text-gray-400 uppercase mb-2">Adversário</span>
                         <input name="s2" type="number" className="w-full p-5 bg-white rounded-2xl border-2 border-gray-200 font-black text-center text-5xl shadow-lg outline-none focus:border-bvBlue transition-all" defaultValue={editingMatch?.score?.opponent || 0} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <Star size={14} className="text-bvGold" />
                         <p className="text-[10px] font-black uppercase text-bvBlue italic">Resumo do Professor (Análise Técnica):</p>
                      </div>
                      <textarea name="review" placeholder="Destaque tático, pontos positivos e o que precisa melhorar..." className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bvBlue transition-all text-sm italic font-bold min-h-[120px] outline-none shadow-inner" defaultValue={editingMatch?.technicalReview || ''}></textarea>
                   </div>

                   <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-bvBlue" />
                      <p className="text-[10px] font-black uppercase text-bvBlue italic">Eventos do Jogo (Ficha Técnica):</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-3 custom-scrollbar bg-gray-50 rounded-[2rem] border-2 border-bvBlue/5 shadow-inner">
                        {players.map(p => (
                            <div key={p.id} className="bg-white p-3 rounded-2xl flex items-center justify-between border shadow-sm hover:border-bvBlue/30 transition-all">
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg overflow-hidden border">
                                     <img src={p.photo} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase italic text-bvBlue truncate max-w-[100px]">{p.name}</span>
                               </div>
                               <div className="flex gap-1">
                                  <button type="button" onClick={() => setSelectedScorers([...selectedScorers, p.name])} className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100" title="Marcar Gol">⚽</button>
                                  <button type="button" onClick={() => setSelectedYellows([...selectedYellows, p.name])} className="w-8 h-8 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-400 hover:text-white transition-all border border-yellow-200" title="Amarelo">🟨</button>
                                  <button type="button" onClick={() => setSelectedReds([...selectedReds, p.name])} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-200" title="Vermelho">🟥</button>
                               </div>
                            </div>
                        ))}
                   </div>
                   
                   <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border shadow-inner">
                      {selectedScorers.length === 0 && selectedYellows.length === 0 && selectedReds.length === 0 && <p className="text-[9px] font-black text-gray-300 uppercase italic">Nenhum evento registrado...</p>}
                      {selectedScorers.map((s,i) => <span key={i} className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic flex items-center gap-2 shadow-md">⚽ {s} <X size={10} className="cursor-pointer" onClick={() => setSelectedScorers(selectedScorers.filter((_, idx) => idx !== i))}/></span>)}
                      {selectedYellows.map((s,i) => <span key={i} className="bg-yellow-400 text-bvBlue px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic flex items-center gap-2 shadow-md border border-bvGold/20">🟨 {s} <X size={10} className="cursor-pointer" onClick={() => setSelectedYellows(selectedYellows.filter((_, idx) => idx !== i))}/></span>)}
                      {selectedReds.map((s,i) => <span key={i} className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic flex items-center gap-2 shadow-md">🟥 {s} <X size={10} className="cursor-pointer" onClick={() => setSelectedReds(selectedReds.filter((_, idx) => idx !== i))}/></span>)}
                   </div>
                </div>
              )}
              <button type="submit" className="w-full bg-bvBlue text-white py-6 rounded-[2rem] font-black uppercase italic shadow-2xl mt-4 hover:scale-[1.01] active:scale-95 transition-all text-lg border-b-8 border-bvGold">GRAVAR SÚMULA NO HISTÓRICO</button>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[3000] bg-bvBlue/98 backdrop-blur-3xl flex items-center justify-center p-6 text-center animate-in fade-in">
          <div className="bg-white rounded-[4rem] p-16 max-w-sm w-full border-t-[20px] border-bvGold shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-gray-200 hover:text-bvGold transition-colors"><X size={32}/></button>
            <div className="w-20 h-20 bg-bvBlue rounded-3xl mx-auto mb-8 flex items-center justify-center text-bvGold shadow-xl">
               <Lock size={40} />
            </div>
            <h3 className="text-3xl font-black text-bvBlue uppercase italic mb-8 tracking-tighter">ACESSO DIRETORIA</h3>
            <form onSubmit={e => { e.preventDefault(); if(password === 'bv2026') { setIsAdmin(true); setShowLoginModal(false); setPassword(''); } else alert('Senha Incorreta!'); }} className="space-y-8">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="SENHA" className="w-full p-8 bg-gray-50 rounded-[2rem] border-4 border-transparent focus:border-bvGold text-center font-black text-5xl outline-none transition-all shadow-inner" autoFocus />
              <button type="submit" className="w-full bg-bvBlue text-white py-6 rounded-[2rem] font-black uppercase italic shadow-2xl text-xl hover:scale-105 active:scale-95 transition-all border-b-8 border-bvGold">ENTRAR NO PAINEL</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TRANSAÇÃO FINANCEIRA */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-[2001] bg-bvBlue/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-12 border-t-[15px] border-bvGold relative">
            <button onClick={() => setShowTransactionModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-bvBlue transition-colors"><X size={30} /></button>
            <h3 className="text-2xl font-black text-bvBlue uppercase italic mb-8 text-center tracking-tighter">MOVIMENTAÇÃO DE CAIXA</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const t: FinancialTransaction = {
                id: Date.now().toString(),
                date: new Date(f.get('data') as string + 'T12:00:00').toISOString(),
                description: f.get('desc') as string,
                name: f.get('nome') as string || '',
                amount: Number(f.get('val')),
                type: f.get('tipo') as any,
                category: 'Geral'
              };
              setTransactions(prev => [t, ...prev]);
              setShowTransactionModal(false);
            }} className="space-y-4">
              <input name="data" type="date" required className="w-full p-4 bg-gray-50 rounded-2xl border font-bold outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
              <input name="desc" required placeholder="DESCRIÇÃO DA MOVIMENTAÇÃO" className="w-full p-4 bg-gray-50 rounded-2xl border font-black uppercase italic text-sm outline-none shadow-sm" />
              <input name="nome" placeholder="NOME DO RESPONSÁVEL" className="w-full p-4 bg-gray-50 rounded-2xl border font-black uppercase italic text-sm outline-none shadow-sm" />
              <div className="flex gap-2">
                <input name="val" type="number" step="0.01" required placeholder="VALOR R$" className="flex-[2] p-4 bg-gray-50 rounded-2xl border font-black text-xl outline-none shadow-sm" />
                <select name="tipo" className="flex-1 p-4 bg-bvBlue text-white rounded-2xl font-black uppercase italic text-[10px] outline-none">
                  <option value="income">ENTRADA (+)</option><option value="expense">SAÍDA (-)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-bvBlue text-white py-5 rounded-2xl font-black uppercase italic shadow-2xl mt-4 hover:scale-105 active:scale-95 transition-all">SALVAR NO LIVRO</button>
            </form>
          </div>
        </div>
      )}

      {/* GALERIA ADD */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-[2001] bg-bvBlue/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-12 border-t-[15px] border-bvGold text-center relative">
             <button onClick={() => setShowAddPhotoModal(false)} className="absolute top-8 right-8 text-gray-200 hover:text-bvBlue transition-colors"><X size={24} /></button>
             <h3 className="text-2xl font-black text-bvBlue uppercase italic mb-8 tracking-tighter">NOVA FOTO</h3>
             <label className="block w-full h-48 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-bvGold hover:bg-bvGold/5 bg-gray-50 transition-all group">
                <ImagePlus size={60} className="text-gray-200 group-hover:text-bvGold transition-colors mb-4"/>
                <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-bvGold">Abrir Galeria do Dispositivo</span>
                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} />
             </label>
          </div>
        </div>
      )}

      {expandedPhoto && (
        <div className="fixed inset-0 z-[4000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-10 cursor-zoom-out animate-in zoom-in" onClick={() => setExpandedPhoto(null)}>
           <img src={expandedPhoto} className="max-w-full max-h-full rounded-3xl object-contain shadow-2xl border-4 border-white/20" />
           <button className="absolute top-10 right-10 text-white bg-bvBlue p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"><X size={32}/></button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
        .zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.3; cursor: pointer; }
        input[type="time"]::-webkit-calendar-picker-indicator { opacity: 0.3; cursor: pointer; }
      `}} />
    </div>
  );
};

export default App;
