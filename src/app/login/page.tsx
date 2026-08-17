"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://gutobackend.vercel.app/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login realizado com sucesso!");
        router.push("/");
      } else {
        toast.error(data.error || "Erro ao fazer login.");
      }
    } catch (err) {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">Guto <span className="text-brand">Schiaveetto</span></h1>
            <p className="text-slate-400 text-sm">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">E-mail</label>
              <input 
                id="email"
                name="email"
                type="email" 
                placeholder="seu@email.com"
                required
                className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">Senha</label>
              <input 
                id="password"
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-black font-bold rounded-lg px-4 py-3.5 transition-colors duration-200 mt-2 flex justify-center items-center disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
