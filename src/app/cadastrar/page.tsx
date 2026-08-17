"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle } from "@phosphor-icons/react";

interface Lead {
  id: string;
  nome: string;
  hora: string;
}

const BAIRROS_MOCK = [
  "Centro", "Vila Nova", "Jardim América", "Bela Vista", "Vila Mariana", 
  "Santo Amaro", "Jardim Paulista", "Itaim Bibi", "Pinheiros", "Moema",
  "Tatuapé", "Penha", "Ipiranga", "Liberdade", "Consolação"
].sort();

export default function CadastrarPage() {
  const [loading, setLoading] = useState(false);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  
  const [bairroBusca, setBairroBusca] = useState("");
  const [showBairros, setShowBairros] = useState(false);
  
  const filteredBairros = BAIRROS_MOCK.filter(b => 
    b.toLowerCase().includes(bairroBusca.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.target as HTMLFormElement;
    const nomeInput = form.elements.namedItem("nome") as HTMLInputElement;
    const nome = nomeInput.value;
    
    // Simular API request
    setTimeout(() => {
      setLoading(false);
      
      // Adicionar à lista de recentes
      const now = new Date();
      const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setRecentLeads(prev => [
        { id: Math.random().toString(), nome, hora },
        ...prev
      ].slice(0, 3)); // Manter apenas os 3 mais recentes na tela
      
      toast.success("Lead cadastrado com sucesso!");
      form.reset();
      setBairroBusca("");
      
      // Opcional: focar no primeiro input para agilizar o próximo
      document.getElementById("nome")?.focus();
    }, 500);
  };

  return (
    <main className="flex-1 flex flex-col pt-6 pb-12 px-4 items-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="mb-6 relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white">Novo Cadastro</h1>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400">Cadastros Hoje</span>
            <span className="text-2xl font-black text-brand leading-none mt-1">{recentLeads.length}</span>
          </div>
        </div>

        <form id="lead-form" onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="nome">Nome Completo</label>
            <input 
              id="nome"
              name="nome"
              type="text" 
              placeholder="Ex: João da Silva"
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors text-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="email">E-mail</label>
            <input 
              id="email"
              name="email"
              type="email" 
              placeholder="Ex: joao@email.com"
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors text-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="telefone">Telefone / WhatsApp</label>
            <input 
              id="telefone"
              name="telefone"
              type="tel" 
              placeholder="(00) 00000-0000"
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors text-lg"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="bairro">Bairro</label>
            <input 
              id="bairro"
              name="bairro"
              type="text" 
              value={bairroBusca}
              onChange={(e) => {
                setBairroBusca(e.target.value);
                setShowBairros(true);
              }}
              onFocus={() => setShowBairros(true)}
              onBlur={() => setTimeout(() => setShowBairros(false), 200)}
              placeholder="Digite para buscar o bairro..."
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors text-lg"
              autoComplete="off"
            />
            
            {showBairros && filteredBairros.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl custom-scrollbar">
                {filteredBairros.map(b => (
                  <li 
                    key={b} 
                    className="px-4 py-3 hover:bg-brand/20 cursor-pointer text-slate-200 border-b border-slate-700/50 last:border-0 transition-colors"
                    onMouseDown={() => {
                      setBairroBusca(b);
                      setShowBairros(false);
                    }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {showBairros && bairroBusca && filteredBairros.length === 0 && (
              <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 text-center text-slate-400 text-sm">
                Nenhum bairro encontrado. Será salvo como novo.
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover text-black font-bold rounded-lg px-4 py-4 transition-colors duration-200 mt-6 flex justify-center items-center disabled:opacity-70 text-lg uppercase tracking-wide"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : "Salvar Lead"}
          </button>
        </form>

        {/* Recent Leads Feed */}
        {recentLeads.length > 0 && (
          <div className="mt-8 relative z-10">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Adicionados Recentemente</h3>
            <div className="space-y-2">
              {recentLeads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between bg-black/50 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle size={20} weight="fill" className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-200 font-medium truncate">{lead.nome}</span>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{lead.hora}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
