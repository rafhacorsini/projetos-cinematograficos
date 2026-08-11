import React, { useState, useEffect } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import UnifiedExperience from './components/UnifiedExperience';
import Project2Scrubber from './components/Project2Scrubber';
import Project3Page from './components/Project3Page';
import Project4Page from './components/Project4Page';

/* Mapa de rotas em um lugar só. Antes a tradução caminho -> projeto estava
   escrita duas vezes (no estado inicial e no popstate), e cada projeto novo
   pedia edição nos dois — fácil de esquecer um. */
const ROTAS = {
  '/projeto2': 'projeto2',
  '/projeto3': 'projeto3',
  '/projeto4': 'projeto4',
};

const projetoDoCaminho = () => ROTAS[window.location.pathname] ?? 'projeto1';

export default function App() {
  const [currentProject, setCurrentProject] = useState(projetoDoCaminho);

  useEffect(() => {
    const aoNavegar = () => setCurrentProject(projetoDoCaminho());
    window.addEventListener('popstate', aoNavegar);
    return () => window.removeEventListener('popstate', aoNavegar);
  }, []);

  return (
    <SmoothScroll key={currentProject}>
      <div className="min-h-screen bg-[#050508] text-slate-100 overflow-x-hidden relative">
        {/* NAVEGAÇÃO DE ROTA DA APLICAÇÃO */}
        {currentProject === 'projeto1' && (
          <>
            <Header />
            <UnifiedExperience />
          </>
        )}

        {currentProject === 'projeto2' && <Project2Scrubber />}

        {currentProject === 'projeto3' && <Project3Page />}

        {currentProject === 'projeto4' && <Project4Page />}
      </div>
    </SmoothScroll>
  );
}
