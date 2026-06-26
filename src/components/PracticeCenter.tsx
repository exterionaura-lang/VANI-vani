import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Languages, 
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { VOCAB_CATEGORIES, VocabPhrase } from "../App";

interface PracticeCenterProps {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  showToast: (message: string, subMessage?: string, type?: 'success' | 'info' | 'streak') => void;
  celebrateStreak: (customType?: 'side-cannons' | 'burst') => void;
  playTTS: (text: string, index: number) => Promise<void>;
  userPlan: string;
  practicedPhrases?: string[];
  onStartPhrasePractice?: (phrase: VocabPhrase) => void;
  initialTab?: 'grammar' | 'vocab' | 'regional' | 'vocab_lab';
}

// Data Sets
const GRAMMAR_MISTAKES = [
  {
    id: "g1",
    sentence: "She is more taller than her elder sister.",
    words: ["She", "is", "more", "taller", "than", "her", "elder", "sister."],
    errorIdx: 2, // "more"
    correction: "She is taller than her elder sister.",
    explanation: "Do not double-intensify comparatives. 'Taller' already implies comparison, so 'more' is redundant and grammatically incorrect.",
    category: "Comparatives / Adjectives"
  },
  {
    id: "g2",
    sentence: "He don't like to watch movies alone.",
    words: ["He", "don't", "like", "to", "watch", "movies", "alone."],
    errorIdx: 1, // "don't"
    correction: "He doesn't like to watch movies alone.",
    explanation: "With third-person singular pronouns (He, She, It), use the auxiliary verb 'does not' (doesn't) instead of 'do not' (don't).",
    category: "Subject-Verb Agreement"
  },
  {
    id: "g3",
    sentence: "I am having three siblings living in Kolkata.",
    words: ["I", "am", "having", "three", "siblings", "living", "in", "Kolkata."],
    errorIdx: 1, // "having" (or words[1] & words[2] - we target index 2 "having")
    errorIdxAlt: 2,
    correction: "I have three siblings living in Kolkata.",
    explanation: "Dynamic state continuous forms (am having) should not be used for stative verbs of possession. Use 'I have' for permanent states or relationship statements.",
    category: "Stative Verbs"
  },
  {
    id: "g4",
    sentence: "We discussed about the budget yesterday night.",
    words: ["We", "discussed", "about", "the", "budget", "yesterday", "night."],
    errorIdx: 2, // "about"
    correction: "We discussed the budget yesterday night.",
    explanation: "The transitive verb 'discuss' takes a direct object without needing the preposition 'about'. Saying 'discuss about' is redundant.",
    category: "Prepositions"
  },
  {
    id: "g5",
    sentence: "She returned back my notebook today morning.",
    words: ["She", "returned", "back", "my", "notebook", "today", "morning."],
    errorIdx: 2, // "back"
    correction: "She returned my notebook today morning.",
    explanation: "'Returned' already means 'given back'. Adding 'back' makes the phrase a pleonastic word circularity error. Remove 'back'.",
    category: "Redundancy"
  },
  {
    id: "g6",
    sentence: "I have seen that beautiful movie since yesterday.",
    words: ["I", "have", "seen", "that", "beautiful", "movie", "since", "yesterday."],
    errorIdx: 6, // "since"
    correction: "I saw that beautiful movie yesterday.",
    explanation: "The preposition 'since' is used for actions beginning in the past and continuing to now. For specified past instances ('yesterday'), use Simple Past tense ('I saw').",
    category: "Tense Aspect"
  }
];

const SENTENCE_BUILDER_CHALLENGES = [
  {
    id: "b1",
    correct: "she always studies hard for examinations",
    words: ["studies", "always", "hard", "examinations", "for", "she"],
    explanation: "Adverbs of frequency ('always') fit immediately after the subject pronoun ('she') and prior to the primary action verbs.",
  },
  {
    id: "b2",
    correct: "they have been living in delhi since childhood",
    words: ["Delhi", "childhood", "living", "since", "been", "they", "have", "in"],
    explanation: "Use Present Perfect Continuous ('have been living') to represent actions that began in childhood and continue into current residence status.",
  },
  {
    id: "b3",
    correct: "could you please guide me to the airport",
    words: ["could", "guide", "please", "me", "airport", "you", "the", "to"],
    explanation: "Begin polite requests with auxiliary modals ('Could you') followed by qualifying politeness indicators ('please') and operative verbs ('guide').",
  }
];

const VOCABULARY_QUIZ = [
  {
    id: "v1",
    word: "Meticulous",
    options: ["Superficial", "Extremely careful & detailed", "Quickly forgotten", "Very angry"],
    correctIdx: 1,
    sentence: "She was meticulous in preparing her job application, check-reading every single word.",
    explanation: "Meticulous means showing great attention to detail; very careful and precise.",
    synonyms: "diligent, fastidious, precise, scrupulous"
  },
  {
    id: "v2",
    word: "Hesitant",
    options: ["Highly confident", "Speaking too fast", "Tentative, unsure, or slow to act", "Rude behaviour"],
    correctIdx: 2,
    sentence: "He was hesitant to speak English at first, but with VANI practice he conquered his fear.",
    explanation: "Hesitant represents being slow to speak or act because of lack of confidence, nervousness, or indecision.",
    synonyms: "reluctant, timid, doubtful, skeptical"
  },
  {
    id: "v3",
    word: "Eloquence",
    options: ["Fluent or persuasive speaking", "Heavy regional accent", "A quiet whisper", "Grammar error"],
    correctIdx: 0,
    sentence: "The interviewer was deeply impressed by her eloquence and descriptive pitch.",
    explanation: "Eloquence is the quality of fluent, graceful, powerful, and persuasive expression or communication.",
    synonyms: "expressiveness, fluency, poise, articulateness"
  },
  {
    id: "v4",
    word: "Sufficient",
    options: ["Not enough", "Adequate or as much as needed", "Extremely expensive", "Overpowered"],
    correctIdx: 1,
    sentence: "Ten minutes of daily speaking practice is sufficient to build steady oral momentum.",
    explanation: "Sufficient corresponds to having enough of something, or meeting needs adequately without excess.",
    synonyms: "adequate, ample, abundant, satisfactory"
  },
  {
    id: "v5",
    word: "Articulate",
    options: ["To isolate from others", "Having trouble breathing", "Expressing ideas clearly and fluidly", "Hard to understand"],
    correctIdx: 2,
    sentence: "A skilled public speaker can articulate complex values with simple words.",
    explanation: "Articulate means having or showing the ability to speak fluently and coherently.",
    synonyms: "coherent, enunciated, eloquent, expressive"
  }
];

const SPELLING_SCRAMBLES = [
  {
    id: "s1",
    scrambled: "CEIREVE",
    correct: "RECEIVE",
    clue: "To get or accept something sent; a classic 'i before e except after c' spelling trap."
  },
  {
    id: "s2",
    scrambled: "EPAARSET",
    correct: "SEPARATE",
    clue: "To divide or keep apart; often misspelled as 'seperate' instead of 'separate'."
  },
  {
    id: "s3",
    scrambled: "ECEYRNASS",
    correct: "NECESSARY",
    clue: "Required to be done; extremely handy word. Remember: 1 Collar (C) and 2 Sleeves (S)!"
  }
];

// Indian regional expressions flashcard data
const REGIONAL_FLASHCARDS = {
  Bengali: [
    { id: "b1", native: "আমি ইংরেজিতে কথা বলতে চাই।", english: "I want to speak in English.", advice: "Avoid saying 'I speak in English wish.' Emphasize 'want to speak' for direct professional request." },
    { id: "b2", native: "তোমার সাথে কথা বলে ভালো লাগলো।", english: "It was nice talking to you.", advice: "A clean polite sign-off. Keep the 'L' soft in 'talking' (it is silent: tawk-ing)." },
    { id: "b3", native: "আমার একটু দেরি হয়ে গেল, দুঃখিত।", english: "I am sorry for being a bit late.", advice: "Say 'sorry for being late', avoid saying 'sorry for late' which misses the verb." }
  ],
  Hindi: [
    { id: "h1", native: "मुझे इंग्लिश सीखनी है।", english: "I want to learn English.", advice: "Ensure you soften the hard 'L' sound in 'Learn' relative to regional retroflex sounds." },
    { id: "h2", native: "क्या आप इसे दोबारा समझा सकते हैं?", english: "Could you please explain this again?", advice: "Using 'Could you please...' is far more polite in professional setups than 'Speak again'." },
    { id: "h3", native: "चिंता मत करो, सब ठीक हो जाएगा।", english: "Don't worry, everything will be fine.", advice: "A friendly reassurance phrase. Keep the 'v' in 'everything' soft and pleasant." }
  ],
  Telugu: [
    { id: "t1", native: "నేను ఇంగ్లీష్ మాట్లాడటానికి ప్రయత్నిస్తున్నాను.", english: "I am trying to speak English.", advice: "Pronounce the 'tr' sound in 'trying' directly without drawing it into a heavy 'thry' sound." },
    { id: "t2", native: "మీరు సహాయం చేయగలరా?", english: "Could you please help me?", advice: "Excellent polite opener. Avoid literal translation like 'you helper please do'." },
    { id: "t3", native: "మళ్ళీ కలుద్దాం!", english: "See you again soon!", advice: "A friendly check-out. Ensure 'soon' uses a light, quick vowel sound instead of dragging." }
  ],
  Tamil: [
    { id: "ta1", native: "நான் ஆங்கிலம் பேச பயிற்சி செய்கிறேன்.", english: "I am practicing speaking English.", advice: "Double 'ing' sound (practicing speaking) is correct here. Keep the speaking fluid." },
    { id: "ta2", native: "எனக்கு ஒரு உதவி தேவை.", english: "I need a small favor.", advice: "'Favor' is much more professional in a corporate context than asking directly for 'help'." },
    { id: "ta3", native: "உங்களை சந்தித்ததில் மகிழ்ச்சி.", english: "Pleased to meet you.", advice: "A premium elegant greeting. Pronounce 'Pleased' with a clean ending 'd' sound." }
  ],
  Marathi: [
    { id: "m1", native: "मी इंग्रजी शिकत आहे.", english: "I am learning English.", advice: "Pronounce 'learning' as a single fluid word. Don't split the syllable to 'lehr-ning'." },
    { id: "m2", native: "तुम्हाचा दिवस चांगला जावो!", english: "Have a great day ahead!", advice: "A wonderful workplace signoff. Emphasize the word 'great' with an open 'ay' sound." },
    { id: "m3", native: "मला समजत नाही.", english: "I don't understand.", advice: "Keep it simple and direct. Say it with a polite neutral tone to ask for clarification." }
  ],
  Hinglish: [
    { id: "hi1", native: "Actually, main thoda busy tha tab.", english: "Actually, I was a bit busy back then.", advice: "Instead of 'busy تھا tab', merge it gracefully with 'back then' to indicate specified past instances." },
    { id: "hi2", native: "Mujhe check karke batana please.", english: "Please let me know after checking.", advice: "'Let me know' is the ideal corporate counterpart for 'batana please'. Highly elegant!" },
    { id: "hi3", native: "Main call disconnect kar raha hoon.", english: "I am hanging up now.", advice: "'Hanging up' is a perfect contemporary phrasal verb for ending call configurations smoothly." }
  ]
};

export function PracticeCenter({ 
  xp, 
  setXp, 
  streak, 
  setStreak, 
  showToast, 
  celebrateStreak, 
  playTTS,
  userPlan,
  practicedPhrases = [],
  onStartPhrasePractice,
  initialTab
}: PracticeCenterProps) {
  // Main tabs: 'grammar' | 'vocab' | 'regional' | 'vocab_lab'
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'regional' | 'vocab_lab'>('grammar');
  const [vocabExpandedCategory, setVocabExpandedCategory] = useState<string | null>("Should / Shouldn't / May / Might");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Grammar Game States
  const [grammarIndex, setGrammarIndex] = useState<number>(0);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [grammarStatus, setGrammarStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [grammarScore, setGrammarScore] = useState<number>(0);

  // Sentence Builder States
  const [builderIndex, setBuilderIndex] = useState<number>(0);
  const [builderSelectedWords, setBuilderSelectedWords] = useState<string[]>([]);
  const [builderStatus, setBuilderStatus] = useState<'editing' | 'success' | 'incorrect'>('editing');

  // Vocabulary Game States
  const [vocabIndex, setVocabIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [vocabStatus, setVocabStatus] = useState<'idle' | 'answered'>('idle');
  const [vocabScore, setVocabScore] = useState<number>(0);

  // Spelling scramble states
  const [scrambleIndex, setScrambleIndex] = useState<number>(0);
  const [scrambleAnswer, setScrambleAnswer] = useState<string>("");
  const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Flashcards state
  const [regionalLang, setRegionalLang] = useState<keyof typeof REGIONAL_FLASHCARDS>("Hindi");
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // General audio helper
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Speak function helper
  const handleVoiceSpeak = (text: string) => {
    setIsSynthesizing(true);
    playTTS(text, 5005).finally(() => {
      setIsSynthesizing(false);
    });
  };

  // Grammar Event Handlers
  const handleWordTap = (wordIdx: number) => {
    if (grammarStatus !== 'idle') return;
    
    setSelectedWordIdx(wordIdx);
    const item = GRAMMAR_MISTAKES[grammarIndex];
    
    const isMatched = wordIdx === item.errorIdx || (item.errorIdxAlt !== undefined && wordIdx === item.errorIdxAlt);
    
    if (isMatched) {
      setGrammarStatus('correct');
      setGrammarScore(prev => prev + 1);
      setXp(p => p + 15);
      celebrateStreak('burst');
      showToast("🌸 Spot on! Grammatical Error Located", "Earned +15 XP!", "success");
      handleVoiceSpeak("Awesome spot! Key grammatical error located. " + item.explanation);
    } else {
      setGrammarStatus('wrong');
      showToast("❌ Incorrect Spot", "Tap 'Try Again' or 'Reveal' to learn the rule.", "info");
      handleVoiceSpeak("Not quite. That word is grammatically fine. Let's inspect other targets.");
    }
  };

  const handleNextGrammar = () => {
    setGrammarIndex((prev) => (prev + 1) % GRAMMAR_MISTAKES.length);
    setSelectedWordIdx(null);
    setGrammarStatus('idle');
  };

  // Sentence Builder events
  const handleWordSelectBuilder = (w: string) => {
    if (builderStatus === 'success') return;
    setBuilderSelectedWords([...builderSelectedWords, w]);
  };

  const handleRemoveWordBuilder = (idx: number) => {
    if (builderStatus === 'success') return;
    const items = [...builderSelectedWords];
    items.splice(idx, 1);
    setBuilderSelectedWords(items);
    setBuilderStatus('editing');
  };

  const checkSentenceBuilder = () => {
    const current = SENTENCE_BUILDER_CHALLENGES[builderIndex];
    const joined = builderSelectedWords.join(" ").toLowerCase().replace(/[.,!]/g, "").trim();
    const correctClean = current.correct.toLowerCase().replace(/[.,!]/g, "").trim();
    
    if (joined === correctClean) {
      setBuilderStatus('success');
      setXp(p => p + 25);
      celebrateStreak('burst');
      showToast("🎉 Perfect Sentence Order!", "+25 XP rewarded!", "success");
      handleVoiceSpeak("Great job building that! " + current.explanation);
    } else {
      setBuilderStatus('incorrect');
      showToast("⚠️ Order Incorrect", "Compare with classic flow and adjust words.", "info");
      handleVoiceSpeak("VANI suggests rearranging. Watch the verb and modifier order.");
    }
  };

  const resetSentenceBuilder = () => {
    setBuilderSelectedWords([]);
    setBuilderStatus('editing');
  };

  const nextSentenceBuilder = () => {
    setBuilderIndex((prev) => (prev + 1) % SENTENCE_BUILDER_CHALLENGES.length);
    setBuilderSelectedWords([]);
    setBuilderStatus('editing');
  };

  // Vocab Event Handlers
  const handleOptionSelect = (optIdx: number) => {
    if (vocabStatus === 'answered') return;
    setSelectedOption(optIdx);
    setVocabStatus('answered');
    const item = VOCABULARY_QUIZ[vocabIndex];

    if (optIdx === item.correctIdx) {
      setVocabScore(prev => prev + 1);
      setXp(p => p + 15);
      celebrateStreak('burst');
      showToast("💎 Correct Definition paired!", "+15 XP Added!", "success");
      handleVoiceSpeak(`Correct! ${item.word} means ${item.explanation}`);
    } else {
      showToast("💡 Keep learning!", "Inspect correct explanation.", "info");
      handleVoiceSpeak(`Close! Actually, the answer is ${item.options[item.correctIdx]}. Let me explain: ${item.explanation}`);
    }
  };

  const handleNextVocab = () => {
    setVocabIndex((prev) => (prev + 1) % VOCABULARY_QUIZ.length);
    setSelectedOption(null);
    setVocabStatus('idle');
  };

  // Spelling scramble handlers
  const checkSpellingScramble = () => {
    const item = SPELLING_SCRAMBLES[scrambleIndex];
    if (scrambleAnswer.toUpperCase().trim() === item.correct) {
      setScrambleStatus('success');
      setXp(p => p + 20);
      celebrateStreak('burst');
      showToast("✨ Beautiful Spelling!", "+20 XP Reward!", "success");
      handleVoiceSpeak(`Perfect! ${item.correct} is spelled exactly that way!`);
    } else {
      setScrambleStatus('fail');
      showToast("⚠️ Spelled differently", "Take another look at the scrambled keys.", "info");
      handleVoiceSpeak(`Not quite right. Double check the letter elements and try again.`);
    }
  };

  const handleNextScramble = () => {
    setScrambleIndex((prev) => (prev + 1) % SPELLING_SCRAMBLES.length);
    setScrambleAnswer("");
    setScrambleStatus('idle');
  };

  return (
    <div className="flex flex-col bg-stone-50 min-h-screen text-stone-800 pb-36 p-4 space-y-4 text-left select-none">
      
      {/* HEADER SECTION */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center font-black shadow-md border-2 border-white select-none animate-bounce">
            👩‍🏫
          </div>
          <div>
            <h2 className="text-xl font-black text-indigo-950 tracking-tight leading-none flex items-center gap-1.5">
              Practice Board 
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg flex items-center gap-1 uppercase font-black tracking-widest leading-none">
                <Sparkles className="w-2.5 h-2.5 animate-spin text-amber-500" />
                VANI Coach Live
              </span>
            </h2>
            <p className="text-[10.5px] text-stone-500 font-bold block mt-1 tracking-tight">Active daily English mastery, word-spotting & voice drills</p>
          </div>
        </div>

        {/* Dynamic XP Progress pill */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="bg-amber-50 border border-amber-200/60 text-amber-700 px-3 py-1.5 rounded-2xl flex items-center gap-1 text-xs font-black uppercase tracking-wider">
            <span>✨</span>
            <span className="font-mono text-stone-900 font-black">{xp}</span>
            <span className="text-stone-400 font-bold text-[9px]">XP</span>
          </div>
          <div className="bg-rose-50 border border-rose-200/60 text-rose-500 px-3 py-1.5 rounded-2xl flex items-center gap-1 text-xs font-black uppercase tracking-wider">
            <span>🔥</span>
            <span className="font-mono text-stone-900 font-black">{streak}</span>
            <span className="text-stone-400 font-bold text-[9px]">Days</span>
          </div>
        </div>
      </div>

      {/* COMPACT MODULATOR MENU TABS */}
      <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-2xl border border-stone-200 shadow-xxs">
        {[
          { id: "grammar", label: "💡 Grammar Drill", icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: "vocab", label: "🔮 Vocabulary", icon: <Award className="w-3.5 h-3.5" /> },
          { id: "vocab_lab", label: "📘 Vocab Lab", icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: "regional", label: "📔 Flashcards", icon: <Languages className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                handleVoiceSpeak(`Switched to ${tab.label}`);
              }}
              className={`py-2 px-0.5 text-[9.5px] sm:text-xs font-black uppercase tracking-tight rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition active:scale-97 border ${
                isSelected 
                  ? "bg-slate-900 border-slate-950 text-white shadow-sm" 
                  : "bg-transparent text-stone-500 border-transparent hover:bg-stone-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label.split(" ")[1] || tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* GAME SHEETS AREA */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* TAB 1: GRAMMAR COACH */}
          {activeTab === 'grammar' && (
            <div className="space-y-4">
              
              {/* INTERACTIVE COMPONENT 1.1: SPOT THE ERROR */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-150">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎯</span>
                    <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider">Tap to Spot the Mistake</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[9.5px] font-black border border-rose-100">
                    Question {grammarIndex + 1}/{GRAMMAR_MISTAKES.length}
                  </span>
                </div>

                <p className="text-stone-500 text-[10.5px] font-bold mb-3.5 leading-snug">
                  Read this sentence carefully. VANI made exactly one common Indian-learner grammar error. Tap directly on the incorrect word:
                </p>

                {/* Sentence Render Box */}
                <div className="p-4 bg-stone-50 border border-stone-150 rounded-2xl flex flex-wrap gap-2.5 justify-center py-6">
                  {GRAMMAR_MISTAKES[grammarIndex].words.map((w, idx) => {
                    const isSelected = selectedWordIdx === idx;
                    const item = GRAMMAR_MISTAKES[grammarIndex];
                    const isCorrectErrorSpot = idx === item.errorIdx || (item.errorIdxAlt !== undefined && idx === item.errorIdxAlt);

                    let badgeColor = "bg-white border-stone-200 hover:bg-stone-100 text-stone-850 shadow-xxs cursor-pointer hover:scale-105 active:scale-95";
                    if (isSelected) {
                      if (grammarStatus === 'correct' && isCorrectErrorSpot) {
                        badgeColor = "bg-emerald-500 border-emerald-600 text-white scale-[1.05] ring-4 ring-emerald-100 shadow-md";
                      } else {
                        badgeColor = "bg-red-500 border-red-650 text-white scale-[1.05] ring-4 ring-red-100 shadow-md animate-shake";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleWordTap(idx)}
                        disabled={grammarStatus === 'correct'}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border font-sans select-none tracking-tight transition-all duration-200 ${badgeColor}`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>

                {/* Result Block */}
                {grammarStatus !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-4 p-4.5 rounded-2xl text-xs space-y-2 border ${
                      grammarStatus === 'correct' 
                        ? "bg-emerald-50 border-emerald-250 text-emerald-950" 
                        : "bg-amber-50 border-amber-200 text-stone-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black">
                      {grammarStatus === 'correct' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-650 stroke-[3px]" />
                          <span>EXCELLENT SPOT! You found the error piece!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-600" />
                          <span>MISTAKE ELSEWHERE! Try scanning other coordinates.</span>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-1 mt-1 text-[11px] font-medium leading-relaxed">
                      <p>
                        <span className="font-extrabold text-stone-800 uppercase block">Correct sentence:</span> 
                        <strong className="text-stone-900 bg-white/60 font-black px-1.5 py-0.5 rounded inline-block mt-0.5">{GRAMMAR_MISTAKES[grammarIndex].correction}</strong>
                      </p>
                      <p className="mt-1 text-stone-600 bg-white/40 p-2.5 rounded-xl border border-stone-200/40">
                        <span className="font-black text-rose-500 text-[10px] uppercase block mb-0.5">Grammar Rule Highlighted:</span>
                        {GRAMMAR_MISTAKES[grammarIndex].explanation}
                      </p>
                    </div>

                    <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-indigo-100/30">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleVoiceSpeak(GRAMMAR_MISTAKES[grammarIndex].correction)}
                          className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-indigo-650" />
                          <span>Listen</span>
                        </button>

                        <button 
                          onClick={() => {
                            const phraseObj: any = {
                              id: "grammar-" + GRAMMAR_MISTAKES[grammarIndex].id,
                              phrase: GRAMMAR_MISTAKES[grammarIndex].correction,
                              translation: GRAMMAR_MISTAKES[grammarIndex].sentence,
                              tip: `Correction for '${GRAMMAR_MISTAKES[grammarIndex].category}': ${GRAMMAR_MISTAKES[grammarIndex].explanation}`,
                              theme: "Grammar Master",
                              done: false
                            };
                            if (onStartPhrasePractice) {
                              onStartPhrasePractice(phraseObj);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-xxs"
                        >
                          🎙️ Speak & Practice
                        </button>
                      </div>

                      {grammarStatus === 'correct' ? (
                        <button
                          onClick={handleNextGrammar}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1 transition active:scale-95 shadow-xxs"
                        >
                          <span>Next Challenge</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedWordIdx(null);
                            setGrammarStatus('idle');
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1 transition active:scale-95 shadow-xxs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* INTERACTIVE COMPONENT 1.2: SENTENCE CONSTRUCT SCRAMBLE */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs text-left relative">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-150">
                  <div className="flex items-center gap-1.5 animate-pulse">
                    <span className="text-lg">🧱</span>
                    <span className="text-[10px] uppercase font-black text-indigo-700 tracking-wider">Word Order Sentence Scramble</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[9.5px] font-black border border-indigo-100">
                    Part {builderIndex + 1}/{SENTENCE_BUILDER_CHALLENGES.length}
                  </span>
                </div>

                <p className="text-stone-500 text-[10.5px] font-bold mb-3">
                  Click the words below in the correct order to assemble a grammatically natural spoken response loop:
                </p>

                {/* Assembled Sentence Box */}
                <div className="p-4 bg-stone-50 border border-stone-150 rounded-2xl min-h-16 flex flex-wrap gap-1.5 items-center justify-center py-5">
                  {builderSelectedWords.length === 0 ? (
                    <span className="text-stone-400 font-bold text-xs select-none italic text-center">Tapped words will compile coordinates here...</span>
                  ) : (
                    builderSelectedWords.map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRemoveWordBuilder(idx)}
                        className="px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-950 font-black text-xs rounded-xl flex items-center gap-1 outline-none transition duration-150"
                      >
                        <span>{w}</span>
                        <span className="text-[9px] text-indigo-400">✕</span>
                      </button>
                    ))
                  )}
                </div>

                {/* Clickable Word Tiles Option Palette */}
                <div className="mt-3.5 space-y-2.5">
                  <p className="text-[9px] text-stone-400 font-extrabold uppercase tracking-widest block">Available word building modules:</p>
                  <div className="flex flex-wrap gap-2 justify-center bg-stone-200/30 p-2.5 rounded-xl border border-stone-150/50">
                    {SENTENCE_BUILDER_CHALLENGES[builderIndex].words.map((w, idx) => {
                      const frequency = builderSelectedWords.filter(sel => sel === w).length;
                      const totalInTarget = SENTENCE_BUILDER_CHALLENGES[builderIndex].words.filter(sel => sel === w).length;
                      const isUsedUp = frequency >= totalInTarget;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleWordSelectBuilder(w)}
                          disabled={isUsedUp || builderStatus === 'success'}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                            isUsedUp 
                              ? "bg-stone-150 border-stone-200 text-stone-300 pointer-events-none scale-95" 
                              : "bg-white border-stone-200 hover:border-stone-350 text-stone-700 active:scale-95"
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Validation and Action panel */}
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-stone-150">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={resetSentenceBuilder}
                      disabled={builderSelectedWords.length === 0 || builderStatus === 'success'}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-250 text-stone-600 rounded-lg text-[10px] font-black uppercase transition flex items-center gap-1 border border-stone-200"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={() => {
                        const correctStr = SENTENCE_BUILDER_CHALLENGES[builderIndex].correct;
                        setBuilderSelectedWords(correctStr.split(" "));
                        setBuilderStatus('success');
                      }}
                      className="text-[9px] font-semibold text-indigo-500 hover:underline px-2"
                    >
                      Reveal Correct
                    </button>
                  </div>

                  {builderStatus !== 'success' ? (
                    <button
                      onClick={checkSentenceBuilder}
                      disabled={builderSelectedWords.length === 0}
                      className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl transition active:scale-95 shadow-xxs"
                    >
                      Check Sentence
                    </button>
                  ) : (
                    <button
                      onClick={nextSentenceBuilder}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition active:scale-95 shadow-xxs flex items-center gap-1"
                    >
                      <span>Build Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Success explanation block */}
                {builderStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3.5 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-stone-850 space-y-1.5 leading-normal"
                  >
                    <p className="font-extrabold text-indigo-950 flex items-center gap-1">
                      <span>🎉</span> Perfect Sentence!
                    </p>
                    <p className="font-mono text-[10.5px] text-stone-600 bg-white/80 p-2 rounded-lg border">
                      "{SENTENCE_BUILDER_CHALLENGES[builderIndex].correct}"
                    </p>
                    <p className="text-stone-500 text-[10px] mt-1.5 italic">
                      <span className="font-black text-rose-500 uppercase not-italic text-[9px] block">VANI Learning Hint:</span>
                      {SENTENCE_BUILDER_CHALLENGES[builderIndex].explanation}
                    </p>

                    <div className="pt-2 flex gap-1.5">
                      <button 
                        onClick={() => handleVoiceSpeak(SENTENCE_BUILDER_CHALLENGES[builderIndex].correct)}
                        className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-650" />
                        <span>Listen</span>
                      </button>

                      <button 
                        onClick={() => {
                          const phraseObj: any = {
                            id: "builder-" + SENTENCE_BUILDER_CHALLENGES[builderIndex].id,
                            phrase: SENTENCE_BUILDER_CHALLENGES[builderIndex].correct,
                            translation: SENTENCE_BUILDER_CHALLENGES[builderIndex].correct,
                            tip: "Check word orders: " + SENTENCE_BUILDER_CHALLENGES[builderIndex].explanation,
                            theme: "Sentence Scramble",
                            done: false
                          };
                          if (onStartPhrasePractice) {
                            onStartPhrasePractice(phraseObj);
                          }
                        }}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-xxs"
                      >
                        🎙️ Speak & Practice
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: VOCABULARY MATCH & SCRAMBLE */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              
              {/* SPECIAL REDIRECTION TO VOCABULARY & GRAMMAR LAB */}
              <div 
                onClick={() => setActiveTab('vocab_lab')}
                className="bg-gradient-to-r from-[#1A1A1A] to-[#2A1A0F] border border-[#FF8C4A]/40 rounded-3xl p-4.5 text-left shadow-md cursor-pointer flex items-center justify-between gap-4 transition hover:scale-[1.01] active:scale-99"
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize     : "14px",
                    fontWeight   : "bold",
                    color         : "#FFFFFF",
                    fontFamily   : "Poppins, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span>📘</span>
                    Vocabulary & Grammar Lab
                  </div>
                  <div style={{
                    fontSize     : "11px",
                    color         : "#B0B0B0",
                    fontFamily   : "Poppins, sans-serif",
                    marginTop    : "4px",
                  }}>Master 30 premium real-life phrases with modal verbs, phrasal verbs, daily life and emotions!</div>
                </div>
                <div style={{
                  color         : "#FF8C4A",
                  fontSize      : "14px",
                  fontWeight    : "black",
                  fontFamily: "Poppins, sans-serif"
                }}>Open Lab &rarr;</div>
              </div>
              
              {/* QUIZ SECTION 2.1: CHOOSE THE DEFINITION */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl -z-10" />
                <div className="flex justify-between items-center mb-3.5 pb-2 border-b border-stone-150">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">💎</span>
                    <span className="text-[10px] uppercase font-black text-violet-600 tracking-wider">Word Synonym & Definition Match</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-violet-50 text-violet-650 rounded-lg text-[9.5px] font-black border border-violet-100">
                    Card {vocabIndex + 1}/{VOCABULARY_QUIZ.length}
                  </span>
                </div>

                {/* Target Vocab word */}
                <div className="text-center py-5 space-y-1 select-none">
                  <span className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Identify the meaning of:</span>
                  <h3 className="text-3xl font-black text-violet-950 tracking-tight font-sans">{VOCABULARY_QUIZ[vocabIndex].word}</h3>
                  <div className="inline-block py-1 px-3 bg-stone-100/80 border border-stone-200 rounded-2xl max-w-xs mx-auto text-center mt-2">
                    <p className="text-[11px] font-semibold italic text-stone-500">
                      "{VOCABULARY_QUIZ[vocabIndex].sentence}"
                    </p>
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {VOCABULARY_QUIZ[vocabIndex].options.map((opt, idx) => {
                    const item = VOCABULARY_QUIZ[vocabIndex];
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === item.correctIdx;
                    const hasAnswered = vocabStatus === 'answered';

                    let optionStyle = "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-750 hover:border-stone-350 cursor-pointer";
                    if (isSelected) {
                      optionStyle = isCorrect 
                        ? "bg-emerald-500 border-emerald-600 text-white scale-[1.01]" 
                        : "bg-red-500 border-red-650 text-white scale-[0.99] animate-shake";
                    } else if (hasAnswered && isCorrect) {
                      // Highlight correct option if user selected wrong one
                      optionStyle = "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={hasAnswered}
                        className={`w-full p-3.5 text-xs text-left font-semibold rounded-2xl border transition-all flex items-center justify-between outline-none ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Post response advice */}
                {vocabStatus === 'answered' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 leading-relaxed text-stone-700"
                  >
                    <p className="font-mono text-[10.5px] font-medium block">
                      <span className="font-black text-rose-500 uppercase text-[9px] block">VANI Flashcard Synonyms:</span>
                      <strong className="text-violet-850 font-black">{VOCABULARY_QUIZ[vocabIndex].synonyms}</strong>
                    </p>
                    <p className="text-[10px] text-stone-500 border-t pt-1.5 mt-1">
                      <span className="font-extrabold text-stone-800">Learn to use it:</span> {VOCABULARY_QUIZ[vocabIndex].explanation}
                    </p>

                    <div className="pt-2 flex justify-between items-center gap-2">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleVoiceSpeak(`${VOCABULARY_QUIZ[vocabIndex].word}. It means: ${VOCABULARY_QUIZ[vocabIndex].explanation}`)}
                          className="px-2.5 py-1 bg-white hover:bg-stone-50 text-slate-700 border border-stone-200 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xxs cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-violet-650" />
                          <span>Listen</span>
                        </button>

                        <button 
                          onClick={() => {
                            const phraseObj: any = {
                              id: "vocab-match-" + VOCABULARY_QUIZ[vocabIndex].id,
                              phrase: VOCABULARY_QUIZ[vocabIndex].word + " is " + VOCABULARY_QUIZ[vocabIndex].options[VOCABULARY_QUIZ[vocabIndex].correctIdx],
                              translation: VOCABULARY_QUIZ[vocabIndex].sentence,
                              tip: "Master the term '" + VOCABULARY_QUIZ[vocabIndex].word + "': " + VOCABULARY_QUIZ[vocabIndex].explanation,
                              theme: "Synonym Matcher",
                              done: false
                            };
                            if (onStartPhrasePractice) {
                              onStartPhrasePractice(phraseObj);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-xxs cursor-pointer"
                        >
                          🎙️ Speak & Practice
                        </button>
                      </div>

                      <button
                        onClick={handleNextVocab}
                        className="px-3.5 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition active:scale-95 shadow-xxs cursor-pointer"
                      >
                        <span>Next Vocabulary</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* VOCAB SECTION 2.2: CHALLENGING SPELLING DESK */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs text-left relative">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-150">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🔠</span>
                    <span className="text-[10px] uppercase font-black text-amber-600 tracking-wider">Unscramble & Fix Complex Spelling</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[9.5px] font-black border border-amber-100">
                    Spelling {scrambleIndex + 1}/{SPELLING_SCRAMBLES.length}
                  </span>
                </div>

                <p className="text-stone-500 text-[10.5px] font-bold mb-3">
                  A very common spelling test trap. Rearrange these letters to compose the correct English word:
                </p>

                {/* Scrambled Box */}
                <div className="p-4 bg-amber-50/50 border border-amber-200/50 text-center rounded-2xl py-6 select-all font-mono tracking-widest text-lg font-black text-amber-700">
                  {SPELLING_SCRAMBLES[scrambleIndex].scrambled}
                </div>

                {/* Inputs and clues */}
                <div className="space-y-3 mt-3.5">
                  <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
                      <span className="font-extrabold text-stone-700 block uppercase text-[8.5px]">Clue assistance:</span>
                      {SPELLING_SCRAMBLES[scrambleIndex].clue}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={scrambleAnswer}
                      onChange={(e) => setScrambleAnswer(e.target.value)}
                      placeholder="Type correct spelling..."
                      className="flex-1 bg-white border border-stone-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-800 transition outline-none"
                    />
                    <button
                      onClick={checkSpellingScramble}
                      disabled={!scrambleAnswer.trim() || scrambleStatus === 'success'}
                      className="px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl transition active:scale-95 shadow-xxs"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {scrambleStatus !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-4 p-4.5 rounded-2xl text-xs flex justify-between items-center ${
                      scrambleStatus === 'success' 
                        ? "bg-emerald-50 border-emerald-250 text-emerald-950" 
                        : "bg-red-50 border-red-150 text-red-900"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold flex items-center gap-1">
                        {scrambleStatus === 'success' ? "🎉 Excellent spelling!" : "⚠️ Spelled differently!"}
                      </p>
                      <p className="text-[10.5px] mt-1">
                        Correct: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border">{SPELLING_SCRAMBLES[scrambleIndex].correct}</strong>
                      </p>
                    </div>

                    {scrambleStatus === 'success' ? (
                      <button
                        onClick={handleNextScramble}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9.5px] font-black uppercase tracking-wider transition active:scale-95"
                      >
                        Next Word
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setScrambleAnswer("");
                          setScrambleStatus('idle');
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9.5px] font-black uppercase tracking-wider transition active:scale-95"
                      >
                        Retry
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2.5: VOCAB LAB COMPONENT */}
          {activeTab === 'vocab_lab' && (
            <div className="space-y-4">
              {/* Overall Progress Summary - STRICTLY CORRESPONDING TO USER INTENT AND EXACT STYLE SPECIFICATIONS */}
              <div 
                className="p-5"
                style={{
                  padding : "16px",
                  background : "linear-gradient(135deg,#1E1208,#1A1A1A)",
                  border : "1px solid #FF8C4A",
                  borderRadius : "24px",
                  textAlign : "center"
                }}
              >
                <div style={{
                  fontSize : "32px",
                  fontWeight : "bold",
                  color : "#FF8C4A"
                }} id="vocab-overall-percent">
                  {Math.round((practicedPhrases.length / 33) * 100)}%
                </div>
                <div style={{
                  fontSize : "12px",
                  color : "#B0B0B0",
                  fontFamily : "Poppins,sans-serif"
                }}>
                  <span id="vocab-done-count">{practicedPhrases.length}</span> of <span id="vocab-total-count">30</span> phrases mastered
                </div>
              </div>

              {/* Subtitle / Explanation banner inside the tab */}
              <div className="bg-white border border-stone-200 p-4 rounded-2xl shadow-xxs text-left">
                <span className="text-[10px] uppercase font-black text-[#FF8C4A] tracking-wider block mb-1">
                  Active Phrase Speaking Lab
                </span>
                <p className="text-stone-500 text-[10.5px] font-bold leading-relaxed">
                  Practice correct word emphasis and pronunciation with VANI. Speak along to automatically verify and master each professional sentence!
                </p>
              </div>

              {/* Collapsible Categories list */}
              <div className="space-y-4">
                {VOCAB_CATEGORIES.map((cat) => {
                  const isExpanded = vocabExpandedCategory === cat.name;
                  const completedInCat = cat.phrases.filter(p => practicedPhrases.includes(p.id)).length;
                  const totalInCat = cat.phrases.length;
                  const percent = totalInCat > 0 ? (completedInCat / totalInCat) * 100 : 0;

                  return (
                    <div 
                      key={cat.name} 
                      className="vocab-category transition-all duration-350" 
                      style={{
                        background    : "#1A1A1A",
                        border        : "1px solid rgba(255,107,43,0.15)",
                        borderRadius  : "20px",
                        overflow      : "hidden",
                      }}
                    >
                      <div 
                        onClick={() => setVocabExpandedCategory(isExpanded ? null : cat.name)}
                        style={{
                          display       : "flex",
                          alignItems    : "center",
                          padding       : "14px",
                          cursor        : "pointer",
                        }}
                      >
                        <div style={{
                          width           : "40px",
                          height          : "40px",
                          borderRadius    : "10px",
                          background      : "rgba(255,107,43,0.15)",
                          display         : "flex",
                          alignItems      : "center",
                          justifyContent  : "center",
                          fontSize        : "20px",
                        }}>
                          {cat.icon}
                        </div>

                        <div style={{ flex: 1, marginLeft: "12px" }}>
                          <div style={{
                            fontSize     : "14px",
                            fontWeight   : "bold",
                            color         : "#FFFFFF",
                            fontFamily   : "Poppins,sans-serif",
                          }}>
                            {cat.name}
                          </div>
                          <div style={{
                            fontSize     : "11px",
                            color         : "#767676",
                            fontFamily   : "Poppins,sans-serif",
                          }}>
                            {cat.subtitle} ({completedInCat} of {totalInCat} mastered)
                          </div>

                          {/* Progress bar */}
                          <div style={{
                            height        : "4px",
                            background    : "#2A2A2A",
                            borderRadius  : "2px",
                            marginTop     : "6px",
                            overflow      : "hidden",
                          }}>
                            <div 
                              className="category-progress"
                              style={{
                                height      : "100%",
                                background  : "#22C55E",
                                width       : `${percent}%`,
                                transition  : "width 0.3s",
                              }}
                            />
                          </div>
                        </div>

                        <div className="chevron" style={{
                          color         : "#FF8C4A",
                          fontSize      : "14px",
                          transition    : "transform 0.3s",
                          transform     : isExpanded ? "rotate(180deg)" : "none",
                        }}>
                          ▼
                        </div>
                      </div>

                      <div 
                        style={{
                          maxHeight    : isExpanded ? "2000px" : "0",
                          overflow     : "hidden",
                          transition   : "max-height 0.3s ease",
                        }}
                      >
                        {cat.phrases.map((phrase) => {
                          const isCompleted = practicedPhrases.includes(phrase.id);
                          return (
                            <div 
                              key={phrase.id} 
                              className="phrase-item"
                              style={{
                                padding       : "12px 14px",
                                borderTop     : "1px solid #2A2A2A",
                              }}
                            >
                              <div 
                                className="phrase-text"
                                style={{
                                  fontSize     : "14px",
                                  fontWeight   : 600,
                                  color         : "#FFFFFF",
                                  fontFamily   : "Poppins,sans-serif",
                                  marginBottom : "6px",
                                  lineHeight   : "1.4",
                                }}
                              >
                                &ldquo;{phrase.phrase}&rdquo;
                              </div>

                              <div 
                                className="phrase-tip"
                                style={{
                                  fontSize     : "12.5px",
                                  color         : "#B0B0B0",
                                  fontFamily   : "Poppins,sans-serif",
                                  fontStyle    : "italic",
                                  marginBottom : "10px",
                                  lineHeight   : "1.5",
                                  borderLeft   : "2px solid #FF8C4A",
                                  paddingLeft  : "8px",
                                }}
                              >
                                💡 {phrase.tip}
                                <div className="text-[11.5px] text-stone-400 not-italic mt-1">
                                  Meaning: {phrase.translation}
                                </div>
                              </div>

                              <div 
                                className="phrase-actions"
                                style={{
                                  display       : "flex",
                                  alignItems    : "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <button
                                  onClick={() => onStartPhrasePractice && onStartPhrasePractice(phrase)}
                                  className="practice-btn transition active:scale-95 hover:brightness-110"
                                  style={{
                                    background    : "rgba(255,107,43,0.15)",
                                    border        : "1px solid #FF8C4A",
                                    borderRadius  : "8px",
                                    color         : "#FF8C4A",
                                    fontSize      : "12px",
                                    fontWeight    : "bold",
                                    padding       : "8px 14px",
                                    cursor        : "pointer",
                                    fontFamily    : "Poppins,sans-serif",
                                  }}
                                >
                                  🎙️ Practice with VANI
                                </button>
                                
                                <span className="phrase-status">
                                  {isCompleted ? "✅" : ""}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REGIONAL FLASHCARDS */}
          {activeTab === 'regional' && (
            <div className="space-y-4">
              
              {/* Regional language options dropdown bar */}
              <div className="bg-white border border-stone-200 p-4 rounded-3xl shadow-xs text-left">
                <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider block mb-2">
                  Select your Native Indian Regional Language
                </span>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(REGIONAL_FLASHCARDS) as Array<keyof typeof REGIONAL_FLASHCARDS>).map((lang) => {
                    const isActive = regionalLang === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() => {
                          setRegionalLang(lang);
                          setFlashcardIdx(0);
                          setIsFlipped(false);
                          handleVoiceSpeak(`Selected ${lang} flashcards`);
                        }}
                        className={`p-2 rounded-xl text-center text-[10.5px] font-black uppercase transition border ${
                          isActive 
                            ? "bg-rose-50 border-rose-300 text-rose-600 shadow-xxs" 
                            : "bg-stone-50 border-stone-150 hover:bg-stone-100/50 text-stone-500"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC FLASHCARD FLIP BOX */}
              <div className="perspective-1000 w-full min-h-64 cursor-pointer select-none" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`relative w-full min-h-64 transition-transform duration-550 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                  
                  {/* FRONT SIDE (Native Regional Text) */}
                  <div className="absolute inset-0 w-full h-full bg-white border-2 border-dashed border-rose-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left backface-hidden">
                    <div className="flex justify-between items-center text-rose-500 text-[10px] font-black uppercase tracking-widest">
                      <span>📔 {regionalLang} English Prompt</span>
                      <span className="px-2 py-0.5 bg-rose-50/50 rounded border border-rose-100">Card {flashcardIdx + 1}/{REGIONAL_FLASHCARDS[regionalLang].length}</span>
                    </div>

                    <div className="text-center py-6">
                      <span className="text-[10px] uppercase font-black text-stone-400 block tracking-widest mb-1.5">Translate this thought to English:</span>
                      <h4 className="text-xl font-bold font-sans text-stone-900 leading-relaxed px-2 bg-rose-50/10 py-3 rounded-2xl border border-rose-100/10 inline-block">
                        {REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].native}
                      </h4>
                    </div>

                    <div className="text-center">
                      <span className="px-4 py-2 bg-rose-500/10 text-rose-600 rounded-2xl text-[10.5px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-rose-500/15 transition animate-pulse">
                        💡 Tap to Flip and Speak English Translation
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE (English translation & accent guide) */}
                  <div className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between text-left rotate-y-180 backface-hidden">
                    <div className="flex justify-between items-center text-amber-400 text-[10px] font-black uppercase tracking-widest">
                      <span>👑 English Professional Expression</span>
                      <span className="px-2 py-0.5 bg-white/10 rounded border border-white/10">Card {flashcardIdx + 1}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[9.5px] uppercase font-black text-stone-400 block tracking-widest mb-1">Fluency expression:</span>
                        <h4 className="text-[15px] font-black text-amber-300 leading-snug">
                          "{REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].english}"
                        </h4>
                      </div>

                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl space-y-1">
                        <span className="text-[9px] uppercase font-black text-rose-400 tracking-wider block">Indian accent reduction tip:</span>
                        <p className="text-[10.5px] text-stone-300 leading-normal font-semibold">
                          {REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].advice}
                        </p>
                      </div>
                    </div>

                     <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1.5 animate-fadeIn">
                        <button
                          onClick={() => handleVoiceSpeak(REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].english)}
                          disabled={isSynthesizing}
                          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition active:scale-95 flex items-center gap-1 shadow-sm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>

                        <button 
                          onClick={() => {
                            const phraseObj: any = {
                              id: "regional-" + REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].id,
                              phrase: REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].english,
                              translation: REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].native,
                              tip: REGIONAL_FLASHCARDS[regionalLang][flashcardIdx].advice,
                              theme: "Regional Express",
                              done: false
                            };
                            if (onStartPhrasePractice) {
                              onStartPhrasePractice(phraseObj);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition active:scale-95 flex items-center gap-1 shadow-sm"
                        >
                          🎙️ Speak & Practice
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setIsFlipped(false);
                            // brief delay to allow card flip to finish
                            setTimeout(() => {
                              setXp(p => p + 10);
                              setFlashcardIdx((prev) => (prev + 1) % REGIONAL_FLASHCARDS[regionalLang].length);
                              showToast("🌿 Flashcard Completed!", "+10 XP gained!", "success");
                            }, 150);
                          }}
                          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[10px] font-black uppercase tracking-wider rounded-xl transition active:scale-95"
                        >
                          Next Card
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* CARD PROGRESS BANNER */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-center text-stone-550 text-[10px] font-semibold flex items-center justify-center gap-1">
                <span>📌</span>
                <span>Complete cards to claim <strong>+10 XP</strong> and listen to accent-reduction speaking exercises.</span>
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* DEV RESET STATS BUTTON */}
      <div className="pt-4 border-t border-stone-200 flex justify-center gap-2">
        <button 
          onClick={() => {
            setGrammarScore(0);
            setVocabScore(0);
            setGrammarIndex(0);
            setVocabIndex(0);
            setBuilderIndex(0);
            setBuilderSelectedWords([]);
            setScrambleIndex(0);
            setFlashcardIdx(0);
            setIsFlipped(false);
            setGrammarStatus('idle');
            setVocabStatus('idle');
            setScrambleStatus('idle');
            showToast("🔧 Practice History Reset", "All practice indices returned to starting positions.", "info");
            handleVoiceSpeak("All spelling, synonym, and card challenges re-seeded smoothly.");
          }}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-500 hover:text-stone-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Practice History Indices</span>
        </button>
      </div>

    </div>
  );
}
