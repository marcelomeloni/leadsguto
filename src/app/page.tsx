"use client";

import { useState } from "react";

export default function LeadsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const nome = (document.getElementById("nome") as HTMLInputElement).value;
    const telefone = (document.getElementById("telefone") as HTMLInputElement).value;
    const bairro = (document.getElementById("bairro") as HTMLInputElement).value;
    const observacoes = (document.getElementById("observacoes") as HTMLTextAreaElement).value;

    const payload = {
      nome,
      telefone,
      bairro,
      observacoes,
      origem: "Rua",
      engajamento: "Frio"
    };

    try {
      const res = await fetch("http://localhost:3333/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
        form.reset();
      } else {
        alert("Erro ao enviar dados. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/5 pointer-events-none"></div>
          <div className="w-16 h-16 bg-brand/20 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cadastro Realizado!</h2>
          <p className="text-slate-400 mb-8">Obrigado por se juntar a nós. Em breve entraremos em contato.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="text-brand hover:text-brand-hover font-medium underline"
          >
            Fazer novo cadastro
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="mb-8 relative z-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">Junte-se a nós!</h1>
          <p className="text-slate-400 text-sm sm:text-base">Cadastre-se para receber novidades, convites para eventos e apoiar o nosso projeto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="nome">Nome Completo *</label>
            <input 
              id="nome"
              type="text" 
              placeholder="Digite seu nome completo"
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="telefone">WhatsApp *</label>
            <input 
              id="telefone"
              type="tel" 
              placeholder="(00) 00000-0000"
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="bairro">Bairro / Cidade *</label>
            <input 
              id="bairro"
              type="text" 
              placeholder="Ex: Centro - São Paulo"
              required
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="observacoes">Por que você quer nos apoiar? (Opcional)</label>
            <textarea 
              id="observacoes"
              rows={3}
              placeholder="Conte-nos um pouco sobre você..."
              className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover text-black font-bold rounded-lg px-4 py-4 transition-colors duration-200 mt-4 flex justify-center items-center disabled:opacity-70 text-lg shadow-[0_0_20px_rgba(253,190,33,0.3)] hover:shadow-[0_0_30px_rgba(253,190,33,0.5)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : "Quero Apoiar!"}
          </button>
        </form>
      </div>
    </main>
  );
}
