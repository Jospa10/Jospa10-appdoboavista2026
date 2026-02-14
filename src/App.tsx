import React, { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, DollarSign, PlusCircle, Trash2, UserPlus, TrendingUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('financeiro');
  
  // --- MEMÓRIA DO APP (DADOS SALVOS) ---
  const [jogadores, setJogadores] = useState(() => {
    const salvo = localStorage.getItem('bvfc_jogadores');
    return salvo ? JSON.parse(salvo) : [{ id: 1, nome: 'Jogador Exemplo', gols: 0 }];
  });

  const [lancamentos, setLancamentos] = useState(() => {
    const salvo = localStorage.getItem('bvfc_financeiro');
    return salvo ? JSON.parse(salvo) : [{ id: 1, desc: 'Mensalidade Base', valor: 30, data: '14/02' }];
  });

  useEffect(() => {
    localStorage.setItem('bvfc_jogadores', JSON.stringify(jogadores));
    localStorage.setItem('bvfc_financeiro', JSON.stringify(lancamentos));
  }, [jogadores, lancamentos]);

  // --- LÓGICA DE CÁLCULOS ---
  const saldo = lancamentos.reduce((acc, curr) => acc + curr.valor, 0);
  const totalGols = jogadores.reduce((acc, curr) => acc + curr.gols, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* CABEÇALHO FIXO */}
      <header className="bg-[#003366] text-white p-6 shadow-xl text-center sticky top-0 z-50">
        <h1 className="text-3xl font-black italic tracking-tighter">BOA VISTA FC</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">Painel de Gestão Completo</p>
      </header>

      <main className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
        
        {/* ABA: FINANCEIRO */}
        {activeTab === 'financeiro' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[30px] shadow-lg border-b-8 border-yellow-500 text-center">
              <p className="text-4xl font-black italic">R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Saldo em Caixa</p>
            </div>
            <button onClick={() => {
              const d = prompt("Descrição:");
              const v = prompt("Valor (ex: 30 ou -10):");
              if(d && v) setLancamentos([{ id: Date.now(), desc: d.toUpperCase(), valor: parseFloat(v), data: new Date().toLocaleDateString('pt-BR') }, ...lancamentos]);
            }} className="w-full bg-[#003366] text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
              <PlusCircle /> NOVO LANÇAMENTO
            </button>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-black italic mb-4 flex items-center gap-2 text-[#003366]"><DollarSign size={20}/> EXTRATO DETALHADO</h2>
              {lancamentos.map(l => (
                <div key={l.id} className="flex justify-between p-4 border-b last:border-0 items-center bg-slate-50 mb-2 rounded-xl">
                  <div><p className="font-bold text-xs">{l.desc}</p><p className="text-[10px] text-slate-400">{l.data}</p></div>
                  <span className={`font-black ${l.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {l.valor.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: ELENCO (JOGADORES) */}
        {activeTab === 'elenco' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => {
                const n = prompt("Nome do Novo Jogador:");
                if(n) setJogadores([...jogadores, { id: Date.now(), nome: n, gols: 0 }]);
              }} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                <UserPlus /> CADASTRAR JOGADOR
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {jogadores.map(j => (
                <div key={j.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100">
                  <div>
                    <p className="font-black text-slate-700">{j.nome.toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Membro Ativo</p>
                  </div>
                  <button onClick={() => setJogadores(jogadores.filter(i => i.id !== j.id))} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: ARTILHARIA (ESTATÍSTICAS) */}
        {activeTab === 'artilharia' && (
          <div className="space-y-4">
            <div className="bg-blue-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
              <div><p className="text-xs uppercase opacity-70 font-bold">Total de Gols</p><p className="text-3xl font-black italic">{totalGols}</p></div>
              <Trophy size={40} className="text-yellow-500" />
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-black italic mb-6 text-[#003366]">RANKING DE ARTILHEIROS</h2>
              {jogadores.sort((a,b) => b.gols - a.gols).map((j, index) => (
                <div key={j.id} className="flex items-center justify-between p-4 mb-2 bg-slate-50 rounded-2xl border-l-4 border-yellow-500">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-300">#{index + 1}</span>
                    <span className="font-bold text-slate-700">{j.nome}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setJogadores(jogadores.map(item => item.id === j.id ? {...item, gols: Math.max(0, item.gols - 1)} : item))} className="bg-white w-8 h-8 rounded-full shadow text-xl font-bold">-</button>
                    <span className="font-black text-xl text-[#003366]">{j.gols}</span>
                    <button onClick={() => setJogadores(jogadores.map(item => item.id === j.id ? {...item, gols: item.gols + 1} : item))} className="bg-white w-8 h-8 rounded-full shadow text-xl font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: JOGOS */}
        {activeTab === 'jogos' && (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <Calendar size={60} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-black italic text-xl">NENHUMA PARTIDA</p>
            <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest">Defina o próximo jogo na diretoria</p>
          </div>
        )}

      </main>

      {/* MENU DE NAVEGAÇÃO INFERIOR */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)] z-50">
        <button onClick={() => setActiveTab('financeiro')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'financeiro' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <DollarSign size={24} /><span className="text-[9px] font-black uppercase">Caixa</span>
        </button>
        <button onClick={() => setActiveTab('elenco')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'elenco' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Users size={24} /><span className="text-[9px] font-black uppercase">Elenco</span>
        </button>
        <button onClick={() => setActiveTab('artilharia')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'artilharia' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Trophy size={24} /><span className="text-[9px] font-black uppercase">Gols</span>
        </button>
        <button onClick={() => setActiveTab('jogos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'jogos' ? 'text-[#003366] scale-110' : 'text-slate-300'}`}>
          <Calendar size={24} /><span className="text-[9px] font-black uppercase">Jogos</span>
        </button>
      </nav>
    </div>
  );
}
