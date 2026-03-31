import React, { useState } from 'react';
import { UserSettings, FeedbackTone, Exam, QuestionBankItem } from '../types';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onResetAll: () => void;
  savedExams: Exam[];
  questionBank: QuestionBankItem[];
  onSelectSavedExam: (exam: Exam) => void;
  onNavigate: (view: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onResetAll, savedExams, questionBank, onSelectSavedExam, onNavigate }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const [newClass, setNewClass] = useState('');

  const handleChange = (field: keyof UserSettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    // Tema değişikliği anlıktır, beklemeye gerek yok
    if (field === 'theme') onUpdate(updated);
    setIsSaved(false);
  };

  const addClass = () => {
    if (!newClass.trim()) return;
    const updatedClasses = [...(localSettings.savedClasses || []), newClass.trim()];
    handleChange('savedClasses', updatedClasses);
    setNewClass('');
  };

  const removeClass = (cls: string) => {
    const updatedClasses = localSettings.savedClasses.filter(c => c !== cls);
    handleChange('savedClasses', updatedClasses);
  };

  const handleSave = () => {
    onUpdate(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputClasses = "w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1rem] focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-indigo-950 dark:text-indigo-100 font-bold text-lg";
  const labelClasses = "block text-[11px] font-black text-slate-500 dark:text-indigo-400 mb-3 uppercase tracking-[0.25em]";

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      {/* ÜST BAŞLIK */}
      <div className="mb-12 p-10 bg-white dark:bg-slate-900 border-l-8 border-notera-purple rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Ayarlar & Profil</h2>
          <p className="text-slate-500 dark:text-indigo-400 font-bold text-lg">Eğitmen kimliğinizi ve tercihlerinizi yönetin.</p>
        </div>
        <button 
          onClick={() => onNavigate('pricing')}
          className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
        >
          PREMIUM'A YÜKSELT 👑
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL KOLON: PROFİL VE AYARLAR */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Eğitmen Profili</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Ad Soyad</label>
                <input type="text" value={localSettings.teacherName} onChange={(e) => handleChange('teacherName', e.target.value)} placeholder="Öğretmen Adı" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Branş / Ders</label>
                <input type="text" value={localSettings.branch || ''} onChange={(e) => handleChange('branch', e.target.value)} placeholder="Örn: Biyoloji" className={inputClasses} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Okul / Kurum</label>
              <input type="text" value={localSettings.schoolName} onChange={(e) => handleChange('schoolName', e.target.value)} placeholder="Okul Adı" className={inputClasses} />
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Kayıtlı Sınıflarım</h3>
              <div className="flex gap-2 mb-6">
                <input type="text" value={newClass} onChange={(e) => setNewClass(e.target.value)} placeholder="Örn: 10-A" className="flex-grow px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-notera-purple" />
                <button onClick={addClass} className="px-6 py-3 bg-notera-purple text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">EKLE</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localSettings.savedClasses && localSettings.savedClasses.length > 0 ? (
                  localSettings.savedClasses.map((cls, idx) => (
                    <div key={idx} className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase border border-indigo-100 dark:border-indigo-800">
                      {cls}
                      <button onClick={() => removeClass(cls)} className="text-rose-400 hover:text-rose-600 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic">Henüz bir sınıf eklenmedi.</p>
                )}
              </div>
            </div>
          </div>

          {/* SINAVLARIM BÖLÜMÜ */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6 flex justify-between items-center">
              Sınavlarım
              <span className="bg-notera-purple text-white px-2 py-1 rounded text-[10px]">{savedExams.length}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedExams.slice(0, 10).map((exam) => (
                <div key={exam.id} onClick={() => onSelectSavedExam(exam)} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-notera-purple transition-all cursor-pointer">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs mb-1 truncate">{exam.examName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{exam.classSection} • {new Date(exam.date).toLocaleDateString('tr-TR')}</p>
                </div>
              ))}
              {savedExams.length === 0 && <p className="text-slate-400 text-xs italic">Henüz kaydedilmiş sınav yok.</p>}
            </div>
          </div>

          {/* SORU BANKAM BÖLÜMÜ */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6 flex justify-between items-center">
              Soru Bankam
              <span className="bg-notera-turquoise text-white px-2 py-1 rounded text-[10px]">{questionBank.length}</span>
            </h3>
            <div className="space-y-3">
              {questionBank.slice(0, 3).map((q, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{q.text}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] font-black text-notera-turquoise uppercase">{q.classLevel}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">{q.unitName}</span>
                  </div>
                </div>
              ))}
              {questionBank.length === 0 && <p className="text-slate-400 text-xs italic">Soru bankası boş.</p>}
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: TERCİHLER */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
             <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">AI Geri Bildirim Tonu</h3>
             <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'encouraging', label: 'Teşvik Edici', icon: '🌟' },
                { id: 'academic', label: 'Akademik', icon: '🎓' },
                { id: 'concise', label: 'Kısa & Öz', icon: '⚡' }
              ].map(t => (
                <button key={t.id} onClick={() => handleChange('feedbackTone', t.id as FeedbackTone)} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${localSettings.feedbackTone === t.id ? 'bg-notera-purple border-notera-purple text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}>
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Görünüm Modu</h3>
            <div className="flex gap-4">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button key={t} onClick={() => handleChange('theme', t)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${localSettings.theme === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* KAYDET BUTONU ALTTA */}
          <button 
            onClick={handleSave}
            className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl ${isSaved ? 'bg-emerald-500 text-white' : 'bg-notera-purple text-white hover:scale-[1.02]'}`}
          >
            {isSaved ? 'AYARLAR KAYDEDİLDİ ✓' : 'AYARLARI KAYDET'}
          </button>
        </div>
      </div>

      <div className="mt-12 bg-rose-50 dark:bg-rose-900/10 p-10 rounded-[2.5rem] border-2 border-dashed border-rose-200 text-center">
        <p className="text-rose-600 dark:text-rose-400 font-bold mb-6 text-sm uppercase tracking-tight">Dikkat: Bu işlem tüm geçmiş sınav verilerinizi ve ayarlarınızı kalıcı olarak siler.</p>
        <button onClick={onResetAll} className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 transition-colors">TÜM VERİLERİ SIFIRLA</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
