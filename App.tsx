import React, { useState, useMemo, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import { QUESTION_BANK as LOCAL_QUESTION_BANK, EXAM_QUESTION_BANK as LOCAL_EXAM_QUESTION_BANK } from './constants';
import { Question, Domain, DomainScore } from './types';
import { CloudLightning, RotateCcw, Trophy, PieChart, LayoutGrid, CheckCircle, XCircle, Lock, PlayCircle, Timer, BrainCircuit, Eye, Save, Trash2, TrendingUp, Target, BarChart3, Settings, Download, Upload, Copy, Check, AlertTriangle, Cloud, Loader2, Database, RefreshCw, Plus, Minus, CheckSquare, Square, FileJson } from 'lucide-react';

const DOMAIN_WEIGHTS: Record<Domain, number> = {
  'Cloud Concepts': 0.24,
  'Security and Compliance': 0.30,
  'Cloud Technology and Services': 0.34,
  'Billing, Pricing, and Support': 0.12
};

const PACK_SIZE = 20;
const EXAM_SIZE = 65;
const UNSCORED_COUNT = 15; // Official AWS number of pre-test questions

// Type for stored progress of completed packs
interface PackProgress {
  packId: number;
  bestScore: number;
  isPassed: boolean;
}

// Global Statistics across all usage
interface GlobalStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  mistakeIds: number[]; // IDs of questions answered incorrectly
  domainStats: Record<Domain, { correct: number; total: number }>;
}

const INITIAL_GLOBAL_STATS: GlobalStats = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  mistakeIds: [],
  domainStats: {
    'Cloud Concepts': { correct: 0, total: 0 },
    'Security and Compliance': { correct: 0, total: 0 },
    'Cloud Technology and Services': { correct: 0, total: 0 },
    'Billing, Pricing, and Support': { correct: 0, total: 0 }
  }
};

// Type for in-progress exam state
interface ExamState {
  activeQuestions: Question[];
  unscoredIds: number[]; // Stored as array in JSON
  currentIndex: number;
  results: {questionId: number, isCorrect: boolean, domain: Domain}[];
  timestamp: number;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- NEW QUESTION FORM STATE TYPE ---
interface NewQuestionFormState {
    text: string;
    category: Domain;
    bank: 'PRACTICE' | 'EXAM';
    explanation: string;
    options: { id: string; text: string; isCorrect: boolean }[];
}

const INITIAL_NEW_QUESTION: NewQuestionFormState = {
    text: '',
    category: 'Cloud Concepts',
    bank: 'PRACTICE',
    explanation: '',
    options: [
        { id: 'A', text: '', isCorrect: false },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
    ]
};

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'QUIZ' | 'RESULT'>('HOME');
  const [quizMode, setQuizMode] = useState<'PACK' | 'EXAM' | 'MISTAKES'>('PACK');
  
  // Dynamic Question Banks (Initialized with local, updated from Cloud)
  const [questionBank, setQuestionBank] = useState<Question[]>(LOCAL_QUESTION_BANK);
  const [examQuestionBank, setExamQuestionBank] = useState<Question[]>(LOCAL_EXAM_QUESTION_BANK);
  const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(false); // Track if cloud fetch happened

  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activePackId, setActivePackId] = useState<number | null>(null);
  
  // IDs of questions that won't count towards the score (Hidden from user)
  const [unscoredIds, setUnscoredIds] = useState<Set<number>>(new Set());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{questionId: number, isCorrect: boolean, domain: Domain}[]>([]);
  const [showDetails, setShowDetails] = useState(false); // Controls visibility of detailed results for Packs
  
  // Persistence state
  const [progress, setProgress] = useState<Record<number, PackProgress>>({});
  const [savedExam, setSavedExam] = useState<ExamState | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats>(INITIAL_GLOBAL_STATS);

  // Data Sync Modal State
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [cloudKey, setCloudKey] = useState('');
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [cloudMessage, setCloudMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Admin State
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQ, setNewQ] = useState<NewQuestionFormState>(INITIAL_NEW_QUESTION);
  const [importTarget, setImportTarget] = useState<'PRACTICE' | 'EXAM'>('PRACTICE');

  // Load progress on mount AND Fetch Questions from Cloud
  useEffect(() => {
    // 1. Load Local Storage Data
    const storedProgress = localStorage.getItem('aws-prep-progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }

    const storedExam = localStorage.getItem('aws-prep-exam-state');
    if (storedExam) {
      setSavedExam(JSON.parse(storedExam));
    }

    const storedStats = localStorage.getItem('aws-prep-global-stats');
    if (storedStats) {
        setGlobalStats(JSON.parse(storedStats));
    }
    
    const storedKey = localStorage.getItem('aws-prep-cloud-key');
    if (storedKey) setCloudKey(storedKey);

    // 2. Fetch Questions from DB
    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/questions');
            if (res.ok) {
                const data = await res.json();
                if (data.questionBank && Array.isArray(data.questionBank)) {
                    setQuestionBank(data.questionBank);
                }
                if (data.examQuestionBank && Array.isArray(data.examQuestionBank)) {
                    setExamQuestionBank(data.examQuestionBank);
                }
                setIsQuestionsLoaded(true);
                console.log("Questions loaded from Cloud DB");
            }
        } catch (e) {
            console.warn("Could not load questions from cloud, using local fallback.", e);
        }
    };
    fetchQuestions();

  }, []);

  // Update Global Stats Helper
  const updateGlobalStats = (newResults: {questionId: number, isCorrect: boolean, domain: Domain}[]) => {
    const updatedStats = { ...globalStats };
    const currentMistakes = new Set(updatedStats.mistakeIds);

    newResults.forEach(r => {
        // Update Totals
        updatedStats.totalQuestionsAnswered += 1;
        if (r.isCorrect) updatedStats.totalCorrect += 1;

        // Update Domain Stats
        if (!updatedStats.domainStats[r.domain]) {
            updatedStats.domainStats[r.domain] = { correct: 0, total: 0 };
        }
        updatedStats.domainStats[r.domain].total += 1;
        if (r.isCorrect) {
            updatedStats.domainStats[r.domain].correct += 1;
        }

        // Manage Mistakes Logic
        if (!r.isCorrect) {
            // Add to mistakes if incorrect
            currentMistakes.add(r.questionId);
        } else {
            // Remove from mistakes if corrected
            if (currentMistakes.has(r.questionId)) {
                currentMistakes.delete(r.questionId);
            }
        }
    });

    updatedStats.mistakeIds = Array.from(currentMistakes);
    setGlobalStats(updatedStats);
    localStorage.setItem('aws-prep-global-stats', JSON.stringify(updatedStats));
  };

  // Generate Balanced Packs (Memoized) - Using dynamic questionBank
  const packs = useMemo(() => {
    const byDomain: Record<Domain, Question[]> = {
      'Cloud Concepts': [],
      'Security and Compliance': [],
      'Cloud Technology and Services': [],
      'Billing, Pricing, and Support': []
    };

    questionBank.forEach(q => byDomain[q.category]?.push(q));

    const distribution: Record<Domain, number> = {
      'Cloud Technology and Services': Math.round(PACK_SIZE * 0.34),
      'Security and Compliance': Math.round(PACK_SIZE * 0.30),
      'Cloud Concepts': Math.round(PACK_SIZE * 0.24),
      'Billing, Pricing, and Support': Math.round(PACK_SIZE * 0.12)
    };

    const totalPacks = Math.floor(questionBank.length / PACK_SIZE) || 1;
    const generatedPacks: Question[][] = [];
    const available = { ...byDomain };

    for (let i = 0; i < totalPacks; i++) {
      let pack: Question[] = [];
      (Object.keys(distribution) as Domain[]).forEach(domain => {
        const count = distribution[domain];
        const slice = available[domain]?.slice(0, count) || [];
        pack = [...pack, ...slice];
        if (available[domain]) {
             available[domain] = available[domain].slice(count);
        }
      });
      // Fill remaining if needed
      while (pack.length < PACK_SIZE) {
        const domainWithQ = (Object.keys(available) as Domain[]).find(d => available[d] && available[d].length > 0);
        if (!domainWithQ) break;
        pack.push(available[domainWithQ][0]);
        available[domainWithQ].shift();
      }
      generatedPacks.push(pack);
    }
    
    if (generatedPacks.length === 0 && questionBank.length > 0) {
        return [questionBank]; 
    }

    return generatedPacks;
  }, [questionBank]);

  // START A STANDARD PACK
  const startPack = (packIndex: number) => {
    const packQuestions = packs[packIndex];
    if (!packQuestions || packQuestions.length === 0) return;
    setActiveQuestions(shuffleArray(packQuestions));
    setActivePackId(packIndex);
    setQuizMode('PACK');
    setUnscoredIds(new Set()); 
    setCurrentIndex(0);
    setResults([]);
    setShowDetails(false);
    setView('QUIZ');
  };

  // START MISTAKE REVIEW
  const startMistakeReview = () => {
    // Find questions in BOTH dynamic banks that match mistake IDs
    const allQuestions = [...questionBank, ...examQuestionBank];
    const mistakeQuestions = allQuestions.filter(q => globalStats.mistakeIds.includes(q.id));
    
    // Shuffle and cap at 30 for a session
    const sessionQuestions = shuffleArray(mistakeQuestions).slice(0, 30);

    setActiveQuestions(sessionQuestions);
    setActivePackId(null);
    setQuizMode('MISTAKES');
    setUnscoredIds(new Set());
    setCurrentIndex(0);
    setResults([]);
    setShowDetails(false);
    setView('QUIZ');
  };

  // START NEW REAL EXAM SIMULATION (Uses examQuestionBank state)
  const startNewRealExam = () => {
    // 1. Get random questions ONLY from the EXAM BANK
    const allShuffled = shuffleArray<Question>(examQuestionBank);
    const selected = allShuffled.slice(0, EXAM_SIZE);
    
    // 2. Determine which ones are unscored
    const numUnscored = selected.length >= EXAM_SIZE ? UNSCORED_COUNT : 0;
    
    // Randomly pick indices to ignore
    const indices = Array.from({ length: selected.length }, (_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const ignoredIndices = shuffledIndices.slice(0, numUnscored);
    const ignoredIdsSet = new Set(ignoredIndices.map(idx => selected[idx].id));

    // Clear any previous saved exam
    localStorage.removeItem('aws-prep-exam-state');
    setSavedExam(null);

    setActiveQuestions(selected);
    setUnscoredIds(ignoredIdsSet);
    setQuizMode('EXAM');
    setActivePackId(null);
    setCurrentIndex(0);
    setResults([]);
    setShowDetails(false);
    setView('QUIZ');
  };

  // RESUME SAVED EXAM
  const resumeExam = () => {
    if (!savedExam) return;

    setActiveQuestions(savedExam.activeQuestions);
    setUnscoredIds(new Set(savedExam.unscoredIds));
    setQuizMode('EXAM');
    setActivePackId(null);
    setCurrentIndex(savedExam.currentIndex);
    setResults(savedExam.results);
    setShowDetails(false);
    setView('QUIZ');
  };

  // DISCARD SAVED EXAM
  const discardExam = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('aws-prep-exam-state');
    setSavedExam(null);
  };

  const handleNextQuestion = (wasCorrect: boolean) => {
    const currentQ = activeQuestions[currentIndex];
    const newResult = { 
        questionId: currentQ.id, 
        isCorrect: wasCorrect, 
        domain: currentQ.category 
    };
    
    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    const nextIndex = currentIndex + 1;

    // AUTO-SAVE EXAM PROGRESS
    if (quizMode === 'EXAM' && nextIndex < activeQuestions.length) {
      const stateToSave: ExamState = {
        activeQuestions,
        unscoredIds: Array.from(unscoredIds),
        currentIndex: nextIndex,
        results: updatedResults,
        timestamp: Date.now()
      };
      localStorage.setItem('aws-prep-exam-state', JSON.stringify(stateToSave));
      setSavedExam(stateToSave); // Update state so UI reflects it immediately if we quit
    }

    if (nextIndex < activeQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      finishQuiz(wasCorrect);
    }
  };

  // Manual Save & Quit
  const saveAndQuit = () => {
    if (quizMode === 'EXAM') {
      const stateToSave: ExamState = {
        activeQuestions,
        unscoredIds: Array.from(unscoredIds),
        currentIndex,
        results,
        timestamp: Date.now()
      };
      localStorage.setItem('aws-prep-exam-state', JSON.stringify(stateToSave));
      setSavedExam(stateToSave);
    }
    setView('HOME');
  };

  const finishQuiz = (lastAnswerCorrect: boolean) => {
    const currentQ = activeQuestions[currentIndex];
    const finalResults = [...results, { 
        questionId: currentQ.id, 
        isCorrect: lastAnswerCorrect, 
        domain: currentQ.category 
    }];
    
    // Update state so the result view has the full list
    setResults(finalResults);
    setShowDetails(false); // Default to hiding details for Packs

    // UPDATE GLOBAL STATS
    updateGlobalStats(finalResults);

    const report = calculateScore(finalResults);
    
    // Save Progress ONLY for packs
    if (quizMode === 'PACK' && activePackId !== null) {
      const newProgress = {
        ...progress,
        [activePackId]: {
          packId: activePackId,
          bestScore: Math.max(progress[activePackId]?.bestScore || 0, report.scaledScore),
          isPassed: report.isPassed || (progress[activePackId]?.isPassed || false)
        }
      };
      setProgress(newProgress);
      localStorage.setItem('aws-prep-progress', JSON.stringify(newProgress));
    }

    // Clear Saved Exam if we finished an Exam
    if (quizMode === 'EXAM') {
        localStorage.removeItem('aws-prep-exam-state');
        setSavedExam(null);
    }

    setView('RESULT');
  };

  const calculateScore = (currentResults: typeof results) => {
     let weightedScoreTotal = 0;
     const domainScores: DomainScore[] = [];

    // Filter results: In EXAM mode, exclude the "unscored" questions from calculation
    const scoredResults = quizMode === 'EXAM' 
        ? currentResults.filter(r => !unscoredIds.has(r.questionId))
        : currentResults;

    (Object.keys(DOMAIN_WEIGHTS) as Domain[]).forEach(domain => {
        const domainQuestions = scoredResults.filter(r => r.domain === domain);
        const correctCount = domainQuestions.filter(r => r.isCorrect).length;
        const totalCount = domainQuestions.length;
        
        const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
        
        domainScores.push({
            domain,
            correct: correctCount,
            total: totalCount,
            weight: DOMAIN_WEIGHTS[domain]
        });

        weightedScoreTotal += (accuracy * DOMAIN_WEIGHTS[domain]);
    });

    const scaledScore = Math.round(100 + (weightedScoreTotal * 900));
    const isPassed = scaledScore >= 700;

    return { domainScores, scaledScore, isPassed, totalScored: scoredResults.length };
  };

  const examReport = useMemo(() => {
    if (view !== 'RESULT') return null;
    return calculateScore(results);
  }, [view, results, unscoredIds]); // Re-calculate when view changes

  const currentRawScore = results.filter(r => r.isCorrect).length;
  const progressPercent = useMemo(() => {
    if (activeQuestions.length === 0) return 0;
    return ((currentIndex) / activeQuestions.length) * 100;
  }, [currentIndex, activeQuestions.length]);


  // --- CLOUD SYNC FUNCTIONS ---
  
  const handleCloudSave = async () => {
    if (!cloudKey.trim()) {
        setCloudMessage({type: 'error', text: 'Veuillez entrer une clé unique.'});
        return;
    }
    
    setIsLoadingCloud(true);
    setCloudMessage(null);
    localStorage.setItem('aws-prep-cloud-key', cloudKey.trim());

    const data = {
        progress,
        savedExam,
        globalStats,
        timestamp: Date.now()
    };

    try {
        const response = await fetch(`/api/sync?key=${encodeURIComponent(cloudKey.trim())}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (response.ok) {
            setCloudMessage({type: 'success', text: 'Sauvegarde réussie dans le Cloud !'});
        } else {
            throw new Error('Erreur serveur');
        }
    } catch (e) {
        setCloudMessage({type: 'error', text: 'Erreur de connexion au stockage.'});
    } finally {
        setIsLoadingCloud(false);
    }
  };

  const handleCloudLoad = async () => {
    if (!cloudKey.trim()) {
        setCloudMessage({type: 'error', text: 'Veuillez entrer votre clé unique.'});
        return;
    }

    setIsLoadingCloud(true);
    setCloudMessage(null);
    localStorage.setItem('aws-prep-cloud-key', cloudKey.trim());

    try {
        const response = await fetch(`/api/sync?key=${encodeURIComponent(cloudKey.trim())}`);
        
        if (response.status === 404) {
             setCloudMessage({type: 'error', text: 'Aucune donnée trouvée pour cette clé.'});
             setIsLoadingCloud(false);
             return;
        }

        if (!response.ok) throw new Error('Erreur');

        const data = await response.json();

        // Validate structure
        if (!data.globalStats || !data.progress) {
             throw new Error('Données corrompues');
        }

        // Apply Data
        setProgress(data.progress);
        setSavedExam(data.savedExam);
        setGlobalStats(data.globalStats);
        
        // Save locally
        localStorage.setItem('aws-prep-progress', JSON.stringify(data.progress));
        if (data.savedExam) localStorage.setItem('aws-prep-exam-state', JSON.stringify(data.savedExam));
        localStorage.setItem('aws-prep-global-stats', JSON.stringify(data.globalStats));

        setCloudMessage({type: 'success', text: 'Données restaurées avec succès !'});
        setView('HOME');
        
        // Optional: Close modal after short delay on success
        setTimeout(() => setShowSyncModal(false), 1500);

    } catch (e) {
        setCloudMessage({type: 'error', text: 'Impossible de récupérer les données.'});
    } finally {
        setIsLoadingCloud(false);
    }
  };

  // ADMIN FUNCTION: Add a single question to the state and upload to DB
  const handleAddNewQuestion = async () => {
      // Validation
      if (!newQ.text || !newQ.explanation) {
          setCloudMessage({type: 'error', text: "Le texte de la question et l'explication sont requis."});
          return;
      }
      const validOptions = newQ.options.filter(o => o.text.trim() !== '');
      if (validOptions.length < 2) {
          setCloudMessage({type: 'error', text: "Il faut au moins 2 options."});
          return;
      }
      const correctAnswers = newQ.options.filter(o => o.isCorrect).map(o => o.id);
      if (correctAnswers.length === 0) {
          setCloudMessage({type: 'error', text: "Veuillez cocher au moins une bonne réponse."});
          return;
      }

      setIsAdminLoading(true);
      
      try {
          // 1. Determine new ID (Max of both banks + 1)
          const allIds = [...questionBank, ...examQuestionBank].map(q => q.id);
          const maxId = Math.max(0, ...allIds);
          const newId = maxId + 1;

          // 2. Create Question Object
          const questionToAdd: Question = {
              id: newId,
              text: newQ.text,
              category: newQ.category,
              explanation: newQ.explanation,
              options: validOptions.map(o => ({ id: o.id, text: o.text })),
              correctAnswerIds: correctAnswers
          };

          // 3. Update Local State
          let updatedPracticeBank = [...questionBank];
          let updatedExamBank = [...examQuestionBank];

          if (newQ.bank === 'PRACTICE') {
              updatedPracticeBank.push(questionToAdd);
              setQuestionBank(updatedPracticeBank);
          } else {
              updatedExamBank.push(questionToAdd);
              setExamQuestionBank(updatedExamBank);
          }

          // 4. Upload to Cloud
          const response = await fetch('/api/questions', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  questionBank: updatedPracticeBank,
                  examQuestionBank: updatedExamBank
              })
          });
          
          if(response.ok) {
              setCloudMessage({type: 'success', text: `Question ajoutée avec succès (ID: ${newId})`});
              setIsQuestionsLoaded(true);
              // Reset form
              setNewQ(INITIAL_NEW_QUESTION);
              setShowAddQuestion(false);
          } else {
              throw new Error('Erreur upload');
          }

      } catch (e) {
          setCloudMessage({type: 'error', text: "Erreur lors de l'ajout. La base n'a pas été modifiée."});
      } finally {
          setIsAdminLoading(false);
      }
  };

  // ADMIN FUNCTION: Bulk Upload JSON
  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        setIsAdminLoading(true);
        try {
            const json = JSON.parse(e.target?.result as string);
            
            let newPracticeBank = [...questionBank];
            let newExamBank = [...examQuestionBank];
            let addedCount = 0;

            // Helper to process a list of questions
            const processQuestions = (list: any[]) => {
                // Find max ID globally to be safe (re-calculate each time or use a running counter)
                // We'll use a running counter strategy
                const allIds = [...newPracticeBank, ...newExamBank].map(q => q.id);
                let nextId = (allIds.length > 0 ? Math.max(...allIds) : 0) + 1;

                const validQuestions: Question[] = [];
                
                for (const item of list) {
                    // Basic validation
                    if (!item.text || !Array.isArray(item.options) || !Array.isArray(item.correctAnswerIds) || !item.category || !item.explanation) {
                        console.warn("Skipping invalid question:", item);
                        continue;
                    }

                    validQuestions.push({
                        ...item,
                        id: nextId++ // Override ID to ensure uniqueness
                    });
                }
                return validQuestions;
            };

            // CASE A: Object with specific keys (like constants.ts structure export)
            // supports keys: questionBank, QUESTION_BANK, examQuestionBank, EXAM_QUESTION_BANK
            if (!Array.isArray(json) && typeof json === 'object') {
                const practiceList = json.questionBank || json.QUESTION_BANK || [];
                const examList = json.examQuestionBank || json.EXAM_QUESTION_BANK || [];
                
                if (Array.isArray(practiceList) && practiceList.length > 0) {
                     const added = processQuestions(practiceList);
                     newPracticeBank = [...newPracticeBank, ...added];
                     addedCount += added.length;
                }
                if (Array.isArray(examList) && examList.length > 0) {
                     const added = processQuestions(examList);
                     newExamBank = [...newExamBank, ...added];
                     addedCount += added.length;
                }
            } 
            // CASE B: Array of questions (Simple list)
            else if (Array.isArray(json)) {
                 if (importTarget === 'PRACTICE') {
                     const added = processQuestions(json);
                     newPracticeBank = [...newPracticeBank, ...added];
                     addedCount += added.length;
                 } else {
                     const added = processQuestions(json);
                     newExamBank = [...newExamBank, ...added];
                     addedCount += added.length;
                 }
            } else {
                throw new Error("Format JSON non reconnu.");
            }

            if (addedCount === 0) {
                 throw new Error("Aucune question valide trouvée ou format vide.");
            }

            // Upload to Cloud
            const response = await fetch('/api/questions', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  questionBank: newPracticeBank,
                  examQuestionBank: newExamBank
              })
            });

            if (response.ok) {
                 setQuestionBank(newPracticeBank);
                 setExamQuestionBank(newExamBank);
                 setCloudMessage({type: 'success', text: `${addedCount} questions importées avec succès !`});
                 setIsQuestionsLoaded(true);
            } else {
                 throw new Error("Erreur lors de la sauvegarde cloud.");
            }

        } catch (err) {
            console.error(err);
            setCloudMessage({type: 'error', text: err instanceof Error ? err.message : "Erreur de lecture du fichier"});
        } finally {
            setIsAdminLoading(false);
            // Reset file input
            event.target.value = '';
        }
    };
    reader.readAsText(file);
  };

  // ADMIN FUNCTION: Upload local constants to Cloud DB (Reset)
  const handleUploadQuestionsToDB = async () => {
      setIsAdminLoading(true);
      try {
          const response = await fetch('/api/questions', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  questionBank: LOCAL_QUESTION_BANK,
                  examQuestionBank: LOCAL_EXAM_QUESTION_BANK
              })
          });
          
          if(response.ok) {
              setCloudMessage({type: 'success', text: 'Base de données réinitialisée avec les questions par défaut !'});
              // Refresh state
              setQuestionBank(LOCAL_QUESTION_BANK);
              setExamQuestionBank(LOCAL_EXAM_QUESTION_BANK);
              setIsQuestionsLoaded(true);
          } else {
              throw new Error('Erreur upload');
          }
      } catch (e) {
          setCloudMessage({type: 'error', text: "Erreur lors de l'upload des questions."});
      } finally {
          setIsAdminLoading(false);
      }
  };

  // Helpers for Question Form
  const updateOptionText = (idx: number, text: string) => {
      const newOpts = [...newQ.options];
      newOpts[idx].text = text;
      setNewQ({...newQ, options: newOpts});
  };

  const toggleOptionCorrect = (idx: number) => {
      const newOpts = [...newQ.options];
      newOpts[idx].isCorrect = !newOpts[idx].isCorrect;
      setNewQ({...newQ, options: newOpts});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-20">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="bg-orange-500 p-1.5 rounded-lg text-white">
              <CloudLightning size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">AWS<span className="text-slate-500 font-normal">Prep</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            {view === 'QUIZ' ? (
                <>
                    {quizMode === 'EXAM' && (
                        <button 
                            onClick={saveAndQuit}
                            className="text-base font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                        >
                            <Save size={18} />
                            <span className="hidden sm:inline">Sauvegarder & Quitter</span>
                        </button>
                    )}
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            {quizMode === 'EXAM' ? 'Progression' : 'Score Actuel'}
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                            {/* Hide score during Real Exam to mimic real conditions */}
                            {quizMode === 'EXAM' 
                                ? `${currentIndex + 1} / ${activeQuestions.length}`
                                : `${currentRawScore} / ${currentIndex}`
                            }
                        </span>
                    </div>
                </>
            ) : (
                <button
                    onClick={() => {
                        setCloudMessage(null);
                        setShowSyncModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-semibold"
                    title="Synchronisation Cloud & Admin"
                >
                    <Settings size={18} />
                    <span className="hidden sm:inline">Réglages</span>
                </button>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        {view === 'QUIZ' && (
          <div className="w-full bg-gray-100 h-1.5">
            <div 
              className="bg-orange-500 h-1.5 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </nav>

      {/* CLOUD SYNC & ADMIN MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings size={20} className="text-slate-500" />
                        Réglages
                    </h3>
                    <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* SECTION: CLOUD SYNC */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                             <Cloud size={18} className="text-blue-500" />
                             Synchronisation Utilisateur
                        </h4>
                        <p className="text-sm text-slate-500">
                            Sauvegardez votre progression (Stats, Examens en cours) pour la retrouver sur un autre appareil.
                        </p>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Identifiant Unique (Clé)
                            </label>
                            <input
                                type="text"
                                value={cloudKey}
                                onChange={(e) => setCloudKey(e.target.value)}
                                placeholder="ex: mon-pseudo-aws-123"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                            />
                        </div>

                        {cloudMessage && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
                                cloudMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {cloudMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                {cloudMessage.text}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                             <button 
                                onClick={handleCloudSave}
                                disabled={isLoadingCloud || !cloudKey}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingCloud ? <Loader2 size={24} className="animate-spin mb-1" /> : <Upload size={24} className="mb-1" />}
                                <span className="font-bold text-sm">Sauvegarder</span>
                            </button>

                            <button 
                                onClick={handleCloudLoad}
                                disabled={isLoadingCloud || !cloudKey}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-orange-100 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingCloud ? <Loader2 size={24} className="animate-spin mb-1" /> : <Download size={24} className="mb-1" />}
                                <span className="font-bold text-sm">Charger</span>
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    {/* SECTION: ADMIN DATABASE */}
                    <div className="space-y-4">
                         <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                             <Database size={16} className="text-slate-400" />
                             Zone Admin
                        </h4>
                        
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-700">État de la Base de Données</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isQuestionsLoaded ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {isQuestionsLoaded ? 'CLOUD CONNECTÉ' : 'LOCAL (DÉFAUT)'}
                                </span>
                             </div>

                             {/* --- BULK IMPORT SECTION --- */}
                             <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                                <h5 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                                    <FileJson size={16} className="text-blue-500" />
                                    Import Massif (JSON)
                                </h5>
                                <p className="text-xs text-slate-500 mb-3">
                                    Uploadez un fichier JSON contenant une liste de questions. Si le fichier contient un tableau simple, choisissez la destination ci-dessous.
                                </p>
                                
                                <div className="flex gap-2 mb-3">
                                    <select 
                                        value={importTarget}
                                        onChange={(e) => setImportTarget(e.target.value as any)}
                                        className="text-xs border rounded p-2 bg-white text-slate-700 font-medium outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="PRACTICE">Ajouter à : Entraînement</option>
                                        <option value="EXAM">Ajouter à : Examen Réel</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleJsonUpload}
                                        disabled={isAdminLoading}
                                        className="block w-full text-xs text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-xs file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        disabled:opacity-50 cursor-pointer"
                                    />
                                    {isAdminLoading && <div className="absolute right-0 top-0 p-2"><Loader2 size={16} className="animate-spin text-blue-500"/></div>}
                                </div>
                             </div>

                             {/* --- ADD NEW QUESTION TOGGLE --- */}
                             {!showAddQuestion ? (
                                 <button
                                     onClick={() => setShowAddQuestion(true)}
                                     className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                 >
                                     <Plus size={18} />
                                     Ajouter une question manuelle
                                 </button>
                             ) : (
                                 <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                                     <div className="flex justify-between items-center mb-4 border-b pb-2">
                                         <span className="font-bold text-gray-900">Nouvelle Question</span>
                                         <button onClick={() => setShowAddQuestion(false)} className="text-slate-400 hover:text-slate-600"><Minus size={18}/></button>
                                     </div>
                                     
                                     <div className="space-y-3">
                                         <div>
                                             <label className="text-xs font-bold text-slate-500 uppercase">Question</label>
                                             <textarea 
                                                className="w-full p-2 border rounded text-sm mt-1" 
                                                rows={2}
                                                value={newQ.text}
                                                onChange={(e) => setNewQ({...newQ, text: e.target.value})}
                                             />
                                         </div>
                                         
                                         <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                 <label className="text-xs font-bold text-slate-500 uppercase">Domaine</label>
                                                 <select 
                                                    className="w-full p-2 border rounded text-sm mt-1"
                                                    value={newQ.category}
                                                    onChange={(e) => setNewQ({...newQ, category: e.target.value as Domain})}
                                                 >
                                                     {Object.keys(DOMAIN_WEIGHTS).map(d => (
                                                         <option key={d} value={d}>{d}</option>
                                                     ))}
                                                 </select>
                                            </div>
                                            <div>
                                                 <label className="text-xs font-bold text-slate-500 uppercase">Banque</label>
                                                 <select 
                                                    className="w-full p-2 border rounded text-sm mt-1"
                                                    value={newQ.bank}
                                                    onChange={(e) => setNewQ({...newQ, bank: e.target.value as any})}
                                                 >
                                                     <option value="PRACTICE">Entraînement</option>
                                                     <option value="EXAM">Examen Réel</option>
                                                 </select>
                                            </div>
                                         </div>

                                         <div>
                                             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Réponses (Cochez la bonne)</label>
                                             <div className="space-y-2">
                                                 {newQ.options.map((opt, idx) => (
                                                     <div key={opt.id} className="flex items-center gap-2">
                                                         <button 
                                                            onClick={() => toggleOptionCorrect(idx)}
                                                            className={`p-1 rounded ${opt.isCorrect ? 'text-green-600' : 'text-slate-300 hover:text-slate-400'}`}
                                                         >
                                                             {opt.isCorrect ? <CheckSquare size={20} /> : <Square size={20} />}
                                                         </button>
                                                         <span className="font-mono text-xs font-bold w-4">{opt.id}</span>
                                                         <input 
                                                            type="text" 
                                                            className="flex-1 p-1.5 border rounded text-sm"
                                                            placeholder={`Option ${opt.id}`}
                                                            value={opt.text}
                                                            onChange={(e) => updateOptionText(idx, e.target.value)}
                                                         />
                                                     </div>
                                                 ))}
                                             </div>
                                         </div>

                                         <div>
                                             <label className="text-xs font-bold text-slate-500 uppercase">Explication</label>
                                             <textarea 
                                                className="w-full p-2 border rounded text-sm mt-1" 
                                                rows={2}
                                                value={newQ.explanation}
                                                onChange={(e) => setNewQ({...newQ, explanation: e.target.value})}
                                             />
                                         </div>

                                         <button 
                                            onClick={handleAddNewQuestion}
                                            disabled={isAdminLoading}
                                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
                                         >
                                             {isAdminLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                             Enregistrer & Uploader
                                         </button>
                                     </div>
                                 </div>
                             )}

                             {/* --- RESET/INIT BUTTON --- */}
                             <div className="mt-8 pt-4 border-t border-gray-100">
                                <p className="text-xs text-slate-400 mb-2 text-center">
                                   Zone Danger : Réinitialiser avec les données locales
                                </p>
                                <button
                                    onClick={handleUploadQuestionsToDB}
                                    disabled={isAdminLoading}
                                    className="w-full py-2 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={14} />
                                    Réinitialiser la BDD (Reset Factory)
                                </button>
                             </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* VIEW: HOME */}
        {view === 'HOME' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
            
            <div className="text-center space-y-2 py-4">
                <h2 className="text-4xl font-extrabold text-slate-900">Tableau de Bord</h2>
                <p className="text-lg text-slate-600">Préparez votre certification AWS Certified Cloud Practitioner</p>
            </div>

            {/* GLOBAL STATISTICS DASHBOARD */}
            {globalStats.totalQuestionsAnswered > 0 ? (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="text-blue-500" size={24} />
                        Statistiques Globales
                     </h3>
                     <span className="text-base text-slate-500">{globalStats.totalQuestionsAnswered} questions traitées</span>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* LEFT: Global Accuracy */}
                     <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Précision Moyenne</div>
                        <div className="text-6xl font-black text-slate-900 mb-2">
                           {Math.round((globalStats.totalCorrect / globalStats.totalQuestionsAnswered) * 100)}%
                        </div>
                        <div className="text-base text-slate-500">
                           {globalStats.totalCorrect} correctes / {globalStats.totalQuestionsAnswered} total
                        </div>
                     </div>

                     {/* RIGHT: Domain Breakdown */}
                     <div className="space-y-5">
                        {(Object.keys(globalStats.domainStats) as Domain[]).map(domain => {
                           const stats = globalStats.domainStats[domain];
                           const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                           let barColor = 'bg-gray-300';
                           if (stats.total > 0) {
                              if (percentage >= 75) barColor = 'bg-green-500';
                              else if (percentage >= 60) barColor = 'bg-yellow-500';
                              else barColor = 'bg-red-500';
                           }

                           return (
                              <div key={domain}>
                                 <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
                                    <span>{domain}</span>
                                    <span>{percentage}%</span>
                                 </div>
                                 <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${percentage}%` }}></div>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               </div>
            ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                    <TrendingUp className="text-blue-600 shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-xl text-blue-900">Démarrez votre progression</h3>
                        <p className="text-base text-blue-700 mt-1">Vos statistiques globales et votre analyse par domaine apparaîtront ici après votre premier quiz.</p>
                    </div>
                </div>
            )}

            {/* MISTAKE REVIEW CARD (Only if mistakes exist) */}
            {globalStats.mistakeIds.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                            <Target size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Rattrapage Ciblé</h3>
                            <p className="text-lg text-gray-600">Vous avez <span className="font-bold text-red-600">{globalStats.mistakeIds.length}</span> questions à revoir. Le meilleur moyen de progresser est de comprendre vos erreurs.</p>
                        </div>
                    </div>
                    <button 
                        onClick={startMistakeReview}
                        className="whitespace-nowrap px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                        <RotateCcw size={20} />
                        Corriger mes erreurs
                    </button>
                </div>
            )}

            {/* REAL EXAM SECTION */}
            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-start gap-6">
                    <div className="space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-500/30 px-3 py-1 rounded-full text-blue-200 text-sm font-semibold uppercase tracking-wide">
                            <BrainCircuit size={16} />
                            Conditions Réelles
                        </div>
                        <h3 className="text-3xl font-bold">Simulateur d'Examen Complet</h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            Questions scénarisées uniques. Le système exclut aléatoirement 15 questions du calcul final.
                        </p>
                        <div className="flex items-center gap-6 text-base text-slate-400">
                            <span className="flex items-center gap-2"><Timer size={18} /> 90 min</span>
                            <span className="flex items-center gap-2"><Lock size={18} /> 15 non notées</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        {savedExam ? (
                            <>
                                <button 
                                    onClick={resumeExam}
                                    className="flex-1 md:flex-initial whitespace-nowrap px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={22} />
                                    Reprendre (Q{savedExam.currentIndex + 1})
                                </button>
                                
                                <div className="flex gap-2 flex-1 md:flex-initial">
                                    <button 
                                        onClick={startNewRealExam}
                                        className="flex-1 whitespace-nowrap px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-xl transition-all flex items-center justify-center"
                                    >
                                        Nouveau
                                    </button>
                                    <button
                                        onClick={discardExam}
                                        title="Supprimer la sauvegarde"
                                        className="px-5 py-4 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-xl transition-all"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button 
                                onClick={startNewRealExam}
                                className="w-full md:w-auto whitespace-nowrap px-10 py-5 bg-white text-slate-900 hover:bg-blue-50 font-bold text-lg rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <PlayCircle size={24} />
                                Lancer Simulation
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* PACKS GRID */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <LayoutGrid size={24} className="text-orange-500" />
                    Paquets d'Entraînement Rapide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packs.map((pack, index) => {
                        const status = progress[index];
                        const isCompleted = status?.isPassed;
                        
                        return (
                            <div key={index} className={`relative bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md hover:-translate-y-1 ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
                                {isCompleted && (
                                    <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full shadow-sm z-10">
                                        <CheckCircle size={24} />
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                                            <CloudLightning size={28} />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pack #{index + 1}</h3>
                                    
                                    {status ? (
                                        <div className="mb-6 space-y-2">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-slate-900">{status.bestScore}</span>
                                                <span className="text-xs font-semibold text-slate-400 uppercase">/ 1000</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                                    status.isPassed 
                                                        ? 'bg-green-100 text-green-700 border-green-200' 
                                                        : 'bg-orange-100 text-orange-700 border-orange-200'
                                                }`}>
                                                    {status.isPassed ? 'RÉUSSI' : 'COMPLÉTÉ'}
                                                </span>
                                                <span className="text-sm text-slate-500">20 Questions</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-6">
                                            <p className="text-base text-slate-500 mb-2">Entraînement rapide sur 20 questions aléatoires.</p>
                                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded">
                                                Non commencé
                                            </span>
                                        </div>
                                    )}
                                    
                                    <button 
                                        onClick={() => startPack(index)}
                                        className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors border ${
                                            status 
                                            ? 'bg-white border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900'
                                            : 'bg-orange-600 border-orange-600 text-white hover:bg-orange-700'
                                        }`}
                                    >
                                        {status ? 'Améliorer Score' : 'Démarrer'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {packs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">Chargement de la banque de questions...</p>
                </div>
            )}
          </div>
        )}

        {/* VIEW: QUIZ */}
        {view === 'QUIZ' && activeQuestions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <QuestionCard
              question={activeQuestions[currentIndex]}
              onNext={handleNextQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={activeQuestions.length}
            />
          </div>
        )}

        {/* VIEW: RESULT */}
        {view === 'RESULT' && examReport && (
          <>
            {/* MODAL OVERLAY FOR PACKS */}
            {(quizMode === 'PACK' || quizMode === 'MISTAKES') && !showDetails && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                  <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden">
                     {/* Decorative background blob */}
                     <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>

                     <div className="mb-6 flex justify-center">
                        <div className={`p-4 rounded-full ${examReport.isPassed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                           {examReport.isPassed ? <Trophy size={48} /> : <CloudLightning size={48} />}
                        </div>
                     </div>

                     <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        {quizMode === 'MISTAKES' ? 'Session Terminée' : (examReport.isPassed ? 'Félicitations !' : 'Entraînement Terminé')}
                     </h2>
                     <p className="text-lg text-slate-500 mb-6">
                         {quizMode === 'MISTAKES' ? 'Vos statistiques globales ont été mises à jour.' : 'Vous avez complété ce paquet.'}
                     </p>

                     <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                        <div className="text-sm text-slate-400 uppercase font-semibold tracking-wider mb-1">Votre Score</div>
                        <div className="text-6xl font-black text-slate-900">
                           {Math.round((currentRawScore / activeQuestions.length) * 100)}%
                        </div>
                        <div className="text-lg font-medium text-slate-500 mt-2">
                           {currentRawScore} sur {activeQuestions.length} correctes
                        </div>
                     </div>

                     <div className="space-y-3">
                        {quizMode === 'PACK' && (
                            <button
                            onClick={() => startPack(activePackId!)}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                            >
                            <RotateCcw size={20} />
                            Améliorer Score
                            </button>
                        )}
                        
                        <button
                           onClick={() => setView('HOME')}
                           className="w-full py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-lg transition-colors"
                        >
                           Menu Principal
                        </button>

                        <button
                           onClick={() => setShowDetails(true)}
                           className="text-base text-slate-400 hover:text-slate-600 font-medium mt-4 flex items-center justify-center gap-1 w-full"
                        >
                           <Eye size={16} />
                           Revoir les réponses
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* FULL DETAILED VIEW (Rendered if EXAM or if Pack details are requested) */}
            {(quizMode === 'EXAM' || showDetails) && (
              <div className="flex flex-col items-center animate-in zoom-in-95 duration-500 pb-12">
                
                {/* Score Card */}
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    <div className={`${examReport.isPassed ? 'bg-green-600' : 'bg-red-600'} p-8 text-white text-center`}>
                        <Trophy className="mx-auto mb-3 opacity-90" size={56} />
                        <h2 className="text-4xl font-bold mb-1">{examReport.isPassed ? 'RÉUSSI' : 'ÉCHEC'}</h2>
                        <p className="opacity-90 font-medium text-lg">Score requis : 700</p>
                    </div>
                    
                    <div className="p-8 text-center border-b border-gray-100">
                        <div className="text-base text-slate-500 font-semibold uppercase tracking-wider mb-2">Score Échelonné</div>
                        <div className="text-7xl font-black text-slate-900 tracking-tight">
                            {examReport.scaledScore}
                            <span className="text-3xl text-slate-400 font-normal">/1000</span>
                        </div>
                        {quizMode === 'EXAM' && (
                            <div className="mt-6 inline-block bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-sm font-bold border border-blue-100">
                                Calculé sur {examReport.totalScored} questions (15 ignorées)
                            </div>
                        )}
                    </div>

                    {/* Domain Breakdown Table */}
                    <div className="p-8 bg-slate-50">
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <PieChart size={20} /> Détail par Domaine
                        </h3>
                        <div className="space-y-4">
                            {examReport.domainScores.map((ds) => (
                                <div key={ds.domain} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-base font-semibold text-gray-800">{ds.domain}</span>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">Poids: {Math.round(ds.weight * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${ds.total > 0 && (ds.correct/ds.total) > 0.7 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                                style={{ width: `${ds.total > 0 ? (ds.correct / ds.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <div className="text-base font-bold text-slate-700 w-16 text-right">
                                            {ds.correct}/{ds.total}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                    onClick={() => setView('HOME')}
                    className="px-8 py-4 bg-white border border-gray-300 text-gray-700 font-bold text-lg rounded-xl shadow-sm hover:bg-gray-50 transition-all"
                    >
                    Menu Principal
                    </button>
                    {quizMode === 'EXAM' && (
                        <button
                        onClick={startNewRealExam}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
                        >
                        <RotateCcw size={22} />
                        Réessayer
                        </button>
                    )}
                     {quizMode === 'PACK' && (
                        <button
                        onClick={() => startPack(activePackId!)}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
                        >
                        <RotateCcw size={22} />
                        Réessayer
                        </button>
                    )}
                </div>

                {/* Detailed Question Review - Shows UNSCORED items clearly */}
                <div className="w-full max-w-2xl mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 px-1">Revue des Réponses</h3>
                  <div className="grid gap-4">
                    {results.map((result, idx) => {
                      const question = activeQuestions[idx];
                      if (!question) return null;
                      
                      const isUnscored = unscoredIds.has(question.id);
                      
                      return (
                        <div key={question.id} className={`p-5 rounded-lg border flex gap-4 items-start transition-colors ${
                            isUnscored 
                                ? 'bg-gray-50 border-gray-200 opacity-75 grayscale-[0.5]' 
                                : result.isCorrect 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex-none pt-1">
                                {result.isCorrect ? (
                                    <CheckCircle className={isUnscored ? "text-gray-400" : "text-green-600"} size={24} />
                                ) : (
                                    <XCircle className={isUnscored ? "text-gray-400" : "text-red-500"} size={24} />
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-sm font-mono text-slate-500">Q{idx + 1}</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                                        isUnscored 
                                            ? 'text-slate-600 bg-slate-200 border border-slate-300' 
                                            : result.isCorrect 
                                                ? 'text-green-700 bg-green-100' 
                                                : 'text-red-700 bg-red-100'
                                    }`}>
                                        {isUnscored ? (
                                            <>
                                                <Lock size={12} />
                                                Non Notée
                                            </>
                                        ) : (
                                            result.isCorrect ? 'Correct' : 'Incorrect'
                                        )}
                                    </span>
                                    <span className="text-xs text-slate-400 border border-slate-200 px-1.5 rounded truncate max-w-[150px]">{question.category}</span>
                                </div>
                                <p className="text-gray-900 font-medium text-lg">{question.text}</p>
                                <p className="text-base text-slate-500 mt-2 line-clamp-3">{question.explanation}</p>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default App;