
import React from 'react';

interface EduMetrikHubProps {
  onNavigate: (view: 'dashboard' | 'analytics') => void;
  isExamSet: boolean;
}

const EduMetrikHub: React.FC<EduMetrikHubProps> = ({ onNavigate, isExamSet }) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          EDU<span className="text-notera-turquoise">METRİK</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">Analiz ve raporlama merkezi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ANALİZ BLOGU */}
        <div 
          onClick={() => isExamSet && onNavigate('dashboard')}
          className={`group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl transition-all hover:-translate-y-2 ${!isExamSet ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-notera-turquoise'}`}
        >
          <div className="w-20 h-20 bg-notera-turquoise/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-notera-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">ANALİZ</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Sınav sonuçlarını detaylıca inceleyin, öğrenci bazlı başarı grafiklerini görün.
          </p>
          <div className="flex items-center gap-2 text-notera-turquoise font-black text-xs uppercase tracking-widest">
            {isExamSet ? 'GÖRÜNTÜLE' : 'SINAV SEÇİLMELİ'} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>

        {/* RAPOR BLOGU */}
        <div 
          onClick={() => isExamSet && onNavigate('analytics')}
          className={`group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl transition-all hover:-translate-y-2 ${!isExamSet ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-notera-turquoise'}`}
        >
          <div className="w-20 h-20 bg-notera-turquoise/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-notera-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">RAPOR</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Kazanım bazlı analizler ve karşılaştırmalı raporlar ile sınıfın durumunu takip edin.
          </p>
          <div className="flex items-center gap-2 text-notera-turquoise font-black text-xs uppercase tracking-widest">
            {isExamSet ? 'GÖRÜNTÜLE' : 'SINAV SEÇİLMELİ'} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduMetrikHub;
