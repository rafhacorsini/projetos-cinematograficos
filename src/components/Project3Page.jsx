import React from 'react';
import Project3Hero from './Project3Hero';
import Project3Rise from './Project3Rise';

/* O hero fica parado enquanto a seção seguinte sobe por cima dele.

   Usa position: fixed, e não sticky. O sticky seria o caminho natural, mas
   tanto o <body> (index.html) quanto o wrapper do App usam overflow-x-hidden
   — e overflow em qualquer eixo faz o elemento virar contêiner de scroll.
   O sticky então se prenderia a esses contêineres, que não rolam, e o hero
   simplesmente subiria junto com a página (medido: heroTop acompanhava o
   scroll em -174, -358, -757...). O fixed ignora ancestrais com overflow;
   só quebraria com ancestral transformado, o que não é o caso aqui.

   Quem cobre quem é o z-index: hero em z-0, seção que sobe em z-10. */
export default function Project3Page() {
  return (
    <div className="relative bg-[#050508]">
      {/* Espaçador: reserva no fluxo a altura que o hero ocupa na tela */}
      <div className="h-svh">
        <div className="fixed inset-0 z-0">
          <Project3Hero />
        </div>
      </div>

      <Project3Rise />
    </div>
  );
}
