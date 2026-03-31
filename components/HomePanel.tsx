
import React from 'react';
import { Exam, QuestionBankItem } from '../types';

interface HomePanelProps {
  onNavigate: (view: 'question-prep' | 'upload' | 'dashboard' | 'analytics' | 'setup' | 'answer-key-upload') => void;
  onResume: (view: 'upload' | 'dashboard' | 'setup') => void;
  isExamSet: boolean;
  hasSubmissions: boolean;
  savedExams?: Exam[];
  questionBank?: QuestionBankItem[];
  onSelectSavedExam?: (exam: Exam) => void;
}

const HomePanel: React.FC<HomePanelProps> = ({ onNavigate, onResume, isExamSet, hasSubmissions }) => {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-12">
      <div className="mb-16 text-center space-y-6">
        <h2 className="text-6xl md:text-7xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">Hoş geldin.</h2>
        <p className="text-2xl font-medium text-slate-500 dark:text-slate-400">Eğitimde dijital dönüşümün akıllı yolu <span className="text-notera-turquoise font-black underline underline-offset-8 decoration-notera-turquoise/30">NOTERA</span> ile başlar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* OKU HUB */}
        <div 
          onClick={() => onNavigate('read-hub' as any)}
          className="group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-notera-purple transition-all hover:-translate-y-2 flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-notera-purple/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12 text-notera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">OKU</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed mb-8">Sınav kağıtlarını okutun ve değerlendirin.</p>
          <span className="px-6 py-3 bg-notera-purple text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">GİRİŞ YAP</span>
        </div>

        {/* EXAMORA HUB */}
        <div 
          onClick={() => onNavigate('examora-hub' as any)}
          className="group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-notera-purple transition-all hover:-translate-y-2 flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-notera-purple/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12 text-notera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">EXAMORA</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed mb-8">Sınav hazırlayın ve profesyonelce oluşturun.</p>
          <span className="px-6 py-3 bg-notera-purple text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">GİRİŞ YAP</span>
        </div>

        {/* EDUMETRİK HUB */}
        <div 
          onClick={() => onNavigate('edumetrik-hub' as any)}
          className="group cursor-pointer bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-notera-turquoise transition-all hover:-translate-y-2 flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-notera-turquoise/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12 text-notera-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">EDUMETRİK</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed mb-8">Analiz edin ve gelişim raporları alın.</p>
          <span className="px-6 py-3 bg-notera-turquoise text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">GİRİŞ YAP</span>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
