import React, { useState, useEffect } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import UnifiedExperience from './components/UnifiedExperience';
import Project2Scrubber from './components/Project2Scrubber';
import Project3Page from './components/Project3Page';

export default function App() {
  const [currentProject, setCurrentProject] = useState(() => {
    const path = window.location.pathname;
    if (path === '/projeto3') return 'projeto3';
    if (path === '/projeto2') return 'projeto2';
    return 'projeto1';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/projeto3') setCurrentProject('projeto3');
      else if (path === '/projeto2') setCurrentProject('projeto2');
      else setCurrentProject('projeto1');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
      </div>
    </SmoothScroll>
  );
}
