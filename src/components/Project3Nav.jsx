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
    <header className="absolute inset-x-0 top-0 z-50 px-5 py-4 sm:px-7 sm:py-5">
      <div className="relative flex items-center gap-4 sm:gap-6">
        {/* LOGO */}
        <span
          data-anim="nav-item"
          className="shrink-0 font-sans text-xl font-bold leading-none tracking-tighter sm:text-2xl"
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
          <div
            data-anim="nav-item"
            className={`flex ${ALTURA} min-w-0 flex-1 items-center rounded-lg bg-white px-4 shadow-sm ring-1 ring-black/5 sm:px-7`}
          >
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
                className="flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg pl-4 pr-3 text-sm font-semibold tracking-[-0.28px] text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: TINTA }}
              >
                Comprar agora
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* LINKS: centralizados na barra, por cima do painel.
            Ficam fora do painel no DOM só para o centro ser o da tela,
            e não o do painel (que começa deslocado à direita). */}
        {/* data-anim separado do "nav-item": este elemento já usa translate
            do Tailwind para centralizar, então a entrada dele anima só a
            opacidade — animar y aqui faria o GSAP sobrescrever o transform
            e o menu sairia do centro. */}
        <nav
          data-anim="nav-links"
          className={`pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 ${ALTURA} items-center gap-6 lg:flex`}
        >
          {LINKS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <span className="h-full w-px shrink-0" style={{ backgroundColor: DIVISOR }} />
              )}
              <a
                href="#"
                className="pointer-events-auto whitespace-nowrap text-sm font-semibold leading-none tracking-[-0.28px] transition-opacity hover:opacity-60"
                style={{ color: TINTA }}
              >
                {label}
              </a>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </header>
  );
}
