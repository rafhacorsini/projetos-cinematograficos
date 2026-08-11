import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const ICON_HOME = 'https://res.cloudinary.com/dwmrunhxa/image/upload/v1785442241/Home_iumnhg.svg';

const LINKS = ['Visão geral', 'Fitness', 'Sono', 'Coração'];

/* A foto do hero é clara à esquerda (luminância ~244) e cinza médio à direita
   (~105), então nenhuma cor de texto sozinha se sustenta na barra inteira.
   Por isso o painel branco carrega o próprio fundo — a legibilidade não
   depende do que está atrás. A logo fica sobre a parte clara da foto. */
const TINTA = '#0f0f16';
const DIVISOR = '#cbc6c0';

/* Altura do quadrado da home e do painel — os dois andam juntos */
const ALTURA = 'h-14 sm:h-16';

export default function Project3Nav() {
  return (
    /* A margem lateral cresce no desktop (28px -> 64px). O bloco de texto do
       hero usa exatamente a mesma, para logo e título ficarem na mesma
       coluna — se mudar aqui, mudar em Project3Intro junto. */
    <header className="absolute inset-x-0 top-0 z-50 px-5 py-4 sm:px-7 sm:py-5 lg:px-16">
      <div className="relative flex items-center gap-4 sm:gap-6">
        {/* LOGO */}
        <span
          data-anim="nav-item"
          className="shrink-0 font-clash text-xl font-bold leading-none tracking-tighter sm:text-2xl"
          style={{ color: TINTA }}
        >
          VYTAL
        </span>

        {/* HOME + PAINEL: ocupam todo o resto da barra */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <a
            href="#"
            aria-label="Início"
            data-anim="nav-item"
            className={`grid ${ALTURA} aspect-square shrink-0 place-items-center rounded-lg transition-opacity hover:opacity-80`}
            style={{ backgroundColor: TINTA }}
          >
            <img src={ICON_HOME} alt="" draggable={false} className="h-6 w-6 sm:h-7 sm:w-7" />
          </a>

          {/* PAINEL BRANCO: começa ao lado da casa e vai até o fim */}
          {/* Vidro em vez de branco sólido: o painel flutua sobre a foto,
              então o blur tem conteúdo real para desfocar — é onde
              glassmorphism funciona sem virar enfeite. */}
          <div
            data-anim="nav-item"
            className={`flex ${ALTURA} min-w-0 flex-1 items-center rounded-lg bg-white/70 px-4 shadow-[0_8px_32px_rgba(15,15,22,0.08)] ring-1 ring-white/60 backdrop-blur-xl sm:px-7`}
          >
            {/* LINKS: alinhados à esquerda do painel.
                Antes eram centralizados na tela por posicionamento absoluto;
                agora vivem dentro do painel, no fluxo normal. Isso também
                dispensa o transform que os centralizava — e com ele o
                cuidado especial que a animação de entrada precisava ter. */}
            <nav className={`hidden ${ALTURA} items-center gap-6 lg:flex`}>
              {LINKS.map((label, i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <span className="h-full w-px shrink-0" style={{ backgroundColor: DIVISOR }} />
                  )}
                  <a
                    href="#"
                    className="relative whitespace-nowrap text-sm font-semibold leading-none tracking-[-0.28px] after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                    style={{ color: TINTA }}
                  >
                    {label}
                  </a>
                </React.Fragment>
              ))}
            </nav>

            {/* DIREITA: sacola + CTA */}
            <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
              <button
                type="button"
                aria-label="Carrinho, 0 itens"
                className="relative shrink-0 transition-opacity hover:opacity-70"
                style={{ color: TINTA }}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                <span
                  className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full text-[10px] font-semibold leading-none text-white tabular-nums"
                  style={{ backgroundColor: TINTA }}
                >
                  0
                </span>
              </button>

              <button
                type="button"
                className="group flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg pl-4 pr-3 text-sm font-semibold tracking-[-0.28px] text-white transition-opacity hover:opacity-85 active:scale-[0.98]"
                style={{ backgroundColor: TINTA }}
              >
                Comprar agora
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
