
import React, { useState, useEffect } from 'react';
import { Exam, Question, GradingStep, UserSettings, QuestionBankItem } from '../types';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

interface ExamSetupProps {
  initialExam: Exam | null;
  onSave: (exam: Exam) => void;
  prefilledQuestions?: Question[];
  settings: UserSettings;
}

const ExamSetup: React.FC<ExamSetupProps> = ({ initialExam, onSave, prefilledQuestions, settings }) => {
  const [examType, setExamType] = useState<'open-ended' | 'multiple-choice'>(initialExam?.type || 'open-ended');
  const [classSection, setClassSection] = useState(initialExam?.classSection || '');
  const [courseName, setCourseName] = useState(initialExam?.courseName || settings.branch || '');
  const [examName, setExamName] = useState(initialExam?.examName || '');
  const [termNo, setTermNo] = useState(initialExam?.termNo || '');
  const [examNo, setExamNo] = useState(initialExam?.examNo || '');
  const [teacherName, setTeacherName] = useState(initialExam?.teacherName || settings.teacherName || '');
  
  const [questions, setQuestions] = useState<Question[]>(initialExam?.questions || [
    { id: '1', text: '', expectedAnswer: examType === 'multiple-choice' ? 'A' : '', keywords: [], maxScore: 10, gradingSteps: [], unitName: '' }
  ]);

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<QuestionBankItem[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankFilter, setBankFilter] = useState({ classLevel: '', unitName: '' });

  useEffect(() => {
    if (prefilledQuestions && prefilledQuestions.length > 0) {
      setQuestions(prefilledQuestions.map(q => ({ ...q, unitName: q.unitName || '' })));
      setExamType('open-ended');
    }
  }, [prefilledQuestions]);

  const fetchBankQuestions = async () => {
    if (!auth.currentUser) return;
    setBankLoading(true);
    try {
      const q = query(collection(db, 'questionBank'), where('userId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data() as QuestionBankItem);
      setBankQuestions(items);
    } catch (error) {
      console.error("Error fetching bank:", error);
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    if (showQuestionBank) fetchBankQuestions();
  }, [showQuestionBank]);

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now().toString(), 
      text: '', 
      expectedAnswer: examType === 'multiple-choice' ? 'A' : '', 
      keywords: [], 
      maxScore: 10,
      gradingSteps: [],
      unitName: ''
    }]);
  };

  const saveToBank = async (q: Question) => {
    if (!auth.currentUser) {
      alert("Lütfen önce giriş yapın.");
      return;
    }
    if (!q.unitName || !classSection) {
      alert("Soru bankasına kaydetmek için Ünite Adı ve Sınıf bilgisi gereklidir.");
      return;
    }

    try {
      const bankItem: QuestionBankItem = {
        ...q,
        userId: auth.currentUser.uid,
        classLevel: classSection,
        subject: courseName,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'questionBank'), bankItem);
      alert("Soru başarıyla bankaya eklendi!");
    } catch (error) {
      console.error("Error saving to bank:", error);
      alert("Kaydedilirken bir hata oluştu.");
    }
  };

  const addFromBank = (q: QuestionBankItem) => {
    setQuestions([...questions, { ...q, id: Date.now().toString() }]);
    setShowQuestionBank(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const addGradingStep = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const steps = q.gradingSteps || [];
        return { ...q, gradingSteps: [...steps, { text: '', score: 0 }] };
      }
      return q;
    }));
  };

  const addQuickSteps = (qId: string, maxScore: number) => {
    const quickSteps: GradingStep[] = [
      { text: 'Cevap kapsamlı ve doğru (Tam Puan)', score: maxScore },
      { text: 'Cevap büyük oranda doğru, küçük eksikler var', score: Math.floor(maxScore * 0.75) },
      { text: 'Cevap kısmen doğru, temel fikir var', score: Math.floor(maxScore * 0.5) },
      { text: 'Cevap çok kısıtlı veya sadece giriş düzeyinde', score: Math.floor(maxScore * 0.25) }
    ];
    setQuestions(questions.map(q => q.id === qId ? { ...q, gradingSteps: quickSteps } : q));
  };

  const removeGradingStep = (qId: string, index: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.gradingSteps) {
        return { ...q, gradingSteps: q.gradingSteps.filter((_, i) => i !== index) };
      }
      return q;
    }));
  };

  const updateGradingStep = (qId: string, index: number, field: keyof GradingStep, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.gradingSteps) {
        const newSteps = [...q.gradingSteps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        return { ...q, gradingSteps: newSteps };
      }
      return q;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classSection.trim() || !courseName.trim() || !examName.trim() || questions.length === 0) return;
    onSave({
      id: initialExam?.id || Date.now().toString(),
      type: examType,
      classSection,
      courseName,
      examName,
      termNo,
      examNo,
      teacherName,
      date: new Date().toISOString(),
      questions
    });
  };

  const inputClasses = "w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1rem] focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-indigo-950 dark:text-white font-black text-lg placeholder-indigo-300 shadow-sm";
  const labelClasses = "block text-[11px] font-black text-indigo-900 dark:text-notera-turquoise mb-3 uppercase tracking-[0.25em]";

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-12 p-10 bg-notera-purple rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Sınav Yapılandırması</h2>
          <p className="text-slate-200 font-bold text-lg max-w-xl">
            {prefilledQuestions ? 'AI tarafından hazırlanan soruları düzenle veya onayla.' : 'Kendi hazırladığın sınavın puanlama kriterlerini (rubrik) belirle.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="button"
            onClick={addQuestion}
            className="flex-1 md:flex-none px-8 py-4 bg-notera-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            YENİ SORU EKLE
          </button>
          <button 
            type="button"
            onClick={() => setShowQuestionBank(true)}
            className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            BANKADAN EKLE
          </button>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setExamType('open-ended')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${examType === 'open-ended' ? 'bg-white dark:bg-slate-900 text-notera-purple shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Açık Uçlu
          </button>
          <button 
            type="button"
            onClick={() => setExamType('multiple-choice')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${examType === 'multiple-choice' ? 'bg-white dark:bg-slate-900 text-notera-purple shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Çoktan Seçmeli
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800">
             <h3 className="text-[10px] font-black text-notera-purple dark:text-notera-turquoise uppercase tracking-[0.4em]">SINAV GENEL BİLGİLERİ</h3>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Sınıf / Şube</label>
              <input type="text" value={classSection} onChange={(e) => setClassSection(e.target.value)} placeholder="Örn: 10-A" className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>Ders Adı</label>
              <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Örn: Biyoloji" className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>Dönem No</label>
              <input type="text" value={termNo} onChange={(e) => setTermNo(e.target.value)} placeholder="Örn: 1. Dönem" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Sınav No</label>
              <input type="text" value={examNo} onChange={(e) => setExamNo(e.target.value)} placeholder="Örn: 1. Yazılı" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Öğretmen Adı</label>
              <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Örn: Ali Yılmaz" className={inputClasses} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Sınav Başlığı (Kağıtta Görünecek)</label>
              <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Örn: 1. Dönem 1. Biyoloji Yazılısı" className={inputClasses} required />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group transition-all hover:border-notera-turquoise/30">
              <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                 <div className="flex items-center gap-5">
                    <span className="w-14 h-14 bg-notera-purple text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">{index + 1}</span>
                    <h4 className="text-notera-purple dark:text-white font-black text-xs uppercase tracking-[0.3em]">SORU VE PUAN TANIMI</h4>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                     type="button" 
                     onClick={() => saveToBank(q)}
                     className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl transition-all"
                     title="Soru Bankasına Kaydet"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                   </button>
                   <div className="flex flex-col gap-1 mr-4">
                     <button 
                       type="button" 
                       onClick={() => moveQuestion(index, 'up')} 
                       disabled={index === 0}
                       className="p-2 text-slate-400 hover:text-notera-turquoise disabled:opacity-20 transition-all"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
                     </button>
                     <button 
                       type="button" 
                       onClick={() => moveQuestion(index, 'down')} 
                       disabled={index === questions.length - 1}
                       className="p-2 text-slate-400 hover:text-notera-turquoise disabled:opacity-20 transition-all"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                     </button>
                   </div>
                   <button type="button" onClick={() => removeQuestion(q.id)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                 </div>
              </div>

              <div className="p-12 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Soru Metni (Elinizdeki kağıttakiyle aynı olmalı)</label>
                    <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} placeholder="Örn: Hücre nedir? Kısaca açıklayınız." className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Ünite Adı</label>
                    <input type="text" value={q.unitName || ''} onChange={(e) => updateQuestion(q.id, 'unitName', e.target.value)} placeholder="Örn: Hücre Bölünmesi" className={inputClasses} />
                  </div>
                </div>

                {examType === 'open-ended' ? (
                  <div className="space-y-10">
                    <div>
                      <label className={labelClasses}>Beklenen İdeal Cevap (Anahtar)</label>
                      <textarea value={q.expectedAnswer} onChange={(e) => updateQuestion(q.id, 'expectedAnswer', e.target.value)} placeholder="Örn: Canlıların en küçük yapı birimidir..." className={`${inputClasses} min-h-[140px] py-6 leading-relaxed`} required />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-8">
                         <div className="space-y-1">
                           <h5 className="text-[11px] font-black text-notera-purple dark:text-notera-turquoise uppercase tracking-[0.3em]">RUBRİK BASAMAKLARI</h5>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Hangi cevaba kaç puan verilecek?</p>
                         </div>
                         <div className="flex gap-3">
                          <button type="button" onClick={() => addQuickSteps(q.id, q.maxScore)} className="px-5 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-notera-turquoise hover:text-notera-turquoise transition-all">Şablon Ekle</button>
                          <button type="button" onClick={() => addGradingStep(q.id)} className="px-5 py-3 bg-notera-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-notera-dark shadow-lg transition-all">Yeni Kural +</button>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                        {q.gradingSteps?.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-4 items-center bg-white dark:bg-slate-900 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-slide-up">
                            <input 
                              type="text" 
                              value={step.text} 
                              onChange={(e) => updateGradingStep(q.id, sIdx, 'text', e.target.value)}
                              placeholder="Örn: Tanımı doğru yaptı ama örnek vermedi..." 
                              className="flex-grow bg-transparent border-none focus:ring-0 text-base font-bold text-slate-700 dark:text-slate-300" 
                            />
                            <div className="w-24 shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                              <input 
                                type="number" 
                                value={step.score} 
                                onChange={(e) => updateGradingStep(q.id, sIdx, 'score', parseInt(e.target.value) || 0)}
                                className="w-full bg-transparent border-none text-center font-black text-notera-turquoise text-lg" 
                              />
                            </div>
                            <button type="button" onClick={() => removeGradingStep(q.id, sIdx)} className="text-slate-300 hover:text-rose-500 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className={labelClasses}>Doğru Seçenek</label>
                    <div className="grid grid-cols-5 gap-4">
                      {['A', 'B', 'C', 'D', 'E'].map(opt => (
                        <button 
                          key={opt}
                          type="button"
                          onClick={() => updateQuestion(q.id, 'expectedAnswer', opt)}
                          className={`py-10 rounded-[2rem] font-black text-4xl border-4 transition-all ${q.expectedAnswer === opt ? 'bg-notera-purple border-notera-turquoise text-white shadow-xl scale-105' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300 hover:border-notera-purple'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-10 border-t border-slate-50 dark:border-slate-800">
                  <div className="w-48 bg-notera-purple/5 p-6 rounded-[2rem] border-2 border-notera-purple/10">
                    <label className="block text-[10px] font-black text-notera-purple dark:text-notera-turquoise mb-3 uppercase tracking-widest">SORU PUANI</label>
                    <input type="number" value={q.maxScore} onChange={(e) => updateQuestion(q.id, 'maxScore', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-slate-900 border-2 border-notera-purple/20 rounded-xl text-center text-3xl font-black text-notera-purple dark:text-white outline-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-12">
          <button type="button" onClick={addQuestion} className="flex-1 py-10 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-slate-400 dark:text-slate-600 hover:border-notera-turquoise hover:text-notera-turquoise transition-all font-black text-xs tracking-[0.4em] uppercase bg-slate-50/50 dark:bg-slate-800/20">
            Soru Ekle +
          </button>
          <button type="submit" className="flex-1 py-10 bg-notera-purple text-white rounded-[3rem] hover:bg-notera-dark font-black text-sm tracking-[0.4em] uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
            Sınavı Hazırla & Yazdır
          </button>
        </div>
      </form>

      {showQuestionBank && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Soru Bankası</h3>
                <p className="text-slate-500 dark:text-indigo-400 font-bold text-sm">Kaydettiğiniz soruları sınava ekleyin.</p>
              </div>
              <button 
                onClick={() => setShowQuestionBank(false)}
                className="w-14 h-14 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl shadow-lg flex items-center justify-center transition-all"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Üniteye göre filtrele..." 
                value={bankFilter.unitName}
                onChange={(e) => setBankFilter({...bankFilter, unitName: e.target.value})}
                className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-notera-purple"
              />
              <input 
                type="text" 
                placeholder="Sınıfa göre filtrele..." 
                value={bankFilter.classLevel}
                onChange={(e) => setBankFilter({...bankFilter, classLevel: e.target.value})}
                className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-notera-purple"
              />
            </div>

            <div className="flex-grow overflow-y-auto p-10 space-y-6">
              {bankLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-notera-purple border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sorular Yükleniyor...</p>
                </div>
              ) : bankQuestions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-bold text-lg italic">Henüz soru bankasına soru eklememişsiniz.</p>
                </div>
              ) : (
                bankQuestions
                  .filter(q => 
                    (q.unitName || '').toLowerCase().includes(bankFilter.unitName.toLowerCase()) &&
                    (q.classLevel || '').toLowerCase().includes(bankFilter.classLevel.toLowerCase())
                  )
                  .map((q, idx) => (
                    <div key={idx} className="p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] shadow-sm hover:shadow-md transition-all group flex justify-between items-center gap-6">
                      <div className="flex-grow">
                        <div className="flex gap-2 mb-3">
                          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{q.classLevel}</span>
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{q.unitName}</span>
                        </div>
                        <p className="font-bold text-slate-700 dark:text-slate-200 line-clamp-2">{q.text}</p>
                      </div>
                      <button 
                        onClick={() => addFromBank(q)}
                        className="px-6 py-3 bg-notera-purple text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                      >
                        EKLE
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSetup;
