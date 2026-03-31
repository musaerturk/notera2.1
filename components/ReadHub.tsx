
import React from 'react';
import { Exam } from '../types';

interface ReadHubProps {
  savedExams: Exam[];
  onSelectSavedExam: (exam: Exam) => void;
  onUploadAnswerKey: () => void;
}

const ReadHub: React.FC<ReadHubProps> = ({ savedExams, onSelectSavedExam, onUploadAnswerKey }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          OKU <span className="text-notera-purple">&</span> DEĞERLENDİR
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">Sınav kağıtlarını okutmaya başlayın.</p>
      </div>

      <div className="space-y-12">
        {/* ÜST: HAZIR CEVAP ANAHTARI YÜKLE */}
        <div 
          onClick={onUploadAnswerKey}
          className="group cursor-pointer bg-notera-purple text-white p-10 rounded-[3rem] shadow-2xl shadow-notera-purple/20 hover:scale-[1.02] transition-all flex items-center justify-between gap-8 border-4 border-white dark:border-slate-800"
        >
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Hazır Cevap Anahtarı Yükle</h3>
              <p className="text-white/80 font-bold">Dışarıdan bir cevap anahtarı yükleyerek hemen okutmaya başlayın.</p>
            </div>
          </div>
          <svg className="w-12 h-12 text-white/40 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
          <div className="relative flex justify-center"><span className="px-6 bg-notera-gray dark:bg-notera-dark text-slate-400 font-black text-xs uppercase tracking-[0.3em]">VEYA</span></div>
        </div>

        {/* ALT: SİSTEMDEN SINAV SEÇ */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-4">
            <svg className="w-8 h-8 text-notera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" /></svg>
            Sistemde Hazırladığın Sınavı Seç
          </h3>
          
          {savedExams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedExams.map((exam) => (
                <div 
                  key={exam.id}
                  onClick={() => onSelectSavedExam(exam)}
                  className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-notera-purple transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-notera-purple/10 text-notera-purple text-[10px] font-black uppercase rounded-lg">{exam.classSection}</span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(exam.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm mb-1 group-hover:text-notera-purple transition-colors">{exam.examName}</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{exam.courseName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
              <p className="text-slate-400 font-bold">Henüz kaydedilmiş bir sınavınız bulunmuyor.</p>
              <button onClick={() => onSelectSavedExam({} as any)} className="mt-4 text-notera-purple font-black text-xs uppercase tracking-widest hover:underline">YENİ SINAV OLUŞTUR</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadHub;
