
import React from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: any) => void;
  isExamSet: boolean;
  isPremium?: boolean;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isExamSet, isPremium, user, onLogin, onLogout }) => {
  const navItemClass = (id: string, activeColor: string) => `
    px-4 py-2 rounded-xl text-[11px] font-black transition-all tracking-widest uppercase whitespace-nowrap
    ${currentView === id 
      ? `${activeColor} text-white shadow-lg` 
      : 'text-slate-400 hover:text-notera-purple dark:text-slate-500 dark:hover:text-slate-300'}
    disabled:opacity-20 disabled:cursor-not-allowed
  `;

  return (
    <header className="bg-white/95 dark:bg-notera-dark/95 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-md no-print transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
        
        {/* LOGO & ANA PANEL */}
        <div className="flex items-center gap-10">
          <div className="flex flex-col leading-none cursor-pointer" onClick={() => onNavigate('home')}>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-notera-purple dark:text-white flex items-center">
              N<span className="logo-o">O</span>TERA
            </h1>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] mt-1 text-notera-turquoise">
              DEĞERLENDİRMENİN AKILLI YOLU
            </span>
          </div>
        </div>
        
        {/* BASİTLEŞTİRİLMİŞ NAVİGASYON */}
        <nav className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => onNavigate('read-hub')}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all ${
              currentView === 'read-hub' || currentView === 'upload' || currentView === 'answer-key-upload'
                ? 'bg-notera-purple text-white shadow-xl shadow-notera-purple/20' 
                : 'text-slate-400 hover:text-notera-purple bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            OKU
          </button>

          <button 
            onClick={() => onNavigate('examora-hub')}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all ${
              currentView === 'examora-hub' || currentView === 'question-prep' || currentView === 'setup'
                ? 'bg-notera-purple text-white shadow-xl shadow-notera-purple/20' 
                : 'text-slate-400 hover:text-notera-purple bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            EXAMORA
          </button>

          <button 
            onClick={() => onNavigate('edumetrik-hub')}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all ${
              currentView === 'edumetrik-hub' || currentView === 'dashboard' || currentView === 'analytics'
                ? 'bg-notera-turquoise text-white shadow-xl shadow-notera-turquoise/20' 
                : 'text-slate-400 hover:text-notera-turquoise bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            EDUMETRİK
          </button>
        </nav>

        {/* SAĞ AKSİYONLAR */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{user.displayName}</span>
                <button onClick={onLogout} className="text-[8px] font-bold text-rose-500 uppercase tracking-widest hover:underline mt-1">ÇIKIŞ YAP</button>
              </div>
              {user.photoURL && <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-xl border-2 border-notera-purple/20" referrerPolicy="no-referrer" />}
              
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-1"></div>
              
              <button onClick={() => onNavigate('settings')} className={`p-2.5 rounded-2xl border transition-all ${currentView === 'settings' ? 'bg-notera-purple text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
          ) : (
            <button onClick={onLogin} className="px-6 py-3 rounded-2xl bg-notera-purple text-white text-[10px] font-black uppercase tracking-widest hover:bg-notera-dark transition-all shadow-xl shadow-notera-purple/20">GİRİŞ / KAYIT</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
