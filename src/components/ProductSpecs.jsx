import React from 'react';
import { Cpu, Wind, Sun, Feather, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export default function ProductSpecs() {
  const specs = [
    {
      icon: <Feather className="text-cyan-400" size={24} />,
      title: "22g Ultra-Lightweight",
      desc: "Distribuição perfeita de massa para conforto inabalável em maratonas ou ciclismo de longa distância."
    },
    {
      icon: <Wind className="text-cyan-400" size={24} />,
      title: "Canal de Vento Aerodinâmico",
      desc: "Micro-fendas esculpidas que induzem o fluxo de ar contínuo, prevenindo o embaçamento por suor."
    },
    {
      icon: <Sun className="text-cyan-400" size={24} />,
      title: "Proteção UV400 Polarizada",
      desc: "Lentes de policarbonato óptico que bloqueiam 100% dos raios UVA/UVB com redução de brilho em pisos molhados."
    },
    {
      icon: <ShieldCheck className="text-cyan-400" size={24} />,
      title: "Revestimento Hidrofóbico",
      desc: "Camada oleofóbica especial onde respingos de chuva, poeira e impressões digitais deslizam instantaneamente."
    }
  ];

  return (
    <section id="tech" className="relative py-28 px-6 bg-[#050508] border-t border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            ENGENHARIA DE PRECISÃO
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight mt-4">
            TECNOLOGIA SEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">COMPROMISSOS</span>
          </h2>
          <p className="mt-4 text-slate-400 font-sans font-light text-base sm:text-lg">
            Cada milímetro do AEROMAX APEX foi testado em túnel de vento e refinado por atletas profissionais.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white uppercase mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-white/5">
                <span>SPEC // 0{idx + 1}</span>
                <ArrowUpRight size={16} className="group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Specs Banner */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
              RECURSOS EXCLUSIVOS
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase mt-2">
              SISTEMA DE LENTES INTERCAMBIÁVEIS
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mt-3 font-sans leading-relaxed">
              Troque de lentes em menos de 5 segundos com nosso mecanismo patenteado de travamento magnético. Acompanha kit com 3 lentes de condições climáticas distintas (Sol Intenso, Nublado e Noturna).
            </p>
          </div>
          <button className="whitespace-nowrap px-8 py-4 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all">
            Ver Especificações Completas
          </button>
        </div>
      </div>
    </section>
  );
}
