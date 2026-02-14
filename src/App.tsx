import React, { useState, useEffect } from 'react';
import { Menu, PlusCircle, FileText, DollarSign, Trash2, Wifi } from 'lucide-react';

export default function App() {
  const [lancamentos, setLancamentos] = useState(() => {
    const salvo = localStorage.getItem('bvfc_financeiro');
    return salvo ? JSON.parse(salvo) : [
      { id: 1, descricao: 'COLABORAÇÃO COROA DE FLORES', data: '14/02/2026', responsavel: 'EDSON KELTTI KOGA', valor: 30.00 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bvfc_financeiro', JSON.stringify(lancamentos));
  }, [lancamentos]);

  const saldoTotal = lancamentos.reduce((acc, curr) => acc + curr.valor, 0);

  const novoLancamento = () => {
    const desc = prompt("Descrição do lançamento:");
    const valor = prompt("Valor (ex: 30.00):");
    if (desc && valor) {
      const novo = {
        id: Date.now(),
        descricao: desc.toUpperCase(),
        data: new Date().toLocaleDateString('pt-BR'),
        responsavel: "ADMINISTRADOR",
        valor: parseFloat(valor)
      };
      setLancamentos([novo, ...lancamentos]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-4 font-sans text-[#003366]">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-4">
          <button className="bg-[#003366] text-white p-2 rounded-lg shadow-md"><Menu /></button>
          <h1 className="text-2xl font-black italic tracking-wider">FINANCEIRO</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-green-500 flex items-center justify-end gap-1 uppercase">
            Status Conexão <br/> Online Sincronizado
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* CARD SALDO */}
        <div className="bg-white p-8 rounded-[30px] shadow-lg border-b-8 border-yellow-500 text-center relative overflow-hidden">
          <p className="text-4xl font-black mb-1 italic">R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saldo em Caixa</p>
        </div>

        {/* BOTAO NOVO */}
        <button onClick={novoLancamento} className="bg-[#003366] text-white p-8 rounded-[30px] shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition transform">
          <PlusCircle size={32} />
          <span className="font-black italic text-lg">NOVO LANÇAMENTO</span>
        </button>

        {/* BOTAO PDF */}
        <button className="bg-[#e2b03e] text-[#003366] p-8 rounded-[30px] shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition transform">
          <FileText size={32} />
          <span className="font-black italic text-lg leading-tight">GERAR RELATÓRIO<br/>PDF</span>
        </button>
      </div>

      {/* EXTRATO */}
      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-2 mb-8 border-b pb-4">
          <div className="bg-yellow-500 text-white p-1 rounded-md"><DollarSign size={20}/></div>
          <h2 className="text-xl font-black italic">EXTRATO FINANCEIRO</h2>
        </div>

        <div className="space-y-4">
          {lancamentos.map(item => (
            <div key={item.id} className="flex justify-between items-center p-6 bg-[#f8fafc] rounded-[25px] border-l-8 border-[#003366] shadow-sm">
              <div>
                <p className="font-black text-sm mb-1">{item.descricao}</p>
                <p className="text-[10px] font-bold text-slate-400">{item.data} • {item.responsavel}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-green-600 italic">+ R$ {item.valor.toFixed(2)}</span>
                <button onClick={() => setLancamentos(lancamentos.filter(l => l.id !== item.id))} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
