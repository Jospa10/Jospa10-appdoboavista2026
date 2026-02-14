import React, { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, Plus, Trash2, UserPlus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('jogadores');
  const [novoNome, setNovoNome] = useState('');
  
  // Memória do App: Carrega os dados salvos ou inicia com um exemplo
  const [jogadores, setJogadores] = useState(() => {
    const salvo = localStorage.getItem('bvfc_jogadores');
    return salvo ? JSON.parse(salvo) : [{ id: 1, nome: 'Exemplo Jogador', gols: 0 }];
  });

  // Salva no navegador sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('bvfc_jogadores', JSON.stringify(jogadores));
  }, [jogadores]);

  const adicionarJogador = () => {
    if (!novoNome.trim()) return;
    const novo = { id: Date.now(), nome: novoNome, gols: 0 };
    setJogadores([...jogadores, novo]);
    setNovoNome('');
  };

  const removerJogador = (id) => {
    setJogadores(jogadores.filter(j => j.id !== id));
  };

  const alterarGols = (id, valor) => {
    setJogadores(jogadores.map(j => 
      j.id === id ? { ...j, gols: Math.max(0, j.gols + valor) } : j
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl bg-[#003366] text-white p-6 rounded-2xl shadow-xl mb-6 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-2">BOA VISTA FC</h1>
        <div className="flex justify-center gap-4 text-sm">
          <span className="bg-yellow-600 px-3 py-1 rounded-full text-white font-bold">★ Painel de Gestão</span>
        </div>
      </header>

      <nav className="w-full max-w-4xl flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('jogadores')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'jogadores' ? 'bg-[#003366] text-white' : 'bg-white text-slate-600'}`}>
          <Users size={20} /> Elenco
        </button>
        <button onClick={() => setActiveTab('artilharia')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'artilharia' ? 'bg-[#003366] text-white' : 'bg-white text-slate-600'}`}>
          <Trophy size={20} /> Artilharia
        </button>
      </nav>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'jogadores' && (
          <div>
            <div className="flex gap-2 mb-8">
              <input 
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Nome do novo jogador..."
                className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button onClick={adicionarJogador} className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition">
                <UserPlus size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {jogadores.map(j => (
                <div key={j.id} className="p-4 border rounded-2xl flex justify-between items-center bg-slate-50">
                  <span className="font-bold text-slate-700">{j.nome}</span>
                  <button onClick={() => removerJogador(j.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'artilharia' && (
          <div className="space-y-4">
            {jogadores.sort((a, b) => b.gols - a.gols).map(j => (
              <div key={j.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-2xl">
                <span className="font-bold text-slate-800">{j.nome}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => alterarGols(j.id, -1)} className="bg-white border w-8 h-8 rounded-full shadow-sm font-bold">-</button>
                  <span className="text-xl font-black text-yellow-700">{j.gols} Gols</span>
                  <button onClick={() => alterarGols(j.id, 1)} className="bg-white border w-8 h-8 rounded-full shadow-sm font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

