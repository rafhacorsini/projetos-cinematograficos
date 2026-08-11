import React from 'react';
import { Instagram, Youtube, Linkedin } from 'lucide-react';

/* Mesma cor do painel da seção de precisão, que por sua vez saiu da média
   da foto do atleta — fecha o site com um tom que já apareceu antes. */
const FUNDO = '#645F5B';

/* O wordmark fica só um passo mais claro que o fundo. É relevo, não texto
   para ler: quem dá a forma é a máscara radial, que apaga as bordas. */
const WORDMARK = '#746F6A';

const NAV = ['Visão geral', 'Fitness', 'Sono', 'Coração'];

const RECURSOS = [
  'Primeiros passos: configure seu anel',
  'Blog',
  'Dormir melhor começa por entender seus dados',
];

export default function Project3Rodape() {
  return (
    <footer className="relative w-full overflow-hidden" style={{ backgroundColor: FUNDO }}>
      <div className="relative z-10 mx-auto w-full max-w-[82rem] px-6 pb-44 pt-16 sm:px-10 sm:pb-56 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* MARCA */}
          <div>
            <span className="font-clash text-2xl font-bold leading-none tracking-tighter text-white">
              VYTAL
            </span>
            <p className="mt-5 max-w-[20rem] font-sans text-sm leading-relaxed text-white/65">
              Transforme os dados do seu dia a dia em decisões de saúde melhores
              e bem-estar de longo prazo.
            </p>
            <nav className="mt-8 flex flex-col gap-3">
              {NAV.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-sans text-base font-medium text-white/85 transition-[transform,opacity] duration-300 hover:translate-x-1 hover:opacity-60"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* RECURSOS */}
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
              Recursos
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {RECURSOS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="inline-block font-sans text-sm leading-relaxed text-white/85 transition-[transform,opacity] duration-300 hover:translate-x-1 hover:opacity-60"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
              Contato
            </p>
            <address className="mt-5 not-italic font-sans text-sm leading-relaxed text-white/85">
              Av. Paulista, 1000<br />
              São Paulo, SP<br />
              contato@vytal.com.br
            </address>

            <div className="mt-7 flex items-center gap-3">
              {[Instagram, Youtube, Linkedin].map((Icone, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={['Instagram', 'YouTube', 'LinkedIn'][i]}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <Icone className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RODAPÉ DO RODAPÉ */}
        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright © 2026. Todos os direitos reservados.</span>
          <a href="#" className="transition-opacity hover:opacity-70">Política de Privacidade</a>
        </div>
      </div>

      {/* WORDMARK GIGANTE, sangrando na base */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none"
        style={{
          maskImage: 'radial-gradient(90% 110% at 50% 75%, #000 25%, rgba(0,0,0,0.55) 60%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(90% 110% at 50% 75%, #000 25%, rgba(0,0,0,0.55) 60%, transparent 95%)',
        }}
        aria-hidden="true"
      >
        <span
          className="block text-center font-clash font-bold leading-[0.78] tracking-[-0.045em]"
          style={{
            color: WORDMARK,
            fontSize: 'clamp(5rem, 21vw, 19rem)',
            /* Desce um pouco para as pernas das letras saírem pela borda,
               que é o que dá a sensação de sangria em vez de logo centralizado */
            marginBottom: '-0.16em',
          }}
        >
          VYTAL
        </span>
      </div>
    </footer>
  );
}
