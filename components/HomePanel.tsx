
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

const HomePanel: React.FC<HomePanelProps> = ({ onNavigate, onResume, isExamSet, hasSubmissions, savedExams = [], questionBank = [], onSelectSavedExam }) => {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-12">
      <div className="mb-16 text-center md:text-left space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">Hoş geldin.</h2>
        <p className="text-2xl font-medium text-slate-500 dark:text-slate-400">Bugün ne yapmak istiyorsun? <span className="text-notera-turquoise font-black underline underline-offset-8 decoration-notera-turquoise/30">NOTERA</span> seninle yönetir.</p>
      </div>

      {/* Kayıtlı Sınavlar ve Soru Bankası Özeti */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Kayıtlı Sınavlar */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 bg-notera-purple text-white rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              </span>
              Sınavlarım ({savedExams.length})
            </h3>
          </div>
          {savedExams.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
              {savedExams.map((e) => (
                <div 
                  key={e.id} 
                  onClick={() => onSelectSavedExam?.(e)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 hover:border-notera-purple transition-all cursor-pointer group shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 group-hover:text-notera-purple transition-colors line-clamp-1">{e.examName}</h4>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{e.courseName}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{e.classSection}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${e.type === 'multiple-choice' ? 'bg-amber-100 text-amber-600' : 'bg-notera-purple/10 text-notera-purple'}`}>
                    {e.type === 'multiple-choice' ? 'TEST' : 'YAZILI'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
               <p className="text-slate-400 font-bold text-sm italic">Henüz kayıtlı sınavınız yok.</p>
            </div>
          )}
        </div>

        {/* Soru Bankası Özeti */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </span>
              Soru Bankam ({questionBank.length})
            </h3>
          </div>
          {questionBank.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
              {/* Gruplanmış görünüm veya son eklenenler */}
              {questionBank.slice(0, 5).map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-[8px] font-black uppercase tracking-widest">{q.classLevel}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md text-[8px] font-black uppercase tracking-widest">{q.unitName}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 line-clamp-1">{q.text}</p>
                </div>
              ))}
              {questionBank.length > 5 && (
                <button 
                  onClick={() => onNavigate('setup')}
                  className="w-full py-4 text-notera-purple font-black text-[10px] uppercase tracking-widest hover:underline"
                >
                  Tüm Soruları Gör (Sınav Hazırlarken)
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
               <p className="text-slate-400 font-bold text-sm italic">Soru bankanız henüz boş.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12 p-1 bg-gradient-to-r from-notera-purple to-notera-turquoise rounded-[4rem] shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group" onClick={() => onNavigate('answer-key-upload')}>
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.8rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-notera-turquoise/10 rounded-full border border-notera-turquoise/20">
              <span className="w-2 h-2 bg-notera-turquoise rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-notera-turquoise uppercase tracking-widest">SIFIRLA & YENİ BAŞLAT</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">📸 Cevap Anahtarı <br/> ile Başla</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-md">Kendi hazırladığın cevap anahtarını fotoğrafla; AI senin yerine otomatik tanımlasın.</p>
          </div>
          <div className="w-24 h-24 md:w-40 md:h-40 bg-notera-purple text-white rounded-[3rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
             <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { id: 'question-prep', title: '✏️ SORU HAZIRLA (AI)', desc: 'Kazanımlara uygun soruları AI ile oluştur.', btn: '→ AI ASİSTANI BAŞLAT', color: 'hover:border-notera-purple', iconColor: 'bg-indigo-50 text-notera-purple' },
          { id: 'setup', title: '📝 SINAV OLUŞTUR (MANUEL)', desc: 'Soruları ve puanları manuel tanımla.', btn: '→ MANUEL TANIMLA', color: 'hover:border-notera-turquoise', iconColor: 'bg-notera-turquoise/10 text-notera-turquoise' },
          { id: 'upload', title: '📸 SINAV OKU', desc: 'Kağıtları yükle ve okumayı başlat.', btn: '→ OKUMAYA GİT', disabled: !isExamSet, useResume: true, color: 'hover:border-notera-purple', iconColor: 'bg-slate-100 text-slate-600' },
          { id: 'dashboard', title: '📊 ANALİZ & RAPOR', desc: 'EduMetrik verilerini incele.', btn: '→ VERİLERİ GÖR', disabled: !hasSubmissions, useResume: true, color: 'hover:border-notera-turquoise', iconColor: 'bg-indigo-50 text-indigo-500' }
        ].map((card) => (
          <div key={card.id} className={`bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 transition-all group flex flex-col justify-between h-[24rem] ${card.disabled ? 'opacity-30 grayscale pointer-events-none' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 ' + card.color}`} onClick={() => card.useResume ? onResume(card.id as any) : onNavigate(card.id as any)}>
            <div>
              <div className="flex items-start justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight max-w-[15rem] group-hover:text-notera-purple transition-colors">{card.title}</h3>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.iconColor} shadow-inner group-hover:scale-110 transition-transform`}><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">{card.desc}</p>
            </div>
            <button className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[11px] tracking-widest uppercase group-hover:bg-notera-purple transition-colors shadow-lg">
              {card.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePanel;
