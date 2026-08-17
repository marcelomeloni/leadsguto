"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle, MapPin } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import bairrosData from "../../public/bairros_limeira.json";

interface Lead {
  id: string;
  nome: string;
  hora: string;
}

const BAIRROS = (bairrosData.bairros as string[]).sort();

export default function CadastrarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  
  const [bairroBusca, setBairroBusca] = useState("");
  const [showBairros, setShowBairros] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin" && user.role !== "colaborador") {
        toast.error("Acesso negado. Apenas colaboradores e admins podem acessar.");
        router.push("/login");
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);
  
  const filteredBairros = BAIRROS.filter(b => 
    b.toLowerCase().includes(bairroBusca.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.target as HTMLFormElement;
    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const telefone = (form.elements.namedItem("telefone") as HTMLInputElement).value;
    
    const payload = {
      nome,
      email,
      telefone,
      bairro: bairroBusca,
      origem: "Rua",
      engajamento: "Frio"
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://gutobackend.vercel.app/api"}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        // Adicionar à lista de recentes
        const now = new Date();
        const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setRecentLeads(prev => [
          { id: Math.random().toString(), nome, hora },
          ...prev
        ].slice(0, 3));
        
        toast.success("Lead cadastrado com sucesso!");
        form.reset();
        setBairroBusca("");
        document.getElementById("nome")?.focus();
      } else {
        toast.error("Erro ao salvar lead.");
      }
    } catch (err) {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return <main className="flex-1 flex flex-col pt-6 pb-12 px-4 items-center justify-center min-h-screen bg-slate-950"></main>;
  }

  return (
    <main className="flex-1 flex flex-col pt-6 pb-12 px-4 items-center min-h-screen bg-slate-950">
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
            <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="bairro">
              Bairro <span className="text-slate-600 font-normal">({BAIRROS.length} bairros de Limeira)</span>
            </label>
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
