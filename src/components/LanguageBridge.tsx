import React, { useState, useEffect, useRef } from "react";
import { 
  Languages, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  History, 
  Trash2, 
  Bookmark, 
  Lightbulb, 
  RefreshCw, 
  Send, 
  Search, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Award, 
  Clock, 
  Star, 
  MessageSquare,
  ArrowRight,
  Info,
  HelpCircle,
  Smartphone,
  ChevronDown,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { apiFetch } from "../utils/api";

// Supported Indian Languages with native representations
export interface IndianLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  locale: string;
  langTag: string;
  listeningTxt: string;
}

const INDIAN_LANGUAGES: IndianLanguage[] = [
  { code: "Bengali", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", locale: "bn-IN", langTag: "bn", listeningTxt: "শুনছি..." },
  { code: "Hindi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", locale: "hi-IN", langTag: "hi", listeningTxt: "सुन रहा हूँ..." },
  { code: "Tamil", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", locale: "ta-IN", langTag: "ta", listeningTxt: "கேட்கிறேன்..." },
  { code: "Telugu", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", locale: "te-IN", langTag: "te", listeningTxt: "వింటున్నాను..." },
  { code: "Marathi", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", locale: "mr-IN", langTag: "mr", listeningTxt: "ऐकत आहे..." },
  { code: "Urdu", name: "Urdu", nativeName: "اردو", flag: "🇮🇳", locale: "ur-IN", langTag: "ur", listeningTxt: "سن رہا ہوں..." },
  { code: "Gujarati", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", locale: "gu-IN", langTag: "gu", listeningTxt: "સાંભળી રહ્યો છું..." },
  { code: "Kannada", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", locale: "kn-IN", langTag: "kn", listeningTxt: "ಕೇಳುತ್ತಿದ್ದೇನೆ..." },
  { code: "Malayalam", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", locale: "ml-IN", langTag: "ml", listeningTxt: "കേൾക്കുന്നു..." },
  { code: "Punjabi", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", locale: "pa-IN", langTag: "pa", listeningTxt: "ਸੁਣ ਰਿਹਾ ਹਾਂ..." },
  { code: "Odia", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", locale: "or-IN", langTag: "or", listeningTxt: "ଶୁଣୁଛି..." },
  { code: "Assamese", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳", locale: "as-IN", langTag: "as", listeningTxt: "শুনি আছোঁ..." }
];

// Curated daily situations with regional mock prompts
interface DailyPhrase {
  native: string;
  sourceLang: string;
  englishDirect: string;
  englishProfessional: string;
  englishNatural: string;
  tip: string;
}

const DAILY_SITUATIONS: { [category: string]: { icon: string; title: string; phrases: DailyPhrase[] } } = {
  interview: {
    icon: "💼",
    title: "Job Interview Prep",
    phrases: [
      {
        native: "আমি আমার আগের চাকরিতে অনেক কিছু শিখেছি",
        sourceLang: "Bengali",
        englishDirect: "I learned many things in my previous job.",
        englishProfessional: "I acquired significant expertise and valuable skills during my tenure in my previous role.",
        englishNatural: "I picked up a lot of great experience at my last job.",
        tip: "Pronounce 'previous' cleanly like 'pree-vi-us', avoiding skipping the 'i' sound."
      },
      {
        native: "मुझे कठिन परिस्थितियों में काम करना पसंद है",
        sourceLang: "Hindi",
        englishDirect: "I like to work in difficult situations.",
        englishProfessional: "I thrive under pressure and enjoy resolving complex professional challenges.",
        englishNatural: "I really enjoy working in fast-paced or challenging environments.",
        tip: "Let the sound of 'challenges' end with a crisp 'iz' sound (chal-len-jiz)."
      }
    ]
  },
  hotel: {
    icon: "🏨",
    title: "Arrival at Hotel",
    phrases: [
      {
        native: "என் பெயரில் ஒரு ரூம் புக் செய்யப்பட்டு உள்ளது",
        sourceLang: "Tamil",
        englishDirect: "A room is booked in my name.",
        englishProfessional: "I have a room reservation confirmed under my name.",
        englishNatural: "I've got a room booked under my name.",
        tip: "Connect 'under my' as one fluid segment: 'under-my'."
      },
      {
        native: "আমার রুমের চাবিটা কাজ করছে না",
        sourceLang: "Bengali",
        englishDirect: "My room key is not working.",
        englishProfessional: "The electronic key card for my room appears to be malfunctioning.",
        englishNatural: "My room key is acting up and won't unlock the door.",
        tip: "Say 'malfunctioning' with clear accentuation on the third syllable: 'mal-funk-shon-ing'."
      }
    ]
  },
  shopping: {
    icon: "🏬",
    title: "Shopping & Dining",
    phrases: [
      {
        native: "क्या इसपर कोई डिस्काउंट मिल सकता है?",
        sourceLang: "Hindi",
        englishDirect: "Can I get some discount on this?",
        englishProfessional: "Are there any active promotional offers or discounts applicable to this item?",
        englishNatural: "Can I get a bit of a deal on this, or is this your best price?",
        tip: "Focus on the short 'i' in 'discount' and stress the first syllable (DIS-count)."
      },
      {
        native: "বিলটা একটু ভাগ করে দেওয়া যাবে?",
        sourceLang: "Bengali",
        englishDirect: "Can we divide the bill?",
        englishProfessional: "Would it be possible to split our check evenly, please?",
        englishNatural: "Could we split the bill, please?",
        tip: "Pronounce 'split' sharply with an assertive 't' finish instead of stretching the vowel."
      }
    ]
  },
  office: {
    icon: "💬",
    title: "Office Small Talk",
    phrases: [
      {
        native: "ఆయన ఇవాళ సెలవులో ఉన్నారు",
        sourceLang: "Telugu",
        englishDirect: "He is on holiday today.",
        englishProfessional: "He is currently out of the office on annual leave today.",
        englishNatural: "He's taking a personal day off today.",
        tip: "Ensure 'currently' sounds crisp with a clear 'ent' syllable (cur-rent-ly)."
      },
      {
        native: "तुम्ही मला ही फाईल पाठवू शकता का?",
        sourceLang: "Marathi",
        englishDirect: "Can you send me this file?",
        englishProfessional: "Could you kindly forward the requested documents at your earliest convenience?",
        englishNatural: "Could you send over that file whenever you get a second?",
        tip: "The contraction 'whenever' should scroll smoothly into 'you' without a jerky break."
      }
    ]
  }
};

export interface HistoryItem {
  id: string;
  original: string;
  translated: string;
  sourceLang: string;
  timestamp: string;
  isFavorite: boolean;
  score: number | null;
}

export function LanguageBridge() {
  // Navigation Tabs inside Language Bridge
  const [activeSubTab, setActiveSubTab] = useState<"translate" | "talk" | "situations" | "history">("translate");
  
  // General Language Selector States
  const [selectedLang, setSelectedLang] = useState<IndianLanguage>(INDIAN_LANGUAGES[0]);
  
  // Voice & Text Translator states
  const [inputText, setInputText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [directTrans, setDirectTrans] = useState("");
  const [profTrans, setProfTrans] = useState("");
  const [natTrans, setNatTrans] = useState("");
  const [pronouncTip, setPronouncTip] = useState("");
  const [showNuances, setShowNuances] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };
  
  // Custom Speech Engine & Audio state
  const [isTranslatorListening, setIsTranslatorListening] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState<"direct" | "professional" | "natural" | null>(null);
  
  // AI Pronunciation Coach Practicing states
  const [practicingText, setPracticingText] = useState<string | null>(null);
  const [isCoachListening, setIsCoachListening] = useState(false);
  const [coachSSTranscript, setCoachSSTranscript] = useState("");
  const [coachEvaluating, setCoachEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{ score: number; feedback: string; suggestions: string } | null>(null);

  // Talk & Translate Live Conversation Translator states
  const [talkActive, setTalkActive] = useState(false);
  const [talkState, setTalkState] = useState<"idle" | "listening" | "translating" | "coaching">("idle");
  const [talkOriginal, setTalkOriginal] = useState("");
  const [talkTranslated, setTalkTranslated] = useState("");
  const [talkDirect, setTalkDirect] = useState("");
  const [talkProf, setTalkProf] = useState("");
  const [talkPronouncTip, setTalkPronouncTip] = useState("");
  const [talkMicrophoneActive, setTalkMicrophoneActive] = useState(false);

  // History & Favorites Vault
  const [historyList, setHistoryList] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("vani_bridge_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [historySearch, setHistorySearch] = useState("");

  // Refs for speech synthesis and recognition control
  const recognitionRef = useRef<any>(null);
  const coachRecognitionRef = useRef<any>(null);
  const talkRecognitionRef = useRef<any>(null);

  // Offline packs indicator status
  const [isOfflinePacksActive, setIsOfflinePacksActive] = useState(true);

  // Persist history updates
  const saveHistory = (items: HistoryItem[]) => {
    setHistoryList(items);
    localStorage.setItem("vani_bridge_history", JSON.stringify(items));
  };

  // Speak aloud helper - handles premium server-side TTS with browser fallback
  const speakAloud = async (textToSpeak: string, type: "direct" | "professional" | "natural") => {
    if (!textToSpeak) return;
    setTtsPlaying(type);

    try {
      // Call standard server side TTS endpoint
      const res = await apiFetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak, tone: "energetic" })
      });
      const data = await res.json();
      
      if (data && data.audio && !data.fallback) {
        // Convert base64 sound into playable Audio
        const audioUri = `data:audio/mp3;base64,${data.audio}`;
        const audio = new Audio(audioUri);
        audio.onended = () => setTtsPlaying(null);
        audio.play().catch((err) => {
          console.warn("Base64 Audio auto-play blocked, using speechSynthesis fallback:", err);
          fallbackToSpeechSynthesis(textToSpeak);
        });
      } else {
        fallbackToSpeechSynthesis(textToSpeak);
      }
    } catch (e) {
      console.warn("Server TTS failed, invoking offline speechSynthesis:", e);
      fallbackToSpeechSynthesis(textToSpeak);
    }
  };

  const fallbackToSpeechSynthesis = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN"; // standard Indian accent for optimal tutoring familiarity
      u.rate = 0.85;
      u.onend = () => setTtsPlaying(null);
      u.onerror = () => setTtsPlaying(null);
      window.speechSynthesis.speak(u);
    } else {
      setTtsPlaying(null);
    }
  };

  // Trigger translation from native Indian language to English
  const handleTranslate = async (textSourceCode?: string, overrideText?: string) => {
    const textToTranslate = overrideText !== undefined ? overrideText : inputText;
    if (!textToTranslate.trim()) return;

    setTranslating(true);
    setInputText(textToTranslate); // Sync if coming from voice
    
    // Reset coaching evaluations
    setPracticingText(null);
    setEvaluationResult(null);

    const activeLanguageName = textSourceCode || selectedLang.code;

    try {
      const response = await apiFetch("/api/bridge-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate, sourceLanguage: activeLanguageName })
      });
      const data = await response.json();
      
      if (data) {
        setDirectTrans(data.direct || "");
        setProfTrans(data.professional || "");
        setNatTrans(data.natural || "");
        setPronouncTip(data.pronunciationTip || "");

        // Save entry silently inside localStorage database history
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          original: textToTranslate,
          translated: data.natural || data.direct || "No translation loaded.",
          sourceLang: activeLanguageName,
          timestamp: new Date().toLocaleString("en-IN", { hour12: true }),
          isFavorite: false,
          score: null
        };
        saveHistory([newItem, ...historyList]);
      }
    } catch (err) {
      console.error("Translation pipeline error:", err);
    } finally {
      setTranslating(false);
    }
  };

  // Setup main Native Voice Input listener
  useEffect(() => {
    const SpeechRecObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecObj) {
      const recognition = new SpeechRecObj();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang.locale;

      recognition.onstart = () => {
        setIsTranslatorListening(true);
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleTranslate(selectedLang.code, transcript);
        }
        setIsTranslatorListening(false);
      };

      recognition.onerror = (err: any) => {
        console.error("Recognition crash:", err);
        setIsTranslatorListening(false);
      };

      recognition.onend = () => {
        setIsTranslatorListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  // Setup Pronunciation Coach Speech Recognition listener
  const startCoachVoiceRecognition = (expectedSentence: string) => {
    if (isCoachListening) {
      if (coachRecognitionRef.current) {
        coachRecognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecObj) {
      alert("Voice evaluation is not supported in this browser version. Please type standard letters.");
      return;
    }

    setPracticingText(expectedSentence);
    setCoachSSTranscript("");
    setEvaluationResult(null);

    const rec = new SpeechRecObj();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN"; // Evaluated in English standard Indian/Global dialect

    rec.onstart = () => {
      setIsCoachListening(true);
    };

    rec.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;
      setCoachSSTranscript(transcript);
      setIsCoachListening(false);

      if (transcript) {
        // Trigger Premium evaluation
        setCoachEvaluating(true);
        try {
          const evalRes = await apiFetch("/api/evaluate-pronunciation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedText: expectedSentence, spokenText: transcript })
          });
          const evalData = await evalRes.json();
          if (evalData) {
            setEvaluationResult({
              score: evalData.score || 70,
              feedback: evalData.feedback || "Good effort!",
              suggestions: evalData.suggestions || "Focus on sound linkages."
            });

            // Update score in the history item for accountability
            const updatedHistory = historyList.map(item => {
              if (item.translated === expectedSentence || item.original === inputText) {
                return { ...item, score: evalData.score };
              }
              return item;
            });
            saveHistory(updatedHistory);

            if (evalData.score >= 82) {
              confetti({
                particleCount: 80,
                spread: 60,
                colors: ["#BD53F4", "#00E0A4", "#ffffff"],
                origin: { y: 0.8 }
              });
            }
          }
        } catch (evalErr) {
          console.error("Pronunciation pipeline evaluation crash:", evalErr);
        } finally {
          setCoachEvaluating(false);
        }
      }
    };

    rec.onerror = (err: any) => {
      console.error("Coach speaking error:", err);
      setIsCoachListening(false);
    };

    rec.onend = () => {
      setIsCoachListening(false);
    };

    coachRecognitionRef.current = rec;
    rec.start();
  };

  // Toggle voice recognition for text translator native language
  const toggleTranslatorVoice = () => {
    if (!recognitionRef.current) {
      alert("Standard browser mic setup is unavailable. Please click option parameters.");
      return;
    }
    if (isTranslatorListening) {
      recognitionRef.current.stop();
    } else {
      setSelectedLang(selectedLang); // trigger binding
      recognitionRef.current.lang = selectedLang.locale;
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition already active:", err);
      }
    }
  };

  // --- Real-time "Talk and Translate" Module Handler ---
  const startTalkModeListening = () => {
    const SpeechRecObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecObj) {
      alert("Voice translation is unsupported in this browser.");
      return;
    }

    setTalkState("listening");
    setTalkOriginal("");
    setTalkTranslated("");
    setTalkMicrophoneActive(true);

    const rec = new SpeechRecObj();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = selectedLang.locale;

    rec.onstart = () => {};

    rec.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;
      setTalkOriginal(transcript);
      setTalkState("translating");
      setTalkMicrophoneActive(false);

      if (transcript) {
        try {
          const res = await apiFetch("/api/bridge-translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: transcript, sourceLanguage: selectedLang.code })
          });
          const transResult = await res.json();
          
          if (transResult && transResult.natural) {
            setTalkTranslated(transResult.natural);
            setTalkDirect(transResult.direct || "");
            setTalkProf(transResult.professional || "");
            setTalkPronouncTip(transResult.pronunciationTip || "");
            setTalkState("coaching");

            // Save translation entry elegantly inside database history
            const historyObj: HistoryItem = {
              id: Date.now().toString(),
              original: transcript,
              translated: transResult.natural,
              sourceLang: selectedLang.code,
              timestamp: new Date().toLocaleString("en-IN", { hour12: true }),
              isFavorite: false,
              score: null
            };
            saveHistory([historyObj, ...historyList]);

            // Auto speak translated response using Gemini premium TTS or Web Synth
            await speakAloud(transResult.natural, "natural");
          } else {
            setTalkState("idle");
          }
        } catch (err) {
          console.error("Live talk translate pipeline failed:", err);
          setTalkState("idle");
        }
      } else {
        setTalkState("idle");
      }
    };

    rec.onerror = (e: any) => {
      console.warn("Live chat listen endpoint error:", e);
      setTalkState("idle");
      setTalkMicrophoneActive(false);
    };

    rec.onend = () => {
      setTalkMicrophoneActive(false);
    };

    talkRecognitionRef.current = rec;
    rec.start();
  };

  // Quick select category ситуации practice launcher
  const handleSelectSituationPhrase = (phrase: DailyPhrase) => {
    setInputText(phrase.native);
    setDirectTrans(phrase.englishDirect);
    setProfTrans(phrase.englishProfessional);
    setNatTrans(phrase.englishNatural);
    setPronouncTip(phrase.tip);
    
    // Switch directly to primary practice screen
    setActiveSubTab("translate");

    // Play TTS automatically
    speakAloud(phrase.englishNatural, "natural");

    // Scroll to results seamlessly
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 200);
  };

  // Manage Favorites
  const toggleFavorite = (itemId: string) => {
    const updated = historyList.map(item => {
      if (item.id === itemId) return { ...item, isFavorite: !item.isFavorite };
      return item;
    });
    saveHistory(updated);
  };

  const deleteHistoryItem = (itemId: string) => {
    const updated = historyList.filter(item => item.id !== itemId);
    saveHistory(updated);
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to permanently clear all Language Bridge practice history?")) {
      saveHistory([]);
    }
  };

  // Filtered History explorer list
  const filteredHistory = historyList.filter(item => {
    return (
      item.original.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.translated.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.sourceLang.toLowerCase().includes(historySearch.toLowerCase())
    );
  });

  return (
    <div id="language-bridge-center" className="min-h-screen bg-[#F3F4F6] text-zinc-800 flex flex-col font-sans pb-24 relative select-none overflow-hidden">
      
      {/* Glow Orbs background decor */}
      <div className="absolute top-[-50px] left-[-50px] w-80 h-80 rounded-full bg-[#BD53F4]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-50px] w-96 h-96 rounded-full bg-[#00E0A4]/3 blur-[150px] pointer-events-none z-0" />

      {/* ACCESS HEADER BAR */}
      <header className="relative z-10 px-5 py-4 border-b border-[#E5E7EB] bg-white/85 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#BD53F4]/10 to-[#BD53F4]/5 border border-[#BD53F4]/20 rounded-xl">
            <Languages className="w-5 h-5 text-[#BD53F4]" />
          </div>
          <div className="text-left">
            <h1 className="text-base font-extrabold text-zinc-900 tracking-wide flex items-center gap-1">
              Language Bridge <Sparkles className="w-3.5 h-3.5 text-[#BD53F4] animate-pulse" />
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium">Speak in your language. Learn in English.</p>
          </div>
        </div>

        {/* Status cache metrics */}
        <div className="hidden sm:flex items-center gap-2 bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1 rounded-full text-[10px] text-zinc-600 font-bold">
          <span className="w-1.5 h-1.5 bg-[#00E0A4] rounded-full animate-ping" />
          <span>VANI Friendly Personal Coach</span>
        </div>
      </header>

      {/* CORE INNER TABS BAR */}
      <div className="relative z-10 px-4 py-2 mt-2 bg-white border-b border-[#E5E7EB] flex gap-1 bg-white/80">
        {[
          { id: "translate", label: "Bridge Translator", icon: <Languages className="w-3.5 h-3.5" /> },
          { id: "talk", label: "Talk & Translate", icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: "situations", label: "Daily Situations", icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: "history", label: "HistoryVault", icon: <History className="w-3.5 h-3.5" /> }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveSubTab(tb.id as any)}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold tracking-tight flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === tb.id 
                ? "bg-gradient-to-r from-[#BD53F4] to-[#8B2FC9] text-white shadow-md shadow-[#BD53F4]/15 scale-[1.02]" 
                : "text-zinc-500 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60"
            }`}
          >
            {tb.icon}
            <span className="hidden xs:inline">{tb.label}</span>
          </button>
        ))}
      </div>

      {/* PAGE CONTAINER BODY */}
      <main className="relative z-10 flex-1 p-4 max-w-3xl mx-auto w-full flex flex-col gap-4 text-left">
        
        {/* TAB 1: BRIDGE TRANSLATOR */}
        {activeSubTab === "translate" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 flex flex-col">
            
            {/* Quick explanation tag */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex gap-3 text-sm items-start shadow-sm">
              <span className="text-xl">💡</span>
              <div>
                <p className="font-extrabold text-[#7C3AED] text-xs uppercase tracking-wider mb-0.5">Translation direction</p>
                <p className="text-[11px] text-purple-950 leading-relaxed">
                  VANI translates local regional thoughts <strong className="text-purple-900 font-extrabold">strictly to fluent, grammatically correct English</strong>, and coaches you to speak it out loud confidently.
                </p>
              </div>
            </div>

            {/* Language Selection Grid bar */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block text-left">Select Native Language</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {INDIAN_LANGUAGES.map((lang) => {
                  const isSel = selectedLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setDirectTrans("");
                        setProfTrans("");
                        setNatTrans("");
                        setPronouncTip("");
                        setEvaluationResult(null);
                        setPracticingText(null);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                        isSel 
                          ? "bg-[#BD53F4]/10 border-[#BD53F4] text-[#7C3AED] font-extrabold shadow-[0_0_12px_rgba(189,83,244,0.1)]" 
                          : "bg-[#F9FAFB] border-zinc-200 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Translator inputs (White Premium UI Portion) */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 flex flex-col gap-3 shadow-xl relative text-zinc-800">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                <span className="text-[10.5px] text-[#4F46E5] font-black uppercase tracking-wider block">Thought Translation Box</span>
                <span className="text-[9.5px] bg-[#F3F4F6] text-[#475569] font-bold px-2 py-0.5 rounded-md border border-gray-200">
                  Detects {selectedLang.code}
                </span>
              </div>

              <div className="relative mt-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Select language & type in native script or English text (e.g. "Mujhe kal chutti chahiye..." or আমার কাল দিনটা ভালো কাটল...)`}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] rounded-xl p-3.5 pr-14 text-sm font-semibold h-24 focus:outline-none focus:ring-2 focus:ring-[#BD53F4]/20 focus:border-[#BD53F4] placeholder-zinc-400 transition-all resize-none"
                />
                
                {/* Voice capture widget */}
                <button
                  onClick={toggleTranslatorVoice}
                  className={`absolute right-3.5 bottom-3.5 p-2.5 rounded-full transition-all active:scale-95 ${
                    isTranslatorListening
                      ? "bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                      : "bg-[#F3F4F6] text-[#BD53F4] hover:bg-[#E5E7EB] hover:text-[#8B2FC9]"
                  }`}
                  title="Practice via mic"
                >
                  <Mic className="w-4.5 h-4.5 shrink-0" />
                </button>
              </div>

              {/* Animated wave showing status */}
              {isTranslatorListening && (
                <div className="flex gap-1.5 items-center justify-center p-2 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 font-black text-xs">
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping mr-1" />
                  <span lang={selectedLang.langTag} className="font-extrabold text-rose-700">{selectedLang.listeningTxt} Speak in {selectedLang.code}...</span>
                  {/* Min waveform bars */}
                  <div className="flex items-center gap-0.5 h-3 ml-2 shrink-0">
                    <span className="w-0.5 inline-block bg-rose-500 h-2 animate-wave-1" />
                    <span className="w-0.5 inline-block bg-rose-500 h-1 animate-wave-2" />
                    <span className="w-0.5 inline-block bg-rose-500 h-3 animate-wave-3" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputText("")}
                  className="px-4 py-3 border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleTranslate()}
                  disabled={translating || !inputText.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-[#BD53F4] to-[#8B2FC9] hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wide rounded-xl shadow-lg shadow-[#BD53F4]/10 transition-all active:scale-98 disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  {translating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>AI Detecting & Translating...</span>
                    </>
                  ) : (
                    <>
                      <span>Transform to English</span>
                      <Send className="w-3.5 h-3.5 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TRANSLATOR RESULTS BOOM BOX (White Premium UI Portion) */}
            <AnimatePresence>
              {(directTrans || profTrans || natTrans) && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  
                  {/* Results grid container in pure premium white */}
                  <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 space-y-4 shadow-xl text-zinc-800">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                      <span className="text-[10.5px] text-zinc-500 font-extrabold uppercase tracking-wider block">Translation Results</span>
                      <span className="text-[10px] text-[#7C3AED] font-black bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#7C3AED] animate-pulse" />
                        VANI English Output
                      </span>
                    </div>

                    {/* Primary Simple English Translation Hero block */}
                    <div className="bg-purple-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col gap-2">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between pb-2 border-b border-purple-800/40">
                        <span className="text-[10px] font-black tracking-widest text-purple-300 uppercase flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-purple-300" /> English Translation
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakAloud(natTrans || directTrans, "natural")}
                            className={`p-1.5 rounded-lg transition-all ${
                              ttsPlaying === "natural" 
                                ? "bg-purple-800 text-white animate-pulse" 
                                : "bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white"
                            }`}
                            title="Hear translation spoken"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleCopy(natTrans || directTrans)}
                            className="p-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white transition-all"
                            title="Copy to clipboard"
                          >
                            {copiedText === (natTrans || directTrans) ? (
                              <span className="text-[10.5px] font-bold text-emerald-400 px-1">Copied!</span>
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-base font-extrabold leading-relaxed text-white mt-1 pr-4 select-text">
                        "{natTrans || directTrans}"
                      </p>

                      {/* Launch practice option for this translation */}
                      <div className="mt-3.5 pt-3 border-t border-purple-800/40 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10.5px] text-purple-300 font-bold flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          Practice Pronunciation:
                        </span>
                        <button
                          onClick={() => startCoachVoiceRecognition(natTrans || directTrans)}
                          className="px-3.5 py-1.5 bg-[#BD53F4] text-white hover:bg-[#8B2FC9] transition-all rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 active:scale-95 shadow-md shadow-purple-950/20"
                        >
                          <Mic className="w-3 h-3" />
                          <span>Check My Accent</span>
                        </button>
                      </div>
                    </div>

                    {/* Beautiful, simple expander for additional stylized variants */}
                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setShowNuances(!showNuances)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-[11px] font-black text-gray-700 transition uppercase tracking-wider"
                      >
                        <span className="flex items-center gap-1.5 text-[#7C3AED]">
                          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Advanced Styles & Tones</span>
                        </span>
                        <span>{showNuances ? "▲ Hide Styles" : "▼ Show More Styles"}</span>
                      </button>

                      {showNuances && (
                        <div className="p-3 bg-gray-50/40 border-t border-gray-100 space-y-3">
                          {/* Simple Direct option */}
                          <div className="bg-white border border-gray-200 p-3.5 rounded-xl flex flex-col gap-1 text-left relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black tracking-wider text-purple-700 uppercase">🔤 Literal Direct Version</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => speakAloud(directTrans, "direct")}
                                  className={`p-1 rounded transition ${ttsPlaying === "direct" ? "bg-purple-100 text-[#7C3AED] animate-pulse" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                                  title="Hear spoken English"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleCopy(directTrans)}
                                  className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
                                  title="Copy literal translation"
                                >
                                  {copiedText === directTrans ? (
                                    <span className="text-[9px] font-bold text-emerald-600">Copied</span>
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 leading-normal pr-4">
                              "{directTrans}"
                            </p>
                          </div>

                          {/* Professional elite option */}
                          <div className="bg-white border border-gray-200 p-3.5 rounded-xl flex flex-col gap-1 text-left relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black tracking-wider text-sky-700 uppercase">💼 Corporate / Formal Style</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => speakAloud(profTrans, "professional")}
                                  className={`p-1 transition ${ttsPlaying === "professional" ? "bg-sky-100 text-[#0369A1] animate-pulse" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                                  title="Hear professional English"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleCopy(profTrans)}
                                  className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
                                  title="Copy formal translation"
                                >
                                  {copiedText === profTrans ? (
                                    <span className="text-[9px] font-bold text-emerald-600">Copied</span>
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 leading-normal pr-4">
                              "{profTrans}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pronunciation & Usage Pitfalls coach tip */}
                    {pronouncTip && (
                      <div className="p-3.5 bg-yellow-50/70 rounded-2xl border border-amber-100 flex gap-3 text-left">
                        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="text-xs font-black text-amber-900">Coach VANI's Accent tip</p>
                          <p className="text-[11.5px] text-amber-800 leading-relaxed mt-0.5">{pronouncTip}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PRONUNCIATION EVALUATION INTERACTIVE PLAYBACK CARD */}
                  <AnimatePresence>
                    {practicingText && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white border border-[#E5E7EB] rounded-3xl space-y-3.5 shadow-xl">
                        
                        {/* Interactive Coaching header */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
                          <span className="text-[10px] font-black uppercase text-[#BD53F4] tracking-widest flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-[#00E0A4]" /> AI Pronunciation Evaluation
                          </span>
                          <span className="text-[10px] text-zinc-500 font-bold">Accent: Indian/International</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Model English phrase to repeat:</p>
                          <p className="text-xs font-extrabold text-[#111827] italic">"{practicingText}"</p>
                        </div>

                        {/* Speaking activation triggers */}
                        <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-2xl">
                          <button
                            onClick={() => startCoachVoiceRecognition(practicingText)}
                            className={`p-3.5 rounded-full transition-all shrink-0 ${
                              isCoachListening 
                                ? "bg-rose-600 text-white animate-pulse scale-97" 
                                : "bg-[#BD53F4] text-white hover:bg-[#8B2FC9] hover:shadow-[0_0_12px_rgba(189,83,244,0.3)] shadow-md"
                            }`}
                          >
                            {isCoachListening ? <MicOff className="w-5 h-5 shrink-0" /> : <Mic className="w-5 h-5 shrink-0" />}
                          </button>
                          
                          <div className="flex-1 text-left select-none text-xs">
                            {isCoachListening ? (
                              <div>
                                <p className="font-extrabold text-rose-600 uppercase tracking-widest text-[9px] animate-pulse">Speak out loud now...</p>
                                <p className="text-[10px] text-zinc-500 leading-tight">VANI is listening and matching syllable accuracy dynamically.</p>
                              </div>
                            ) : (
                              <div>
                                <p className="font-black text-zinc-700 uppercase tracking-wide text-[10px]">Tap microphone to repeat</p>
                                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">Read model sentence out loud to let VANI evaluate accent flow.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Coach evaluation processing */}
                        {coachEvaluating && (
                          <div className="py-2 flex items-center justify-center gap-2 bg-[#F3F4F6] rounded-xl text-xs text-purple-650 font-bold border border-[#E5E7EB]">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>AI Evaluating Pronunciation Accuracy...</span>
                          </div>
                        )}

                        {/* Captured speech transcription */}
                        {coachSSTranscript && (
                          <div className="p-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl space-y-1 text-left">
                            <span className="text-[8.5px] uppercase font-black text-zinc-500 tracking-wider block">Transcribed Voice:</span>
                            <p className="text-xs font-bold text-zinc-800">"{coachSSTranscript}"</p>
                          </div>
                        )}

                        {/* Evaluation Score Display */}
                        {evaluationResult && (
                          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-[#F0FDF4]/40 border border-[#DCFCE7] rounded-2xl space-y-3.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10.5px] text-[#15803D] font-black uppercase tracking-wide">Evaluation Score Report</span>
                              
                              {/* Pill score marker */}
                              <div className="flex items-center gap-1 bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1.5 rounded-xl">
                                <span className="text-[#166534] text-[10px] font-bold">Accuracy:</span>
                                <span className="text-sm font-black text-[#15803D]">{evaluationResult.score}%</span>
                              </div>
                            </div>

                            {/* Confidence Progress bar */}
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-[#00E0A4] transition-all rounded-full"
                                style={{ width: `${evaluationResult.score}%` }}
                              />
                            </div>

                            <p className="text-xs font-medium text-zinc-700 leading-relaxed text-left">
                              🎉 {evaluationResult.feedback}
                            </p>

                            <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl flex gap-2.5 text-left text-xs text-[#5B21B6] mt-1">
                              <Lightbulb className="w-4 h-4 text-[#7C3AED] mt-0.5 shrink-0" />
                              <div className="leading-snug">
                                <strong className="text-purple-950 text-[10px] uppercase block mb-0.5 tracking-wider font-extrabold">Correction Suggestions</strong>
                                {evaluationResult.suggestions}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* TAB 2: TALK AND TRANSLATE LIVE TRANSLATION ENGINE */}
        {activeSubTab === "talk" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            
            {/* Context manual */}
            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-5 shadow-sm relative">
              <span className="absolute top-2 right-2 text-xs opacity-35 select-none">🎙️ Live</span>
              <h3 className="text-sm font-black text-[#5B21B6] hover:text-purple-700 uppercase tracking-wider mb-1 text-left">Talk & Translate</h3>
              <p className="text-xs text-purple-950 leading-relaxed text-left">
                Speak in your native tongue fluidly: VANI intercepts, translates, prints English, and translates spoken replies aloud for practice back-and-forth dynamically.
              </p>

              <div className="mt-4 flex gap-2 items-center bg-white p-2 rounded-xl border border-purple-200">
                <span className="text-[10px] text-purple-800 font-extrabold uppercase tracking-wide shrink-0 ml-1">Practice Language:</span>
                <select
                  value={selectedLang.code}
                  onChange={(e) => {
                    const match = INDIAN_LANGUAGES.find(l => l.code === e.target.value);
                    if (match) setSelectedLang(match);
                  }}
                  className="bg-transparent focus:outline-none border-none text-xs text-[#7C3AED] uppercase font-black cursor-pointer pr-4"
                >
                  {INDIAN_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-white text-zinc-800 font-medium text-xs">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LIVE CONVERSATION STATUS HUB (White Premium UI Portion) */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 min-h-[16rem] flex flex-col justify-between shadow-xl space-y-4 text-left text-zinc-800">
              
              {/* Terminal dialogue screen */}
              <div className="flex-1 space-y-4 flex flex-col justify-center">
                {talkState === "idle" && (
                  <div className="text-center py-6 select-none flex flex-col items-center">
                    <span className="text-3xl text-zinc-400 mb-2.5">🎙️</span>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-wider">Ready for Dialogue</p>
                    <p className="text-[10.5px] text-zinc-500 mt-1 max-w-xs">
                      Tap the large microphone orb, say any phrase in {selectedLang.code} naturally, and let the AI translate & read conversational English.
                    </p>
                  </div>
                )}

                {/* State: listening user voice in native speech tag */}
                {talkState === "listening" && (
                  <div className="space-y-2 py-4 flex flex-col items-center justify-center text-center">
                    {/* Ripple animated layout for visual impact */}
                    <div className="relative flex items-center justify-center w-20 h-20 mb-2">
                      <span className="absolute animate-ping h-14 w-14 rounded-full bg-rose-500 opacity-60" />
                      <span className="absolute animate-pulse h-16 w-16 rounded-full bg-rose-400/40" />
                      <div className="relative w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span lang={selectedLang.langTag} className="text-sm font-extrabold text-[#7C3AED] uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-200/50">
                      {selectedLang.listeningTxt}
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                      Listening to {selectedLang.code} audio... speak naturally.
                    </p>
                  </div>
                )}

                {/* State: Translating pipeline */}
                {talkState === "translating" && (
                  <div className="space-y-2 py-6 text-center flex flex-col items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-[#BD53F4] animate-spin mb-1" />
                    <p className="text-xs font-bold text-zinc-800">Translating native speech instantly...</p>
                    <p className="text-[10.5px] text-[#7C3AED] font-semibold uppercase tracking-widest mt-1">Connecting Google Gemini 3.5</p>
                  </div>
                )}

                {/* State: coaching user dialog cards with custom voice accents */}
                {talkState === "coaching" && (
                  <div className="space-y-4">
                    
                    {/* User Native Phrase input visualizer */}
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-[8.5px] uppercase text-zinc-500 tracking-wider block font-bold">What you said in {selectedLang.code}:</span>
                      <p className="text-xs font-bold text-zinc-800 italic mt-0.5 pr-2">"{talkOriginal}"</p>
                    </div>

                    {/* AI Elevated English Output */}
                    <div className="p-4 bg-[#FAF5FF] border border-purple-200 rounded-2xl relative shadow-sm">
                      <span className="text-[8.5px] uppercase font-black text-[#7C3AED] tracking-widest block mb-1">Elevated English</span>
                      <p className="text-base font-extrabold text-[#111827] leading-relaxed">
                        "{talkTranslated}"
                      </p>

                      <div className="mt-3.5 flex items-center justify-between border-t border-purple-100 pt-2.5">
                        <span className="text-[10.5px] text-[#4B5563] font-bold flex items-center gap-1.5 cursor-pointer" onClick={() => speakAloud(talkTranslated, "natural")}>
                          <Volume2 className="w-4 h-4 text-[#BD53F4] animate-bounce" /> Click to hear spoken voice
                        </span>
                        
                        <button
                          onClick={() => startCoachVoiceRecognition(talkTranslated)}
                          className="px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-[#7C3AED] border border-[#DDD6FE] rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition"
                        >
                          <Mic className="w-3.5 h-3.5 text-[#00E0A4]" /> Speak Back & Verify
                        </button>
                      </div>
                    </div>

                    {talkPronouncTip && (
                      <div className="p-3 bg-yellow-50/70 border border-amber-100 rounded-xl flex gap-2.5 leading-snug">
                        <Lightbulb className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-none mb-1">Syllable Advice</p>
                          <p className="text-[11px] text-amber-800 font-medium leading-relaxed">{talkPronouncTip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Orb buttons */}
              <div className="pt-4 border-t border-gray-200 flex flex-col items-center gap-3">
                <button
                  onClick={startTalkModeListening}
                  disabled={talkMicrophoneActive}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                    talkMicrophoneActive 
                      ? "bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.5)] cursor-not-allowed scale-95 animate-pulse" 
                      : "bg-[#BD53F4] text-white hover:bg-[#8B2FC9] hover:shadow-[0_0_15px_rgba(189,83,244,0.3)] scale-100"
                  }`}
                  title="Speak in native language"
                >
                  <KeypadMicIcon className="w-6 h-6 text-white shrink-0" />
                </button>
                <div className="text-center select-none">
                  <span className="text-[10.5px] uppercase font-black text-emerald-600 tracking-widest">{talkMicrophoneActive ? "Listening..." : "Host Orb Active"}</span>
                  <p className="text-[9.5px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">Tap orb, speak your custom language</p>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 3: DAILY PHRASAL SITUATIONS */}
        {activeSubTab === "situations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            
            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-4 flex gap-3 shadow-sm leading-normal text-left">
              <span className="text-2xl leading-none">📚</span>
              <div>
                <h4 className="text-xs uppercase font-black text-[#5B21B6] tracking-wider mb-0.5">Quick Daily Situations</h4>
                <p className="text-[11px] text-purple-950">
                  Select common daily conversations to see instant correct translations, elite smart enhancement, pronunciation, and practice coaching directly.
                </p>
              </div>
            </div>

            {/* Grid categories list */}
            <div className="space-y-5 text-left">
              {Object.keys(DAILY_SITUATIONS).map(catKey => {
                const category = DAILY_SITUATIONS[catKey];
                return (
                  <div key={catKey} className="bg-white border border-[#E5E7EB] rounded-2xl p-4.5 space-y-3.5 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-1.5 border-b border-zinc-100">
                      <span className="text-lg select-none">{category.icon}</span>
                      <h4 className="text-xs font-black text-zinc-800 uppercase tracking-wider">{category.title}</h4>
                    </div>

                    <div className="space-y-2.5">
                      {category.phrases.map((ph, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleSelectSituationPhrase(ph)}
                          className="bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-xl p-3 border border-zinc-200 flex items-center justify-between gap-3 text-left transition-all active:scale-99 cursor-pointer group"
                        >
                          <div className="space-y-1.5 flex-1 pr-2">
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-zinc-200 border border-zinc-300 rounded-md text-zinc-600 inline-block">
                              {ph.sourceLang} Prompt
                            </span>
                            <p className="text-xs text-zinc-800 font-semibold block leading-snug">
                              "{ph.native}"
                            </p>
                            <p className="text-[11px] text-[#4F46E5] font-extrabold block line-clamp-1 truncate group-hover:text-[#BD53F4] transition leading-none">
                              ➜ "{ph.englishNatural}"
                            </p>
                          </div>
                          
                          <div className="p-2 bg-zinc-200 text-zinc-500 rounded-lg group-hover:bg-[#BD53F4] group-hover:text-white transition-all shrink-0">
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </motion.div>
        )}

        {/* TAB 4: ACCURACY PRACTICE HISTORY VAULT */}
        {activeSubTab === "history" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            
            {/* Search and control bar */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between text-left shadow-sm">
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search translated words..."
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] pr-9 pl-3.5 py-1.5 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#BD53F4] placeholder-zinc-400 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3.5 top-2.5" />
              </div>

              <div className="flex gap-2 items-center w-full sm:w-auto shrink-0 select-none">
                <button
                  onClick={clearAllHistory}
                  disabled={historyList.length === 0}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[10.5px] font-black uppercase text-zinc-600 hover:text-zinc-900 transition border border-[#E5E7EB] disabled:opacity-40"
                >
                  Clear Vault
                </button>
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] border-dashed rounded-3xl py-12 text-center select-none text-zinc-500 space-y-1">
                  <span className="text-4xl text-zinc-400 block mb-2">📜</span>
                  <p className="text-xs font-black uppercase text-zinc-800">Vault is Empty</p>
                  <p className="text-[10px] text-zinc-500">Practice custom translations to populate this dynamic vault.</p>
                </div>
              ) : (
                filteredHistory.map(item => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-white border border-[#E5E7EB] rounded-2xl space-y-2 text-left relative overflow-hidden group shadow-sm"
                  >
                    
                    {/* Timestamp and controls header */}
                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase font-bold bg-[#F3F4F6] px-2 py-0.5 rounded-md text-[#7C3AED] border border-zinc-200">
                          {item.sourceLang} Target
                        </span>
                        <span className="text-[9.5px] text-zinc-500 flex items-center gap-1.5 font-sans">
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            item.isFavorite 
                              ? "bg-amber-50 border-amber-200 text-amber-600" 
                              : "bg-[#F3F4F6] border-[#E5E7EB] text-zinc-400 hover:text-zinc-700"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 shrink-0" />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-1.5 bg-[#F3F4F6] hover:bg-rose-50 border border-[#E5E7EB] hover:border-rose-200 text-zinc-400 hover:text-rose-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Dialogue Text */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs text-zinc-600 font-semibold block pr-4 leading-relaxed">
                        "{item.original}"
                      </p>
                      
                      <p className="text-[13px] text-zinc-850 font-extrabold block leading-normal leading-relaxed">
                        ➜ "{item.translated}"
                      </p>
                    </div>

                    {/* Bottom stats indicators - score if exists */}
                    <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                      <button
                        onClick={() => speakAloud(item.translated, "natural")}
                        className="text-[10px] text-[#7C3AED] hover:text-[#5B21B6] transition flex items-center gap-1 font-bold"
                      >
                        <Volume2 className="w-3.5 h-3.5 shrink-0" /> Play coach audio
                      </button>

                      {item.score !== null ? (
                        <span className="text-[10px] text-[#166534] font-black bg-[#DCFCE7] px-2 py-1 rounded-lg border border-[#BBF7D0]">
                          🎯 Practiced: {item.score}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wide leading-none">
                          Not Practiced
                        </span>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>

          </motion.div>
        )}

      </main>

      {/* Accessibility footer parameters */}
      <footer className="relative z-10 py-4.5 px-4 bg-black/60 border-t border-[#151515] text-center shrink-0">
        <p className="text-[9.5px] text-gray-500 font-black uppercase tracking-wider flex items-center justify-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-[#BD53F4]" /> Language Bridge Center is WCAG compliant • Powered by Google Gemini 3.5
        </p>
      </footer>

    </div>
  );
}

// Compact mic icon drawing for Talk mode state
function KeypadMicIcon({ className }: { className: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}
