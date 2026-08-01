import React from 'react';
import { ArrowUp, Instagram, Youtube, Twitter, Shield, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030305] text-slate-400 border-t border-white/10 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase">Envio Expresso Global</h4>
              <p className="text-xs text-slate-400 mt-0.5">Entrega priorizada com rastreamento 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase">Garantia Vitalícia</h4>
              <p className="text-xs text-slate-400 mt-0.5">Suporte total e substituição de peças contra defeitos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase">30 Dias de Teste Sem Risco</h4>
              <p className="text-xs text-slate-400 mt-0.5">Devolução 100% garantida se não for perfeito</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-cyan-400 flex items-center justify-center font-bold text-black font-display text-xs">
                VX
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-widest uppercase">
                AEROMAX
              </span>
            </div>
            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Inovação radical em equipamentos esportivos de alta performance. Redefinindo os limites da visão e da velocidade.
            </p>
          </div>

          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Navegação</h5>
            <ul className="space-y-2.5 text-xs font-sans">
              <li><a href="#hero" className="hover:text-cyan-400 transition-colors">Visão Geral</a></li>
              <li><a href="#specs-3d" className="hover:text-cyan-400 transition-colors">Modelo 3D Interativo</a></li>
              <li><a href="#tech" className="hover:text-cyan-400 transition-colors">Especificações Técnicas</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Suporte & Contato</h5>
            <ul className="space-y-2.5 text-xs font-sans">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Política de Garantia</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Newsletter VIP</h5>
            <p className="text-xs text-slate-400 mb-3">Receba convites de edições limitadas e lançamentos antecipados.</p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="w-full bg-white/5 border border-white/10 rounded-l-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button className="bg-cyan-400 text-black px-4 py-2 rounded-r-xl font-bold text-xs uppercase hover:bg-cyan-300 transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {new Date().getFullYear()} AEROMAX EYEWEAR INC. TODOS OS DIREITOS RESERVADOS.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>VOLTAR AO TOPO</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
