import React, { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('jogadores');
  const [jogadores, setJogadores] = useState([
    { id: 1, nome: 'Exemplo Jogador', gols: 0, presencas: 0 },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      {/* CABEÇALHO */}
      <header className="w-full max-w-4xl bg-blue-900 text-white p-6 rounded-2xl shadow-xl mb-6 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-2">BOA VISTA FC</h1>
        <div className="flex justify-center gap-4 text-sm opacity-90">
          <span className="bg-blue-800 px-3 py-1 rounded-full">Temporada 2024</span>
          <span className="bg-yellow-600 px-3 py-1 rounded-full text-white font-bold">★ App Oficial</span>
        </div>
      </header>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="w-full max-w-4xl flex gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('jogadores')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'jogadores' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-600'}`}
        >
          <Users size={20} /> Jogadores
        </button>
        <button 
          onClick={() => setActiveTab('partidas')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'partidas' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-600'}`}
        >
          <Calendar size={20} /> Partidas
        </button>
        <button 
          onClick={() => setActiveTab('estatisticas')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'estatisticas' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-600'}`}
        >
          <Trophy size={20} /> Artilharia
        </button>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
        {activeTab === 'jogadores' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="text-blue-900" /> Elenco Atual
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jogadores.map(j => (
                <div key={j.id} className="p-4 border rounded-2xl flex justify-between items-center bg-slate-50">
                  <span className="font-semibold text-slate-700">{j.nome}</span>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">Ativo</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'partidas' && (
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nenhuma partida agendada para esta semana.</p>
          </div>
        )}

        {activeTab === 'estatisticas' && (
          <div className="text-center py-20">
            <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
            <p className="text-slate-500 font-medium">A artilharia será atualizada após o próximo jogo!</p>
          </div>
        )}
      </main>

      <footer className="mt-8 text-slate-400 text-sm">
        &copy; 2024 Boa Vista FC - Desenvolvido via Google AI Studio
      </footer>
    </div>
  );
}
