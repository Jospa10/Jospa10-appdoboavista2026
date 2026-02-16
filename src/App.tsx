import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, LogOut, Plus, Trash2, Shield, X, ImagePlus, 
  Edit2, Lock, Trophy, PlusCircle, Calendar, Flag,
  Users, Camera, MapPin, Receipt, ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp, Star, Printer, ChevronRight, CheckCircle2, AlertCircle, UserPlus, Save, Settings, Upload, MessageSquareQuote,
  ChevronDown, Music, Dog, DollarSign
} from 'lucide-react';

export default function App() {
  // --- CONFIGURAÇÃO DE NAVEGAÇÃO ---
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // --- MEMÓRIA DO APP (CARREGA DADOS SALVOS) ---
  const [players, setPlayers] = useState(() => JSON.parse(localStorage.getItem('bvfc_players') || '[]'));
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('bvfc_transactions') || '[]'));
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('bvfc_matches') || '[]'));
  const [photos, setPhotos] = useState(() => JSON.parse(localStorage.getItem('bvfc_photos') || '[]'));

  // Salva tudo automaticamente
  useEffect(() => {
    localStorage.setItem('bvfc_players', JSON.stringify(players));
    localStorage.setItem('bvfc_transactions', JSON.stringify(transactions));
    localStorage.setItem('bvfc_matches', JSON.stringify(matches));
    localStorage.setItem('bvfc_photos', JSON.stringify(photos));
  }, [players, transactions, matches, photos]);

  // Cálculos rápidos
  const saldo = transactions.reduce((acc, t) => t.type === 'entrada' ? acc + t.valor : acc - t.valor, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#003366] pb-24">
      {/* CABEÇALHO OFICIAL */}
      <header className="bg-[#003366] text-white p-6 shadow-2xl sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-yellow-500" size={32} />
          <h1 className="text-2xl font-black italic tracking-tighter">BOA VISTA FC</h1>
        </div>
        <button onClick={() => setIsAdmin(!isAdmin)} className="bg-yellow-600 p-2 rounded-full shadow-lg">
          <Lock size={18} />
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* ABA 1: HOME (VISÃO GERAL) */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border-b-8 border-yellow-500 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo em Caixa</p>
              <p className="text-4xl font-black italic">R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('players')} className="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center gap-2 border-l-4 border-blue-900">
                <Users size={32} className="text-blue-900" /> <span className="font-bold text-[10px] uppercase">Elenco</span>
              </button>
              <button onClick={() => setActiveTab('finance')} className="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center gap-2 border-l-4 border-green-600">
                <DollarSign size={32} className="text-green-600" /> <span className="font-bold text-[10px] uppercase">Financeiro</span>
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: FINANCEIRO (COMPLETO) */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => {
                const d = prompt("Descrição:");
                const v = prompt("Valor (ex: 30):");
                if(d && v) setTransactions([{id: Date.now(), desc: d.toUpperCase(), valor: parseFloat(v), type: 'entrada', data: new Date().toLocaleDateString()}, ...transactions]);
              }} className="flex-1 bg-green-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"><ArrowUpCircle /> ENTRADA</button>
              <button onClick={() => {
                const d = prompt("Descrição:");
                const v = prompt("Valor (ex: 30):");
                if(d && v) setTransactions([{id: Date.now(), desc: d.toUpperCase(), valor: parseFloat(v), type: 'saida', data: new Date().toLocaleDateString()}, ...transactions]);
              }} className="flex-1 bg-red-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"><ArrowDownCircle /> SAÍDA</button>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="font-black italic mb-4 flex items-center gap-2"><Receipt /> EXTRATO</h2>
              {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center border-b p-4 last:border-0">
                  <div><p className="font-bold text-xs">{t.desc}</p><p className="text-[10px] text-slate-400">{t.data}</p></div>
                  <span className={`font-black ${t.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>R$ {t.valor.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 3: ELENCO E ARTILHARIA */}
        {activeTab === 'players' && (
          <div className="space-y-4">
            <button onClick={() => {
              const n = prompt("Nome do Jogador:");
              if(n) setPlayers([...players, {id: Date.now(), nome: n.toUpperCase(), gols: 0}]);
            }} className="w-full bg-blue-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"><UserPlus /> NOVO JOGADOR</button>
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              {players.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 border-b last:border-0">
                  <span className="font-black text-slate-700">{p.nome}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-600 font-black">{p.gols} GOLS</span>
                    <button onClick={() => setPlayers(players.filter(i => i.id !== p.id))} className="text-slate-300"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 4: CALENDÁRIO / JOGOS */}
        {activeTab === 'calendar' && (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <Calendar size={60} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-black italic text-xl uppercase">Próximas Partidas</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Aguardando definição da diretoria</p>
          </div>
        )}

        {/* ABA 5: GALERIA DE FOTOS */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => {
               const url = prompt("Cole o link da foto (URL):");
               if(url) setPhotos([url, ...photos]);
             }} className="col-span-2 bg-yellow-500 text-white p-6 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg"><Camera /> ADICIONAR FOTO À GALERIA</button>
             {photos.map((url, i) => (
               <img key={i} src={url} className="w-full h-40 object-cover rounded-2xl shadow-md border-2 border-white" />
             ))}
          </div>
        )}

      </main>

      {/* MENU DE NAVEGAÇÃO INFERIOR (TODAS AS ABAS) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)] z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Shield size={24} /><span className="text-[9px] font-black uppercase">Home</span>
        </button>
        <button onClick={() => setActiveTab('players')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'players' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Users size={24} /><span className="text-[9px] font-black uppercase">Elenco</span>
        </button>
        <button onClick={() => setActiveTab('finance')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'finance' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <DollarSign size={24} /><span className="text-[9px] font-black uppercase">Caixa</span>
        </button>
        <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'calendar' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Calendar size={24} /><span className="text-[9px] font-black uppercase">Jogos</span>
        </button>
        <button onClick={() => setActiveTab('gallery')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'gallery' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Camera size={24} /><span className="text-[9px] font-black uppercase">Fotos</span>
        </button>
      </nav>
    </div>
  );
}

