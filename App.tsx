
import React, { useState, useEffect } from 'react';
import { Exam, StudentSubmission, Question, UserSettings, PricingPlan, GradedExam, QuestionBankItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ExamSetup from './components/ExamSetup';
import UploadSection from './components/UploadSection';
import GradingDashboard from './components/GradingDashboard';
import GradingDetail from './components/GradingDetail';
import AnalyticsView from './components/AnalyticsView';
import QuestionPrep from './components/QuestionPrep';
import SettingsPanel from './components/SettingsPanel';
import ExamPaper from './components/ExamPaper';
import AboutView from './components/AboutView';
import HomePanel from './components/HomePanel';
import AdminPanel from './components/AdminPanel';
import PricingView from './components/PricingView';
import CheckoutView from './components/CheckoutView';
import ExamoraInfoView from './components/ExamoraInfoView';
import EduMetrikInfoView from './components/EduMetrikInfoView';
import PrivacyModal from './components/PrivacyModal';
import AnswerKeyUpload from './components/AnswerKeyUpload';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

import ExamoraHub from './components/ExamoraHub';
import EduMetrikHub from './components/EduMetrikHub';
import ReadHub from './components/ReadHub';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'setup' | 'upload' | 'dashboard' | 'detail' | 'analytics' | 'question-prep' | 'settings' | 'exam-paper' | 'info' | 'admin' | 'admin-login' | 'pricing' | 'checkout' | 'examora-info' | 'edumetrik-info' | 'answer-key-upload' | 'examora-hub' | 'edumetrik-hub' | 'read-hub'>('info');
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [examHistory, setExamHistory] = useState<GradedExam[]>([]);
  const [savedExams, setSavedExams] = useState<Exam[]>([]);
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [prefilledQuestions, setPrefilledQuestions] = useState<Question[]>([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    teacherName: '', schoolName: '', subject: '', theme: 'light', aiSensitivity: 'normal',
    feedbackTone: 'encouraging', analyticsLevel: 'basic', savedClasses: []
  });
  
  const [adminPassword, setAdminPassword] = useState("");

  const STORAGE_KEYS = {
    EXAM: 'notera_active_exam_v3',
    SUBMISSIONS: 'notera_active_submissions_v3',
    SETTINGS: 'notera_settings_v3',
    HISTORY: 'notera_history_v3',
    PRIVACY: 'notera_privacy_accepted_v3'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Sync user to Firestore
        setDoc(doc(db, 'users', u.uid), {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          role: 'user'
        }, { merge: true });
        
        if (currentView === 'info') setCurrentView('home');
        
        // Fetch saved exams and question bank
        const fetchData = async () => {
          try {
            // Fetch exams sorted by date
            const qExams = query(
              collection(db, 'exams'), 
              where('userId', '==', u.uid)
            );
            const examSnapshot = await getDocs(qExams);
            const exams = examSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Exam));
            // Sort locally to avoid needing a composite index immediately
            exams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setSavedExams(exams);

            const qBank = query(
              collection(db, 'questionBank'), 
              where('userId', '==', u.uid)
            );
            const bankSnapshot = await getDocs(qBank);
            const bankItems = bankSnapshot.docs.map(doc => doc.data() as QuestionBankItem);
            bankItems.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            setQuestionBank(bankItems);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
        fetchData();
      } else {
        setSavedExams([]);
        setQuestionBank([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedExam = localStorage.getItem(STORAGE_KEYS.EXAM);
    const savedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const privacyAccepted = localStorage.getItem(STORAGE_KEYS.PRIVACY);

    if (!privacyAccepted) setShowPrivacy(true);
    if (savedExam) setExam(JSON.parse(savedExam));
    if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
    if (savedHistory) setExamHistory(JSON.parse(savedHistory));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applyTheme(parsed.theme);
    }
  }, []);

  const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const saveToLocal = (updatedExam: Exam | null, updatedSubmissions: StudentSubmission[], updatedHistory?: GradedExam[]) => {
    if (updatedExam) localStorage.setItem(STORAGE_KEYS.EXAM, JSON.stringify(updatedExam));
    else localStorage.removeItem(STORAGE_KEYS.EXAM);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updatedSubmissions));
    if (updatedHistory) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  };

  const startNewExamFlow = (targetView: typeof currentView) => {
    localStorage.removeItem(STORAGE_KEYS.EXAM);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    setExam(null);
    setSubmissions([]);
    setPrefilledQuestions([]);
    setCurrentView(targetView);
    window.scrollTo(0, 0);
  };

  const handleSaveExamToSystem = async (examToSave: Exam) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'exams', examToSave.id), {
        ...examToSave,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      });
      console.log("Exam saved to system");
      setSavedExams(prev => {
        const exists = prev.find(e => e.id === examToSave.id);
        if (exists) {
          return prev.map(e => e.id === examToSave.id ? examToSave : e);
        }
        return [examToSave, ...prev];
      });
    } catch (error) {
      console.error("Error saving exam to system:", error);
    }
  };

  const handleExamSaved = async (newExam: Exam) => {
    setExam(newExam);
    setSubmissions([]); 
    saveToLocal(newExam, []);
    
    if (user) {
      await handleSaveExamToSystem(newExam);
    }
    
    setCurrentView('exam-paper');
  };

  const handleAnswerKeyParsed = (parsedData: Partial<Exam> & { questions: Question[] }, quickStart: boolean) => {
    setSubmissions([]);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    const newExamId = `exam-${Date.now()}`;
    if (quickStart) {
      const newExam: Exam = {
        id: newExamId, type: 'open-ended', classSection: parsedData.classSection || 'Belirtilmedi',
        courseName: parsedData.courseName || 'Genel Ders', examName: parsedData.examName || 'Yazılı Sınav',
        date: new Date().toISOString(), questions: parsedData.questions
      };
      setExam(newExam);
      saveToLocal(newExam, []);
      setCurrentView('upload');
    } else {
      setPrefilledQuestions(parsedData.questions);
      setExam(null);
      saveToLocal(null, []);
      setCurrentView('setup');
    }
  };

  const handleUploadComplete = (newSubmissions: StudentSubmission[]) => {
    const updated = [...submissions, ...newSubmissions];
    setSubmissions(updated);
    if (exam) {
      const avg = updated.reduce((a, b) => a + b.totalScore, 0) / (updated.length || 1);
      const gradedExam: GradedExam = { id: Date.now().toString(), exam, submissions: updated, averageScore: Math.round(avg), createdAt: new Date().toISOString() };
      const newHistory = [gradedExam, ...examHistory];
      setExamHistory(newHistory);
      saveToLocal(exam, updated, newHistory);
    }
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'info': return <AboutView onStart={() => setCurrentView('pricing')} />;
      case 'pricing': return <PricingView onSelectPlan={(p) => { if(p.price === 0) setCurrentView('home'); else { setSelectedPlan(p); setCurrentView('checkout'); }}} />;
      case 'checkout': return <CheckoutView plan={selectedPlan!} onCancel={() => setCurrentView('pricing')} onSuccess={() => { setSettings({...settings, isPremium: true}); setCurrentView('home'); }} />;
      case 'home': return <HomePanel onNavigate={startNewExamFlow} onResume={(v) => setCurrentView(v)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} savedExams={savedExams} questionBank={questionBank} onSelectSavedExam={(e) => { setExam(e); setCurrentView('exam-paper'); }} />;
      case 'examora-hub': return <ExamoraHub onNavigate={(v) => setCurrentView(v)} />;
      case 'edumetrik-hub': return <EduMetrikHub onNavigate={(v) => setCurrentView(v)} isExamSet={!!exam} />;
      case 'read-hub': return <ReadHub savedExams={savedExams} onSelectSavedExam={(e) => { setExam(e); setCurrentView('exam-paper'); }} onUploadAnswerKey={() => setCurrentView('answer-key-upload')} />;
      case 'answer-key-upload': return <AnswerKeyUpload onParsed={handleAnswerKeyParsed} onCancel={() => setCurrentView('home')} />;
      case 'setup': return <ExamSetup initialExam={exam} onSave={handleExamSaved} prefilledQuestions={prefilledQuestions} settings={settings} />;
      case 'upload': return <UploadSection exam={exam!} onUpload={handleUploadComplete} settings={settings} />;
      case 'dashboard': return <GradingDashboard submissions={submissions} settings={settings} onSelect={(id) => { setSelectedSubmissionId(id); setCurrentView('detail'); }} onReset={() => { setSubmissions([]); saveToLocal(exam, []); }} onViewAnalytics={() => setCurrentView('analytics')} />;
      case 'detail':
        const sub = submissions.find(s => s.id === selectedSubmissionId);
        return sub ? <GradingDetail submission={sub} exam={exam!} onBack={() => setCurrentView('dashboard')} onUpdate={(u) => { const updated = submissions.map(s => s.id === u.id ? u : s); setSubmissions(updated); saveToLocal(exam, updated); }} /> : null;
      case 'analytics': return <AnalyticsView submissions={submissions} exam={exam!} settings={settings} onBack={() => setCurrentView('dashboard')} history={examHistory} />;
      case 'question-prep': return <QuestionPrep onQuestionsGenerated={(q) => { setPrefilledQuestions(q); setCurrentView('setup'); }} />;
      case 'settings': return <SettingsPanel settings={settings} onUpdate={(s) => { setSettings(s); applyTheme(s.theme); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s)); }} onResetAll={() => { localStorage.clear(); window.location.reload(); }} savedExams={savedExams} questionBank={questionBank} onSelectSavedExam={(e) => { setExam(e); setCurrentView('exam-paper'); }} onNavigate={setCurrentView} />;
      case 'exam-paper': return <ExamPaper exam={exam!} settings={settings} onBack={() => setCurrentView('setup')} onStartGrading={() => setCurrentView('upload')} onSave={handleSaveExamToSystem} />;
      case 'admin-login': return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Admin Şifresi" className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 outline-none focus:border-notera-purple transition-all" />
          <button onClick={() => { if(adminPassword === "admin123") setCurrentView('admin'); }} className="px-12 py-4 bg-notera-purple text-white rounded-2xl font-black uppercase tracking-widest">Giriş Yap</button>
        </div>
      );
      case 'admin': return <AdminPanel />;
      default: return <HomePanel onNavigate={startNewExamFlow} onResume={(v) => setCurrentView(v)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} savedExams={savedExams} questionBank={questionBank} onSelectSavedExam={(e) => { setExam(e); setCurrentView('exam-paper'); }} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-notera-dark text-slate-100' : 'bg-notera-gray text-slate-900'}`}>
      {showPrivacy && <PrivacyModal onAccept={() => { setShowPrivacy(false); localStorage.setItem(STORAGE_KEYS.PRIVACY, 'true'); }} />}
      <Header 
        currentView={currentView} 
        onNavigate={(v) => setCurrentView(v)} 
        isExamSet={!!exam} 
        isPremium={settings.isPremium} 
        user={user} 
        onLogin={async () => {
          try {
            await signInWithGoogle();
          } catch (error: any) {
            console.error("Login Error:", error);
            if (error.code === 'auth/popup-closed-by-user') {
              // User closed the popup, ignore
            } else if (error.code === 'auth/network-request-failed') {
              alert("Bağlantı hatası: Lütfen internet bağlantınızı kontrol edin veya tarayıcınızın üçüncü taraf çerezlerine izin verdiğinden emin olun.");
            } else if (error.code === 'auth/internal-error' || error.code === 'auth/web-storage-unsupported') {
              alert("Tarayıcı kısıtlaması: Lütfen tarayıcınızın üçüncü taraf çerezlerine izin verdiğinden emin olun veya uygulamayı yeni bir sekmede açmayı deneyin.");
            } else {
              alert("Giriş sırasında bir hata oluştu (" + error.code + "): " + error.message + "\n\nLütfen tarayıcı ayarlarınızı kontrol edin veya uygulamayı yeni sekmede açın.");
            }
          }
        }} 
        onLogout={logout} 
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {renderView()}
      </main>
      <Footer onAdminClick={() => setCurrentView('admin-login')} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;
