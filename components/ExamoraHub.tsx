
import React from 'react';

interface ExamoraHubProps {
  onNavigate: (view: 'question-prep' | 'setup') => void;
}

const ExamoraHub: React.FC<ExamoraHubProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          EXAM<span className="text-notera-purple">ORA</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">Sınav hazırlama ve oluşturma merkezi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* HAZIRLA BLOGU */}
        <div 
          onClick={() => onNavigate('question-prep')}
          className="group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-notera-purple transition-all hover:-translate-y-2"
        >
          <div className="w-20 h-20 bg-notera-purple/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-notera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">HAZIRLA</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Yapay zeka desteğiyle ders notlarınızdan veya konularınızdan saniyeler içinde özgün sorular üretin.
          </p>
          <div className="flex items-center gap-2 text-notera-purple font-black text-xs uppercase tracking-widest">
            BAŞLA <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>

        {/* OLUŞTUR BLOGU */}
        <div 
          onClick={() => onNavigate('setup')}
          className="group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-notera-purple transition-all hover:-translate-y-2"
        >
          <div className="w-20 h-20 bg-notera-purple/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-notera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">OLUŞTUR</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Kendi sorularınızı girerek veya soru bankasından seçerek profesyonel sınav kağıtları tasarlayın.
          </p>
          <div className="flex items-center gap-2 text-notera-purple font-black text-xs uppercase tracking-widest">
            BAŞLA <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamoraHub;
