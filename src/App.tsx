import React, { useState, useRef, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  Sparkles, 
  PhoneCall, 
  Menu, 
  Volume2, 
  Mic, 
  MicOff, 
  CheckCircle, 
  Lock, 
  Send, 
  ArrowLeft, 
  Languages, 
  User, 
  HelpCircle, 
  History, 
  Compass, 
  Check, 
  MessageSquare,
  Award,
  ChevronRight,
  BookMarked,
  Gamepad2,
  PlayCircle,
  Lightbulb,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Zap,
  CheckSquare,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  UserCheck,
  SmartphoneIcon,
  Flame,
  Plus,
  RefreshCw,
  Trash2,
  FileText,
  Bell,
  Wifi,
  Database,
  Unlock,
  GraduationCap
} from "lucide-react";
import { TOPICS as initialTopics, THEMES, QUOTES } from "./data";
import { Topic, Message, TranslationResult } from "./types";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { LanguageBridge } from "./components/LanguageBridge";
import { PracticeCenter } from "./components/PracticeCenter";
import { apiFetch } from "./utils/api";

export interface VocabPhrase {
  id: string;
  phrase: string;
  translation: string;
  tip: string;
}

export interface VocabCategory {
  name: string;
  icon: string;
  subtitle: string;
  phrases: VocabPhrase[];
}

export const VOCAB_CATEGORIES: VocabCategory[] = [
  {
    name: "Should / Shouldn't / May / Might",
    icon: "💡",
    subtitle: "Advice & Possibility · 6 phrases",
    phrases: [
      {
        id: "mod_1",
        phrase: "You should wear a jacket, it is freezing outside.",
        translation: "তোমার একটা জ্যাকেট পরা উচিত, বাইরে খুব ঠান্ডা।",
        tip: "Should = giving friendly advice. Use it when suggesting what is good for someone."
      },
      {
        id: "mod_2",
        phrase: "Could you please elaborate on that point?",
        translation: "আপনি কি অনুগ্রহ করে ওই বিষয়টি আরও বিস্তারিত বলবেন?",
        tip: "Could indicates polite requests. Pronounce 'elaborate' as an action: uh-lab-uh-rayt."
      },
      {
        id: "mod_3",
        phrase: "We might want to consider other options before deciding.",
        translation: "সিদ্ধান্ত নেওয়ার আগে আমাদের অন্যান্য বিকল্পগুলি বিবেচনা করা হতে পারে।",
        tip: "Might expresses soft possibility. Keep it tentative and polite."
      },
      {
        id: "mod_4",
        phrase: "May I share some feedback on this task?",
        translation: "আমি কি এই কাজের ব্যাপারে কিছু মতামত জানাতে পারি?",
        tip: "May is formal and polite. Use a rising intonation at the end of the question."
      },
      {
        id: "mod_5",
        phrase: "You shouldn't worry about the small details too much.",
        translation: "ছোটখাটো বিষয় নিয়ে আপনার খুব বেশি চিন্তা করা উচিত নয়।",
        tip: "Shouldn't is the negative of should. Connect 'should' and 'not' clearly: shood-unt."
      },
      {
        id: "mod_6",
        phrase: "Could you direct me to the nearest metro station?",
        translation: "আপনি কি আমাকে নিকটবর্তী মেট্রো স্টেশনের পথটি নির্দেশ করতে পারেন?",
        tip: "Could makes requesting directions polite. Pronounce 'direct' as dih-rekt or dye-rekt."
      }
    ]
  },
  {
    name: "Phrasal Verbs for Daily Life",
    icon: "🔗",
    subtitle: "Common phrasal verbs natives use daily · 6 phrases",
    phrases: [
      {
        id: "pv_1",
        phrase: "Let's touch base next week to review progress.",
        translation: "চলুন আগামী সপ্তাহে অগ্রগতির কথা আলোচনা করার জন্য একটু যোগাযোগ করি।",
        tip: "Touch base means to briefly contact someone. Link 'touch base' smoothly together."
      },
      {
        id: "pv_2",
        phrase: "I will look into this matter immediately.",
        translation: "আমি অবিলম্বে এই বিষয়টি খতিয়ে দেখব।",
        tip: "Look into means investigate. Connect 'look' and 'into' seamlessly: look-in-to."
      },
      {
        id: "pv_3",
        phrase: "It was wonderful catching up with you today.",
        translation: "আজকে তোমার সঙ্গে দেখা হয়ে / পুরোনো গল্প করে ভীষণ ভালো লাগলো।",
        tip: "Catch up means talking about news or updates. Pronounce as 'catch-in-up'."
      },
      {
        id: "pv_4",
        phrase: "I need to look for my keys, I cannot find them.",
        translation: "আমার চাবিগুলো খুঁজতে হবে, আমি সেগুলো পাচ্ছি না।",
        tip: "Look for means search. Say 'look for' in one smooth phrase."
      },
      {
        id: "pv_5",
        phrase: "We had to call off the meeting due to heavy rain.",
        translation: "ভারী বৃষ্টির কারণে আমাদের সভাটি বাতিল করতে হয়েছিল।",
        tip: "Call off means to cancel. Pronounce 'call off' as 'caw-loff'."
      },
      {
        id: "pv_6",
        phrase: "She is trying to cut down on sugar for her health.",
        translation: "সে নিজের স্বাস্থ্যের জন্য চিনি খাওয়া কমানোর চেষ্টা করছে।",
        tip: "Cut down on means to reduce consumption. Say it with emphasis on 'cut'."
      }
    ]
  },
  {
    name: "Workplace Pressure & Organization",
    icon: "💼",
    subtitle: "Talk about handling work pressure · 6 phrases",
    phrases: [
      {
        id: "wp_1",
        phrase: "We need to align our goals to ensure project success.",
        translation: "প্রকল্পের সাফল্য নিশ্চিত করতে আমাদের লক্ষ্যগুলি এক দিকে চালিত করতে হবে।",
        tip: "Align has a silent 'g' (uh-line). Link 'align our' as if it were 'uh-lie-nour'."
      },
      {
        id: "wp_2",
        phrase: "I'd like to express my perspective on this project.",
        translation: "আমি এই প্রকল্পের ব্যাপারে আমার দৃষ্টিভঙ্গি ব্যক্ত করতে চাই।",
        tip: "Pronounce 'perspective' with emphasis on the second syllable: per-SPEC-tive."
      },
      {
        id: "wp_3",
        phrase: "Thank you for taking the initiative to solve this.",
        translation: "এটি সমাধান করার জন্য উদ্যোগ নেওয়ার জন্য আপনাকে ধন্যবাদ।",
        tip: "Initiative is pronounced ih-NISH-uh-tiv. Keep the third syllable very soft."
      },
      {
        id: "wp_4",
        phrase: "I am feeling quite overwhelmed with the heavy workload.",
        translation: "অতিরিক্ত কাজের চাপে আমি সত্যিই বেশ হিমশিম খাচ্ছি / অভিভূত বোধ করছি।",
        tip: "Overwhelmed means flooded or stressed. Pronounce the 'h' silently: over-welmd."
      },
      {
        id: "wp_5",
        phrase: "Let's grab a quick bite before we start the conference.",
        translation: "কনফারেন্স শুরু করার আগে চলুন চটপট কিছু খেয়ে নিই।",
        tip: "Grab a quick bite is idiomatic. Ensure 'bite' ends with a crisp, clear 't'."
      },
      {
        id: "wp_6",
        phrase: "We need to meet the deadline by Friday afternoon.",
        translation: "শুক্রবার বিকেলের মধ্যে আমাদের সময়সীমা পূরণ করতে হবে।",
        tip: "Meet the deadline means to finish on time. Emphasize 'deadline' clearly."
      }
    ]
  },
  {
    name: "Casual & Public Conversations",
    icon: "🗺️",
    subtitle: "Daily life tasks and habits · 6 phrases",
    phrases: [
      {
        id: "hd_1",
        phrase: "What have you been up to lately?",
        translation: "আজকাল তুমি কী করছো / কেমন চলছে সব?",
        tip: "Link 'been' and 'up' so it sounds like 'bee-nup'. It makes your casual English flow."
      },
      {
        id: "hd_2",
        phrase: "That sounds like a great plan, I'm in!",
        translation: "দারুণ পরিকল্পনা মনে হচ্ছে, আমিও আছি!",
        tip: "Say 'sounds like a' in one single breath. Emphasize 'in' to show high eagerness."
      },
      {
        id: "hd_3",
        phrase: "I'm running a bit late, see you soon.",
        translation: "আমার একটু দেরি হয়ে যাচ্ছে, শীঘ্রই দেখা হচ্ছে।",
        tip: "Connect 'running' and 'a bit' seamlessly: run-ning-uh-bit."
      },
      {
        id: "hd_4",
        phrase: "Excuse me, does this bus go to the airport?",
        translation: "মাপ করবেন, এই বাসটি কি বিমানবন্দরে যায়?",
        tip: "Pronounce 'excuse' with a soft 'z' sound at the end: ik-skyooz."
      },
      {
        id: "hd_5",
        phrase: "Is there a good place to eat around here?",
        translation: "কাছাকাছি খাওয়ার ভালো জায়গা কোথায় আছে?",
        tip: "Blend 'around' and 'here' together to sound natural: uh-rownd-here."
      },
      {
        id: "hd_6",
        phrase: "How long does it take to walk there?",
        translation: "ওখানে হেঁটে যেতে কতটা সময় লাগে?",
        tip: "The 'l' in walk is completely silent, pronounce it as wok."
      }
    ]
  },
  {
    name: "Expressing Emotions & Feelings",
    icon: "😊",
    subtitle: "Express how you're feeling to others · 6 phrases",
    phrases: [
      {
        id: "em_1",
        phrase: "I'm absolutely thrilled about this opportunity!",
        translation: "আমি এই সুবর্ণ সুযোগটি পেয়ে অত্যন্ত আনন্দিত এবং উৎসাহিত!",
        tip: "Thrilled represents deep joy. Pronounce 'th' softly: thril-d."
      },
      {
        id: "em_2",
        phrase: "That is incredibly disappointing to hear.",
        translation: "ওটা শোনা সত্যি অত্যন্ত হতাশাজনক ও দুঃখজনক।",
        tip: "Speak 'disappointing' as dis-uh-poynt-ing with clear stresses."
      },
      {
        id: "em_3",
        phrase: "I am feeling a bit anxious about the results.",
        translation: "ফলাফল নিয়ে আমি একটু উদ্বিগ্ন / চিন্তিত বোধ করছি।",
        tip: "Anxious is pronounced as angk-shuhs. Produce the light nasal 'ng' sound."
      },
      {
        id: "em_4",
        phrase: "Thank you, that gesture was incredibly thoughtful.",
        translation: "ধন্যবাদ, আপনার ওই সদয় আচরণটি ভীষণ চমৎকার ও বিবেচক ছিল।",
        tip: "Thoughtful has a silent 'gh'. Say it gracefully as thawt-ful."
      },
      {
        id: "em_5",
        phrase: "Please don't worry about it, everything is fine.",
        translation: "দয়া করে এটা নিয়ে চিন্তা করবেন না, সব ঠিক আছে।",
        tip: "Drop your pitch at the end of 'fine' to sound reassuring and warm."
      },
      {
        id: "em_6",
        phrase: "I love reading a book before going to sleep.",
        translation: "উত্তম ঘুমের আগে বই পড়া আমার খুব প্রিয় অভ্যাস।",
        tip: "Blend 'going' and 'to' smoothly, moving immediately into 'sleep' with a long 'ee'."
      }
    ]
  }
];

// Safe fallback image component to prevent broken Unsplash images from showing as broken resource icons
function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackText,
  gradientFrom, 
  gradientTo,
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement> & { 
  fallbackText?: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const [hasError, setHasError] = useState(false);

  // Reset error state when the src changes (critical for component reuse/recycling)
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const getPlaceholderConfig = (text: string) => {
    const norm = (text || "").toLowerCase();
    
    if (norm.includes("interview") || norm.includes("job") || norm.includes("tough") || norm.includes("college") || norm.includes("professor") || norm.includes("admission") || norm.includes("professional")) {
      return {
        gradient: "from-blue-600 to-indigo-700",
        emoji: "💼",
        sub: "INTERVIEW PRO"
      };
    }
    if (norm.includes("workspace") || norm.includes("work") || norm.includes("co-worker") || norm.includes("meeting") || norm.includes("office") || norm.includes("team") || norm.includes("feedback") || norm.includes("business") || norm.includes("corporate")) {
      return {
        gradient: "from-indigo-600 to-violet-800",
        emoji: "👥",
        sub: "WORKPLACE"
      };
    }
    if (norm.includes("introduce") || norm.includes("self") || norm.includes("routine") || norm.includes("education") || norm.includes("routine") || norm.includes("academic") || norm.includes("learn") || norm.includes("stud")) {
      return {
        gradient: "from-emerald-500 to-teal-600",
        emoji: "🎓",
        sub: "ABOUT YOURSELF"
      };
    }
    if (norm.includes("friend") || norm.includes("routine") || norm.includes("casual") || norm.includes("routine") || norm.includes("speak") || norm.includes("vocabulary") || norm.includes("pronun")) {
      return {
        gradient: "from-emerald-500 to-teal-600",
        emoji: "✨",
        sub: "FLUENCY"
      };
    }
    if (norm.includes("dinner") || norm.includes("family") || norm.includes("weekend") || norm.includes("airport") || norm.includes("attendant") || norm.includes("city") || norm.includes("hotel") || norm.includes("doctor") || norm.includes("shopping") || norm.includes("phone")) {
      return {
        gradient: "from-rose-500 to-orange-500",
        emoji: "🏡",
        sub: "DAILY LIFE"
      };
    }
    if (norm.includes("bank") || norm.includes("hdfc") || norm.includes("finan") || norm.includes("money")) {
      return {
        gradient: "from-sky-500 to-indigo-600",
        emoji: "🏦",
        sub: "BANKING"
      };
    }
    if (norm.includes("goat") || norm.includes("sheep") || norm.includes("bakrid") || norm.includes("fest")) {
      return {
        gradient: "from-amber-500 to-amber-600",
        emoji: "🐐",
        sub: "FESTIVAL"
      };
    }
    if (norm.includes("byju") || norm.includes("brand") || norm.includes("tech") || norm.includes("educat")) {
      return {
        gradient: "from-purple-500 to-red-600",
        emoji: "📱",
        sub: "EDTECH"
      };
    }
    if (norm.includes("nestle") || norm.includes("happi") || norm.includes("well") || norm.includes("employee")) {
      return {
        gradient: "from-emerald-400 to-cyan-500",
        emoji: "🍫",
        sub: "CORPORATE"
      };
    }
    
    // Default general fallback
    return {
      gradient: "from-indigo-500 to-purple-600",
      emoji: "🎙️",
      sub: "COACH VANI"
    };
  };

  const config = getPlaceholderConfig(fallbackText || alt || "");
  const appliedGradient = (gradientFrom && gradientTo) ? `from-${gradientFrom} to-${gradientTo}` : config.gradient;

  if (hasError || !src) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${appliedGradient} text-white select-none overflow-hidden ${className || ""}`}>
        {/* Decorative concentric glowing rings or abstract grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-20 h-20 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        
        {/* Centered themed layout */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
          <span className="text-2xl filter drop-shadow-sm mb-1 transform hover:scale-110 transition duration-300">{config.emoji}</span>
          <span className="text-[7.5px] text-white/90 font-black uppercase tracking-widest leading-none bg-black/10 px-1.5 py-0.5 rounded-full border border-white/10">{config.sub}</span>
          <span className="text-[9.5px] font-extrabold text-white mt-1 px-2 line-clamp-1 truncate max-w-full leading-tight">{fallbackText || alt || "Practice"}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        console.warn("Image load failed, showing beautiful placeholder:", alt);
        setHasError(true);
      }}
      {...props}
    />
  );
}

// --- VANI Translation block component ---
interface TranslationBlockProps {
  text: string | null;
  loading?: boolean;
}

function TranslationBlock({ text, loading }: TranslationBlockProps) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListen = () => {
    if (!text) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 0.85;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const isLocked = text?.startsWith("🔒");
  const baseClassName = isLocked
    ? "self-end max-w-[82%] bg-amber-50/95 border-l-4 border-amber-500 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-4.5 mt-2 mb-3 shadow-xs text-left"
    : "self-end max-w-[82%] bg-[#F3E8FF] border-l-4 border-[#8B2FC9] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-4.5 mt-2 mb-3 shadow-xs text-left";

  // LOADING STATE — shimmer skeleton
  if (loading) {
    return (
      <div className={baseClassName}>
        <style>{`
          @keyframes shimmerAnimation {
            0% { opacity: 0.4; }
            50% { opacity: 0.85; }
            100% { opacity: 0.4; }
          }
        `}</style>
        <div className="text-[10px] md:text-[11px] font-extrabold tracking-wider text-[#8B2FC9] uppercase mb-2">
          🔤 IN ENGLISH
        </div>
        <div 
          className="h-3.5 bg-[#8B2FC9]/15 rounded-lg w-[70%]"
          style={{ animation: "shimmerAnimation 1.2s ease infinite" }}
        />
        <div 
          className="h-3.5 bg-[#8B2FC9]/10 rounded-lg w-[45%] mt-1.5"
          style={{ animation: "shimmerAnimation 1.2s ease infinite" }}
        />
      </div>
    );
  }

  // LOADED STATE — full beautiful card
  return (
    <div 
      className={baseClassName}
      style={{
        animation: "fadeSlideUp 0.35s ease forwards"
      }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className={`text-[10px] md:text-[11px] font-extrabold tracking-wider ${isLocked ? "text-amber-700" : "text-[#8B2FC9]"} uppercase mb-1.5`}>
        {isLocked ? "🔒 Trial Restriction" : "🔤 IN ENGLISH"}
      </div>

      <div className={`h-[1px] ${isLocked ? "bg-amber-500/20" : "bg-[#8B2FC9]/15"} mb-2.5`} />

      <div className={`${isLocked ? "text-[12px] md:text-[13px] font-medium text-amber-900" : "text-[18px] md:text-[20px] font-bold text-[#1A1A1A]"} leading-relaxed ${isLocked ? "mb-1" : "mb-3"}`}>
        {text}
      </div>

      {!isLocked && (
        <div className="flex gap-2">
          <button 
            onClick={handleCopy} 
            style={{
              background: copied ? "rgba(76,175,80,0.15)" : "#EEEEEE",
              border: "none",
              borderRadius: "14px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: copied ? "#4CAF50" : "#333",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>

          <button
            onClick={handleListen}
            style={{
              background: speaking ? "rgba(139,47,201,0.25)" : "rgba(139,47,201,0.12)",
              border: "none",
              borderRadius: "14px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#8B2FC9",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {speaking ? "⏹ Stop" : "🔊 Listen"}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Ambient Music Synthesizer Class (Web Audio API) ---
class AmbientMusicManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private trackType: 'lofi' | 'bengali' | 'celestial' = 'lofi';
  private loopInterval: any = null;

  constructor() {}

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.20, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.startLoop();
    } catch (e) {
      console.warn("Web Audio API not fully initialized or supported on this system.", e);
    }
  }

  public setTrackType(track: 'lofi' | 'bengali' | 'celestial') {
    this.trackType = track;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // instantly play updated track chord
    this.playChord();
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.5);
    }
  }

  public playChord() {
    if (!this.ctx || !this.masterGain) return;
    
    // warm Indian frequencies (Santoor pentatonic raga cluster) vs lofi vs celestial
    let notes = [130.81, 164.81, 196.00, 246.94, 293.66]; // Lo-fi (C Major 7/9)
    
    if (this.trackType === 'bengali') {
      // mystic peaceful Bengali Baul / Santoor vibe drone
      notes = [138.59, 174.61, 196.00, 207.65, 277.18]; // peaceful F minor raga stack
    } else if (this.trackType === 'celestial') {
      notes = [146.83, 174.61, 220.00, 293.66, 349.23]; // D minor atmospheric pad
    }

    // fade out older oscillators
    this.oscs.forEach(o => { try { o.stop(); } catch(e){} });
    this.oscs = [];

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = this.trackType === 'bengali' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // detune a bit for warmth
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      const targetGain = 0.05 - (idx * 0.007);
      gainNode.gain.linearRampToValueAtTime(Math.max(0.005, targetGain), this.ctx.currentTime + 1.0 + Math.random());
      
      // sustain
      gainNode.gain.setValueAtTime(Math.max(0.005, targetGain), this.ctx.currentTime + 4.0);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 5.5 + Math.random());

      osc.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      osc.start();
      this.oscs.push(osc);
    });
  }

  private startLoop() {
    this.playChord();
    this.loopInterval = setInterval(() => {
      this.playChord();
    }, 5500);
  }

  public cleanup() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.oscs.forEach(o => { try { o.stop(); } catch(e){} });
    this.oscs = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch(e){}
      this.ctx = null;
    }
  }
}

const INDIAN_LANGUAGES = [
  { code: "Bengali", name: "Bengali (বাংলা / Benglish)", flag: "🇧🇩" },
  { code: "Hindi", name: "Hindi (हिंदी / Hinglish)", flag: "🇮🇳" },
  { code: "Telugu", name: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "Tamil", name: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "Marathi", name: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "Urdu", name: "Urdu (اردו)", flag: "🇮🇳" },
  { code: "Gujarati", name: "Gujarati (ગુજરાતી)", flag: "🇮🇳" },
  { code: "Kannada", name: "Kannada (ಕನ್ನಡ)", flag: "🇮🇳" },
  { code: "Malayalam", name: "Malayalam (മലയാളം)", flag: "🇮🇳" },
  { code: "Punjabi", name: "Punjabi (ਪੰਜਾਬী)", flag: "🇮🇳" }
];

const getLangSpeechCode = (langCode: string): string => {
  switch (langCode) {
    case "Hindi": return "hi-IN";
    case "Bengali": return "bn-IN";
    case "Telugu": return "te-IN";
    case "Tamil": return "ta-IN";
    case "Marathi": return "mr-IN";
    case "Urdu": return "ur-IN";
    case "Gujarati": return "gu-IN";
    case "Kannada": return "kn-IN";
    case "Malayalam": return "ml-IN";
    case "Punjabi": return "pa-IN";
    default: return "hi-IN";
  }
};

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function App() {
  const [appStage, setAppStage] = useState<string>(() => {
    return localStorage.getItem("vani_opening_completed") === "true" ? "app" : "opening";
  });
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loginOtpSent, setLoginOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  
  const [customGeminiKey, setCustomGeminiKey] = useState<string>(() => {
    return localStorage.getItem("vani_custom_gemini_api_key") || "";
  });

  // Screens: "onboarding", "home", "topics", "translate", "call", "chat"
  const [screen, setScreen] = useState<string>(() => {
    return localStorage.getItem("vani_onboarding_completed") === "true" ? "home" : "onboarding";
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [translatorOpen, setTranslatorOpen] = useState<boolean>(false);
  const [onboardingGoal, setOnboardingGoal] = useState<string>("interview");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(true);
  const [viewingTerms, setViewingTerms] = useState<boolean>(false);
  const [viewingPrivacy, setViewingPrivacy] = useState<boolean>(false);
  
  // Advanced States & VANI Engine Configurations
  const [userName, setUserName] = useState<string>("Learner");
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // Subscription tier root state variables
  const [userPlan, setUserPlan] = useState<string>(() => {
    return localStorage.getItem("userPlan") || localStorage.getItem("vani_user_plan") || "trial";
  });
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(() => {
    const saved = localStorage.getItem("vani_trial_days_left") || localStorage.getItem("trialDaysLeft");
    return saved ? parseInt(saved, 10) : 4;
  });
  const [trialStartDate, setTrialStartDate] = useState<number | null>(() => {
    const saved = localStorage.getItem("vani_trial_start_date") || localStorage.getItem("trialStartDate");
    return saved ? parseInt(saved, 10) : null;
  });
  const [trialExpired, setTrialExpired] = useState<boolean>(() => {
    return localStorage.getItem("vani_trial_expired") === "true" || localStorage.getItem("trialExpired") === "true";
  });
  const [sessionMsgCount, setSessionMsgCount] = useState<number>(0);

  // Subscription Gate System states
  const [gateMode, setGateMode] = useState<"splash" | "onboarding" | "trial_expired" | "plan_expired" | "none">("splash");
  const [onboardingPage, setOnboardingPage] = useState<number>(1);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{ key: string; price: string; name: string } | null>(null);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [payProcessing, setPayProcessing] = useState<boolean>(false);
  const [showPaySuccess, setShowPaySuccess] = useState<boolean>(false);
  const [trialSessionsCount, setTrialSessionsCount] = useState<number>(() => {
    const saved = localStorage.getItem("trialSessionsCount");
    return saved ? parseInt(saved, 10) : 4;
  });
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showAccessibility, setShowAccessibility] = useState<boolean>(false);

  // Vocab Lab states
  const [practicedPhrases, setPracticedPhrases] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vocab_practiced_phrases");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [activePracticePhrase, setActivePracticePhrase] = useState<VocabPhrase | null>(null);
  const [practiceInitialTab, setPracticeInitialTab] = useState<'grammar' | 'vocab' | 'regional' | 'vocab_lab'>('grammar');
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Professional Interactions");

  const markPhrasePracticed = (phraseId: string) => {
    setPracticedPhrases((prev) => {
      if (prev.includes(phraseId)) return prev;
      const next = [...prev, phraseId];
      localStorage.setItem("vocab_practiced_phrases", JSON.stringify(next));
      
      // confetti celebration
      try {
        confetti({
          particleCount: 85,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
      
      return next;
    });
  };

  // Simple similarity function (Levenshtein-based)
  function calculateSimilarity(a: string, b: string): number {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1.0;
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function evaluatePhrasePractice(
    userText: string,
    targetPhrase: string,
    phraseId: string
  ): string {
    const similarity = calculateSimilarity(
      userText.toLowerCase(),
      targetPhrase.toLowerCase().replace(/[.,!?]/g, "")
    );
    if (similarity >= 0.7) {
      markPhrasePracticed(phraseId);
      return getRandomPraise() + " Great pronunciation! " + "Want to try another phrase from " + "the Vocabulary Lab?";
    } else {
      return "Good try! Let's say it again — " + `"${targetPhrase}" ` + "Take your time and try once more!";
    }
  }

  function getRandomPraise(): string {
    const praises = [
      "Perfect!",
      "Excellent!",
      "Brilliant!",
      "Nail on the head!",
      "Splendid!",
      "Phenomenal!",
      "Amazing job!",
      "Unbelievable pronunciation!"
    ];
    return praises[Math.floor(Math.random() * praises.length)];
  }

  // overall progress update hooks
  const updateOverallProgress = () => {
    let total = 0;
    VOCAB_CATEGORIES.forEach(cat => {
      total += cat.phrases.length;
    });
    const done = practicedPhrases.length;
    const percent = Math.round((done / total) * 100);
    
    const pctElem = document.getElementById("vocab-overall-percent");
    const doneElem = document.getElementById("vocab-done-count");
    const totalElem = document.getElementById("vocab-total-count");
    
    if (pctElem) pctElem.textContent = percent + "%";
    if (doneElem) doneElem.textContent = done.toString();
    if (totalElem) totalElem.textContent = total.toString();
  };

  useEffect(() => {
    (window as any).updateOverallProgress = updateOverallProgress;
    updateOverallProgress();
  }, [practicedPhrases]);

  // Access gate functions
  function canAccess(topicIndex: number) {
    if (userPlan === "premium" || userPlan === "promaster" || userPlan === "pro" || userPlan === "monthly") return true;
    if (userPlan === "trial" && !trialExpired) return topicIndex < 12; // Unlocks first 12 topics (approx 30% of app features)
    return false;
  }

  function canUseTranslation() {
    return userPlan === "premium" ||
           userPlan === "promaster" ||
           userPlan === "pro" ||
           userPlan === "monthly";
  }

  function canUseVoiceStation() {
    return userPlan === "premium" ||
           userPlan === "promaster" ||
           userPlan === "pro" ||
           userPlan === "monthly";
  }

  function canSendMessage() {
    if (userPlan === "premium" ||
        userPlan === "promaster" ||
        userPlan === "monthly" ||
        userPlan === "pro") return true;
    if (userPlan === "trial" && !trialExpired)
      return sessionMsgCount < 5;
    return false;
  }

  useEffect(() => {
    if (appStage === "splash") {
      const t = setTimeout(() => {
        setAppStage("opening");
      }, 2805);
      return () => clearTimeout(t);
    }
  }, [appStage]);

  // Auto launch flow hook
  useEffect(() => {
    // Increment session count on launch if in trial mode
    if (localStorage.getItem("userPlan") === "trial") {
      const currentSessions = parseInt(localStorage.getItem("trialSessionsCount") || "4", 10);
      localStorage.setItem("trialSessionsCount", String(currentSessions + 1));
      setTrialSessionsCount(currentSessions + 1);
    }

    const timer = setTimeout(() => {
      const plan = localStorage.getItem("userPlan") || localStorage.getItem("vani_user_plan") || "none";
      const startDate = localStorage.getItem("trialStartDate") || localStorage.getItem("vani_trial_start_date");
      const expiry = localStorage.getItem("planExpiry") || localStorage.getItem("vani_plan_expiry");

      if (!plan || plan === "none") {
        setGateMode("none");
        return;
      }

      if (plan === "trial") {
        if (!startDate) {
          setGateMode("none");
          return;
        }
        const ms = Date.now() - parseInt(startDate, 10);
        const days = ms / (1000 * 60 * 60 * 24);

        if (days >= 4) {
          // If expired and NOT cancelled, automatically upgrade to Premium (₹249/mo)
          const cancelled = localStorage.getItem("vani_subscription_cancelled") === "true";
          if (cancelled) {
            localStorage.setItem("trialExpired", "true");
            localStorage.setItem("vani_trial_expired", "true");
            setTrialExpired(true);
            setGateMode("trial_expired");
          } else {
            // Auto renew upgrade to Premium!
            localStorage.setItem("userPlan", "premium");
            localStorage.setItem("vani_user_plan", "premium");
            setUserPlan("premium");
            setTrialExpired(false);
            setGateMode("none");

            // Set dynamic 30 days active premium period
            const expiryMills = Date.now() + (30 * 24 * 60 * 60 * 1000);
            localStorage.setItem("planExpiry", String(expiryMills));
            localStorage.setItem("vani_plan_expiry", String(expiryMills));

            setTimeout(() => {
              showToast("🚀 Trial Auto-Renewed!", "Your 4-day trial has automatically upgraded to the Premium Plan (₹249/month).", "success");
            }, 2000);
          }
        } else {
          const daysLeft = Math.ceil(4 - days);
          setUserPlan("trial");
          setTrialDaysLeft(daysLeft);
          setTrialExpired(false);
          setGateMode("none");
        }
        return;
      }

      if (plan === "monthly" || plan === "premium" || plan === "promaster" || plan === "pro") {
        if (!expiry) {
          setGateMode("none");
          return;
        }
        const now = Date.now();
        if (now > parseInt(expiry, 10)) {
          setGateMode("plan_expired");
        } else {
          setUserPlan(plan);
          setGateMode("none");
        }
        return;
      }

      setGateMode("none");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Auto synchronizations for persistent local storage & backward compatibility
  useEffect(() => {
    localStorage.setItem("userPlan", userPlan);
    localStorage.setItem("vani_user_plan", userPlan);
    setIsPremium(userPlan === "premium" || userPlan === "pro" || userPlan === "promaster");
    setActivePlan(userPlan === "promaster" ? "pro" : userPlan === "pro" ? "pro" : userPlan === "premium" ? "premium" : userPlan === "monthly" ? "basic" : "none" as any);
  }, [userPlan]);

  useEffect(() => {
    localStorage.setItem("vani_trial_days_left", String(trialDaysLeft));
  }, [trialDaysLeft]);

  useEffect(() => {
    if (trialStartDate !== null) {
      localStorage.setItem("vani_trial_start_date", String(trialStartDate));
    } else {
      localStorage.removeItem("vani_trial_start_date");
    }
  }, [trialStartDate]);

  useEffect(() => {
    localStorage.setItem("vani_trial_expired", String(trialExpired));
  }, [trialExpired]);

  // Trial expiry check on every app open & Web Speech API pre-load optimization
  useEffect(() => {
    if (trialStartDate && userPlan === "trial") {
      const ms = Date.now() - trialStartDate;
      const days = ms / (1000 * 60 * 60 * 24);
      if (days >= 4) {
        const cancelled = localStorage.getItem("vani_subscription_cancelled") === "true";
        if (cancelled) {
          setTrialExpired(true);
        } else {
          // Autos upgrade based on selected auto-renew plan option
          const selectedRenewPlan = localStorage.getItem("trialAutoRenewPlan") || "monthly";
          const targetPlan = selectedRenewPlan === "six_month" ? "pro" : "premium";
          const planName = selectedRenewPlan === "six_month" ? "6-Month Pass (₹199/month)" : "Premium Plan (₹249/month)";
          const periodDays = selectedRenewPlan === "six_month" ? 180 : 30;

          localStorage.setItem("userPlan", targetPlan);
          localStorage.setItem("vani_user_plan", targetPlan);
          setUserPlan(targetPlan);
          setTrialExpired(false);
          
          const expiryMills = Date.now() + (periodDays * 24 * 60 * 60 * 1000);
          localStorage.setItem("planExpiry", String(expiryMills));
          localStorage.setItem("vani_plan_expiry", String(expiryMills));

          setTimeout(() => {
            showToast("🚀 Trial Auto-Renewed!", `Your 4-day trial has automatically upgraded to the ${planName}.`, "success");
          }, 2050);
        }
      }
    }

    // Pre-trigger Web Speech API voice loading so speech generation is purely instantaneous
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      };
    }
  }, []);

  const [trialTimeLeft, setTrialTimeLeft] = useState<number>(345600); // 4 days in seconds
  const [streak, setStreak] = useState<number>(6);
  const [xp, setXp] = useState<number>(420);
  const [dailyGoalMins, setDailyGoalMins] = useState<number>(15);
  const [dailyGoalDone, setDailyGoalDone] = useState<number>(4);

  const [activeToast, setActiveToast] = useState<{ message: string; subMessage?: string; type: 'success' | 'info' | 'streak' } | null>(null);

  const showToast = (message: string, subMessage?: string, type: 'success' | 'info' | 'streak' = 'info') => {
    setActiveToast({ message, subMessage, type });
  };

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const celebrateStreak = (customType?: 'side-cannons' | 'burst') => {
    if (customType === 'side-cannons') {
      try {
        const end = Date.now() + 1200;
        const colors = ['#f43f5e', '#10b981', '#fbbf24', '#3b82f6', '#ec4899'];
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colors
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colors
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      } catch (e) {}
    } else {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.75 }
        });
      } catch (e) {}
    }
  };

  const handleProgressStreak = () => {
    const isAlreadyReached = dailyGoalDone >= dailyGoalMins;
    const newMins = Math.min(dailyGoalMins, dailyGoalDone + 1);
    setDailyGoalDone(newMins);
    setStreak(prev => prev + 1);
    setXp(prev => prev + 20);

    if (newMins >= dailyGoalMins && !isAlreadyReached) {
      celebrateStreak('side-cannons');
      showToast("🏆 Daily Practice Goal Reached!", "You completed 15 mins! Special +100 XP unlocked!", "success");
      setXp(prev => prev + 100);
      playTTS("Amazing work! You've successfully hit your daily learning goal. Keep up this magnificent streak!", 4099);
    } else {
      celebrateStreak('burst');
      showToast("🔥 Daily Streak Advanced!", `Active streak: ${streak + 1} Days • ${newMins}/${dailyGoalMins} mins done! (+20 XP)`, "streak");
    }
  };
  const [musicSelected, setMusicSelected] = useState<'lofi' | 'bengali' | 'celestial' | 'off'>('off');
  const [emotionalTone, setEmotionalTone] = useState<'warm' | 'energetic' | 'calm_bengali' | 'stern'>('warm');
  const [voiceUpgradeModalOpen, setVoiceUpgradeModalOpen] = useState<boolean>(false);

  const VOICE_PERSONALITIES = [
    {
      id: "kore",
      name: "Kore",
      title: "Default Friendly Coach",
      tone: "warm" as const,
      avatar: "👩‍🏫",
      description: "A gentle and supportive AI Coach. Speaks slow and clear, providing warm guidance.",
      gender: "Female",
      tempo: "Slow/Clear"
    },
    {
      id: "zephyr",
      name: "Zephyr",
      title: "Energetic Fluent Speaker",
      tone: "energetic" as const,
      avatar: "⚡",
      description: "Upbeat and lively. Challenges you with real-time conversations and fast-paced speech.",
      gender: "Male",
      tempo: "Fast/Lively"
    },
    {
      id: "charon",
      name: "Charon",
      title: "Calm Regional Tutor",
      tone: "calm_bengali" as const,
      avatar: "🧘",
      description: "Slow enunciating rhythms. Features extra patient guidance and Bengali phonetics hints.",
      gender: "Female",
      tempo: "Patient/Gentle"
    },
    {
      id: "fenrir",
      name: "Fenrir",
      title: "Strict/Direct Reviewer",
      tone: "stern" as const,
      avatar: "👨‍💼",
      description: "Highly structured and direct. Focuses strictly on correcting your grammar mistakes.",
      gender: "Male",
      tempo: "Analytical"
    },
    {
      id: "aurora",
      name: "Aurora (Future Voice)",
      title: "Acoustic Symphony",
      tone: "warm" as const,
      avatar: "✨",
      description: "Premium studio-grade cinematic resonance. Coming soon for Premium Plus plans.",
      gender: "Female",
      tempo: "Cinematic",
      isFuturePremium: true
    }
  ];

  const isVoicePersonalityUnlocked = () => {
    return userPlan === "premium" || userPlan === "pro" || userPlan === "promaster";
  };

  const playVoiceDemo = async (tone: 'warm' | 'energetic' | 'calm_bengali' | 'stern', text: string) => {
    setPlayingAudioIndex(-199);
    setTtsLoading(true);
    
    if (useInstantTurboVoice) {
      playSpeechSynthesisFallback(text);
      setTtsLoading(false);
      return;
    }
    
    try {
      const response = await apiFetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });
      if (!response.ok) throw new Error("Preview failed");
      const data = await response.json();
      if (data.audio && !data.fallback) {
        const audioBytes = atob(data.audio);
        const arrayBuffer = new ArrayBuffer(audioBytes.length);
        const textDecoder = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioBytes.length; i++) {
          textDecoder[i] = audioBytes.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => {
          setPlayingAudioIndex(null);
        };
        audio.play();
      } else {
        playSpeechSynthesisFallback(text);
      }
    } catch (err) {
      console.warn("Server preview failed, fallback to local:", err);
      playSpeechSynthesisFallback(text);
    } finally {
      setTtsLoading(false);
    }
  };
  const [continuousListening, setContinuousListening] = useState<boolean>(false);
  const [noiseCancellation, setNoiseCancellation] = useState<boolean>(true);
  const [interruptionDetection, setInterruptionDetection] = useState<boolean>(true);
  const [currentCaptionWords, setCurrentCaptionWords] = useState<string[]>([]);
  const [captionWordIndex, setCaptionWordIndex] = useState<number>(-1);
  const [isSpeechSynthPaused, setIsSpeechSynthPaused] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>("Synced"); // Syncing, Synced, Offline
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [accentScore, setAccentScore] = useState<number>(89);
  const [userMemories, setUserMemories] = useState<string[]>([
    "Your native regional language is Bengali.",
    "Goal: To sound confident during standard client calls.",
    "Common pitfall: Pluralizing uncountable nouns like 'feedbacks'."
  ]);
  const [newMemory, setNewMemory] = useState<string>("");
  const [activePlan, setActivePlan] = useState<'none' | 'basic' | 'premium' | 'pro'>('none');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(7); // ₹7 Trial checkout option
  const [otpPhone, setOtpPhone] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [syncGeneratedOtp, setSyncGeneratedOtp] = useState<string>("");
  const [onboardingGeneratedOtp, setOnboardingGeneratedOtp] = useState<string>("");
  const [isOtpLoggedIn, setIsOtpLoggedIn] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [billingOverlayOpen, setBillingOverlayOpen] = useState<boolean>(false);
  const [otpOverlayOpen, setOtpOverlayOpen] = useState<boolean>(false);
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false);
  const [activeBillingStep, setActiveBillingStep] = useState<'select' | 'vpa' | 'success'>('select');
  const [selectedStatusIndex, setSelectedStatusIndex] = useState<number>(0);
  const [selectedUPIApp, setSelectedUPIApp] = useState<string>("gpay");
  const [customVPA, setCustomVPA] = useState<string>("");
  const [paymentSuccessTriggered, setPaymentSuccessTriggered] = useState<boolean>(false);

  // Dynamic Razorpay properties for UPI gateway integration
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>(() => localStorage.getItem("vani_razorpay_key_id") || "");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState<string>(() => localStorage.getItem("vani_razorpay_key_secret") || "");

  // Custom Developer UPI Payment Flow States (9804102281@axl)
  const [customUpiModalOpen, setCustomUpiModalOpen] = useState<boolean>(false);
  const [customUpiAmount, setCustomUpiAmount] = useState<number>(0);
  const [customUpiPlanName, setCustomUpiPlanName] = useState<string>("");
  const [customUpiSuccessCallback, setCustomUpiSuccessCallback] = useState<() => void>(() => {});
  const [upiConfirmChecked, setUpiConfirmChecked] = useState<boolean>(false);
  const [customUpiCopied, setCustomUpiCopied] = useState<boolean>(false);
  const [userVpa, setUserVpa] = useState<string>("");
  const [simulatingPush, setSimulatingPush] = useState<boolean>(false);
  const [pushProgress, setPushProgress] = useState<number>(0);
  const [pushStage, setPushStage] = useState<string>("");

  const triggerRazorpayPayment = async (planKey: string, amount: number, planName: string, successCallback: () => void) => {
    // Directly launch developer's high-fidelity custom UPI direct payment flow
    setCustomUpiAmount(amount);
    setCustomUpiPlanName(planName);
    setCustomUpiSuccessCallback(() => successCallback);
    setUpiConfirmChecked(false);
    setCustomUpiCopied(false);
    setUserVpa("");
    setSimulatingPush(false);
    setPushProgress(0);
    setPushStage("");
    setCustomUpiModalOpen(true);
  };
  const [reportOverlayOpen, setReportOverlayOpen] = useState<boolean>(false);
  const [reportTab, setReportTab] = useState<'performance' | 'account'>('performance');
  const [voiceToastMessage, setVoiceToastMessage] = useState<string>("");

  // Account Deletion States
  const [deletionOverlayOpen, setDeletionOverlayOpen] = useState<boolean>(false);
  const [deletionReason, setDeletionReason] = useState<string>("");
  const [deletionStep, setDeletionStep] = useState<number>(1);
  const [deletionChecked, setDeletionChecked] = useState<boolean>(false);

  // Unsubscription and Cancellation States
  const [unsubscribeState, setUnsubscribeState] = useState<'none' | 'confirm' | 'success'>('none');

  // Dynamic profile states adhering to Google Play / Flutter structure
  const [profileUid, setProfileUid] = useState<string>("usr_fire_g89F3bXa4");
  const [profileName, setProfileName] = useState<string>("John Smith");
  const [profileEmail, setProfileEmail] = useState<string>("john@gmail.com");
  const [profilePhone, setProfilePhone] = useState<string>("+91 9876543210");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256");
  const [profileProvider, setProfileProvider] = useState<string>("google.com"); // google.com, password, phone
  const [profileEmailVerified, setProfileEmailVerified] = useState<boolean>(true);
  const [profilePhoneVerified, setProfilePhoneVerified] = useState<boolean>(true);
  const [profilePracticeMinutes, setProfilePracticeMinutes] = useState<number>(245);
  const [profileSessions, setProfileSessions] = useState<number>(48);
  const [profileStreak, setProfileStreak] = useState<number>(12);
  const [profileFluencyScore, setProfileFluencyScore] = useState<number>(89);
  
  // Custom states that allow updating the email/phone/password in real-time
  const [editingField, setEditingField] = useState<'name' | 'email' | 'phone' | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [accountToastMessage, setAccountToastMessage] = useState<string>("");
  
  // Custom switch for lightning-fast voice chat response (0ms delay local synthesis vs cloud AI model)
  const [useInstantTurboVoice, setUseInstantTurboVoice] = useState<boolean>(() => {
    return localStorage.getItem("vani_use_instant_voice") !== "false";
  });
  
  // Custom Step-by-Step Onboarding states
  const [onboardingSubStep, setOnboardingSubStep] = useState<string>("welcome"); // welcome, phone, otp, trial_offer, upi_payment, success
  const [trialAutoRenewPlan, setTrialAutoRenewPlan] = useState<'monthly' | 'six_month'>('monthly');
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [otpSentLabel, setOtpSentLabel] = useState<string>("");
  const [isPhoneLoggedIn, setIsPhoneLoggedIn] = useState<boolean>(false);
  const [homeActiveTheme, setHomeActiveTheme] = useState<string | null>(null);
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>("");

  // Sound Reactive UI waveform trigger states
  const [waveHeaving, setWaveHeaving] = useState<boolean>(false);

  // Sound recognition states for translator
  const translatorRecognitionRef = useRef<any>(null);
  const [isTranslatorListening, setIsTranslatorListening] = useState<boolean>(false);

  const startTranslatorVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isTranslatorListening) {
      if (translatorRecognitionRef.current) {
        try {
          translatorRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsTranslatorListening(false);
      return;
    }

    setIsTranslatorListening(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set target recognition language dynamically
    const langCode = getLangSpeechCode(selectedSourceLang);
    recognition.lang = langCode;

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranslatorInput(speechToText);
      setIsTranslatorListening(false);
      
      // Auto translate to English instantly
      setTimeout(() => {
        runQuickTranslate(speechToText);
      }, 300);
    };

    recognition.onerror = (event: any) => {
      console.error("Translator Speech Error:", event.error);
      setIsTranslatorListening(false);
    };

    recognition.onend = () => {
      setIsTranslatorListening(false);
    };

    translatorRecognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      setIsTranslatorListening(false);
    }
  };

  // References
  const musicRef = useRef<AmbientMusicManager | null>(null);
  const captionIntervalRef = useRef<any>(null);

  // Initialize and cleanup ambient music synthesizer
  useEffect(() => {
    musicRef.current = new AmbientMusicManager();
    return () => {
      musicRef.current?.cleanup();
      if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
    };
  }, []);

  // Live timer for trial active countdown (ticking seconds & milliseconds)
  const [tickerMs, setTickerMs] = useState<number>(99);
  useEffect(() => {
    const timer = setInterval(() => {
      setTrialTimeLeft((prev) => (prev > 0 ? prev - 1 : 604800));
    }, 1000);

    const msTimer = setInterval(() => {
      setTickerMs((prev) => (prev > 0 ? prev - 1 : 99));
    }, 85);

    return () => {
      clearInterval(timer);
      clearInterval(msTimer);
    };
  }, []);

  const selectMusicTrack = (track: 'lofi' | 'bengali' | 'celestial' | 'off') => {
    setMusicSelected(track);
    if (track === 'off') {
      musicRef.current?.cleanup();
      musicRef.current = null;
    } else {
      if (!musicRef.current) {
        musicRef.current = new AmbientMusicManager();
      }
      musicRef.current.init();
      musicRef.current.setTrackType(track);
    }
  };

  const duckMusic = (duck: boolean) => {
    if (musicRef.current) {
      // lower volume during speech, swell when finished
      musicRef.current.setVolume(duck ? 0.04 : 0.20);
    }
  };

  const startCaptionAnimation = (text: string) => {
    const words = text.replace(/[*#]/g, "").split(" ");
    setCurrentCaptionWords(words);
    setCaptionWordIndex(0);
    setWaveHeaving(true);
    duckMusic(true);

    if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
    
    let currentIdx = 0;
    // speaking cadence: ~230ms per word
    captionIntervalRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx < words.length) {
        setCaptionWordIndex(currentIdx);
      } else {
        clearInterval(captionIntervalRef.current);
        setCaptionWordIndex(-1);
        setCurrentCaptionWords([]);
        setWaveHeaving(false);
        duckMusic(false);
      }
    }, 240);
  };

  // App state
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [quickStudyActive, setQuickStudyActive] = useState<boolean>(false);
  
  // Chatting with VANI State
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [loadingReply, setLoadingReply] = useState<boolean>(false);
  const [userLevel, setUserLevel] = useState<string>("Intermediate");
  
  // Dynamic Selected Source Language
  const [selectedSourceLang, setSelectedSourceLang] = useState<string>("Bengali");

  // Live Translator Mini-App state
  const [translatorInput, setTranslatorInput] = useState<string>("");
  const [translatorResult, setTranslatorResult] = useState<TranslationResult | null>(null);
  const [translating, setTranslating] = useState<boolean>(false);

  // Voice Speech Recognition setup
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // TTS audio tracking for currently playing voices
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const [ttsLoading, setTtsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loadingReply]);

  // Handle Chrome & browser Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN"; // Target Indian speaking style

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setChatInput((prev) => (prev ? prev + " " + transcript : transcript));
        }
        setIsListening(false);
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition Error", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported or permitted in this browser version. Try typing your message instead!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition active already", err);
      }
    }
  };

  // Safe client-side playback of VANI's base64 audio stream
  const playTTS = async (text: string, index: number) => {
    setPlayingAudioIndex(index);
    setTtsLoading(true);
    setIsSpeechSynthPaused(false);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // start animated captions
    startCaptionAnimation(text);

    if (useInstantTurboVoice) {
      playSpeechSynthesisFallback(text);
      setTtsLoading(false);
      return;
    }

    const controller = new AbortController();
    const abortTimeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s timeout to guarantee instant speaking fallback if API is slow

    try {
      const response = await apiFetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone: emotionalTone }),
        signal: controller.signal,
      });
      clearTimeout(abortTimeoutId);

      if (!response.ok) throw new Error("TTS synthesize failed");
      const data = await response.json();

      if (data.audio && !data.fallback) {
        const audioBytes = atob(data.audio);
        const arrayBuffer = new ArrayBuffer(audioBytes.length);
        const bufferView = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioBytes.length; i++) {
          bufferView[i] = audioBytes.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        audio.onended = () => {
          setPlayingAudioIndex(null);
          setWaveHeaving(false);
          duckMusic(false);
        };
        audio.play();
      } else {
        playSpeechSynthesisFallback(text);
      }
    } catch (err) {
      console.warn("Server TTS failed or took too long, falling back to Web Speech API:", err);
      playSpeechSynthesisFallback(text);
    } finally {
      setTtsLoading(false);
    }
  };

  const playSpeechSynthesisFallback = (textToSpeak: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = textToSpeak.replace(/[*#]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      (window as any)._activeUtterance = utterance;
      utterance.lang = "en-IN";
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const idealVoice = voices.find(v => 
        (v.lang.toLowerCase().includes("in") && v.name.toLowerCase().includes("google")) || 
        v.lang.toLowerCase().includes("en-in") || 
        v.lang.toLowerCase().includes("hi-in") ||
        v.name.toLowerCase().includes("female") || 
        v.name.toLowerCase().includes("zira") || 
        v.name.toLowerCase().includes("veena")
      ) || voices.find(v => v.lang.toLowerCase().startsWith("en")) || voices[0];

      if (idealVoice) {
        utterance.voice = idealVoice;
      }

      utterance.onend = () => {
        setPlayingAudioIndex(null);
        setWaveHeaving(false);
        duckMusic(false);
      };
      utterance.onerror = () => {
        setPlayingAudioIndex(null);
        setWaveHeaving(false);
        duckMusic(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudioIndex(null);
      setWaveHeaving(false);
      duckMusic(false);
    }
  };

  const toggleSpeechPauseResume = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isSpeechSynthPaused) {
        window.speechSynthesis.resume();
        setIsSpeechSynthPaused(false);
        setWaveHeaving(true);
        duckMusic(true);
      } else {
        window.speechSynthesis.pause();
        setIsSpeechSynthPaused(true);
        setWaveHeaving(false);
        duckMusic(false);
      }
    }
  };

  const handleBillingSuccess = (planName: string) => {
    let planId: string = 'premium';
    if (planName === "Trial") {
      planId = 'trial';
      setTrialStartDate(Date.now());
      setTrialDaysLeft(7);
      setTrialExpired(false);
      setSessionMsgCount(0);
    } else if (planName === "Monthly" || planName === "Basic") {
      planId = 'monthly';
    } else if (planName === "Premium") {
      planId = 'premium';
    } else if (planName === "Pro" || planName === "Pro Master" || planName === "ProMaster" || planName.includes("6-Month")) {
      planId = 'promaster';
    }
    
    setUserPlan(planId);
    setIsPremium(planId === 'premium' || planId === 'pro');
    setActivePlan(planId as any);
    setActiveBillingStep('success');
    
    // Confetti celebration
    try {
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#a855f7", "#10b981", "#fbbf24"]
      });
    } catch(e){}

    const audioMsg = `Ami VANI! Congratulations, ${userName}! Your ${planId.toUpperCase()} tier fluency pass has been successfully registered on our UPI network. Let's speak English with natural confidence together every single day!`;
    setTimeout(() => {
      playTTS(audioMsg, 999);
    }, 600);
  };

  const handleOTPLoginSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone.trim()) return;
    setOtpLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSyncGeneratedOtp(code);
      setOtpSent(true);
      setOtpLoading(false);
      alert(`🔐 Firebase OTP Sent!\nAn OTP SMS was simulated for +91 ${otpPhone}.\nYour actual One-Time Passcode is: ${code}`);
    }, 900);
  };

  const verifyOTPCodeSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== syncGeneratedOtp) {
      alert("❌ Incorrect verification code. Please enter the passcode sent to your device.");
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoggedIn(true);
      setOtpLoading(false);
      setOtpOverlayOpen(false);
      setSyncStatus("Synced");
      alert(`🎉 OTP Verified successfully! Welcome back, ${userName}. Synced profile, memories, and XP logs securely via Firestore!`);
    }, 1000);
  };

  function needsTranslation(text: string): boolean {
    // 1. Non-Latin Unicode characters (such as Bengali, Devanagari, Tamil, Telugu, Kannada, etc.)
    if (/[\u0080-\uFFFF]/.test(text)) return true;

    // 2. Comprehensive Romanised Indian regional language vocabulary mappings (Hinglish, Benglish, etc.)
    const indianRegionalKeywords = [
      // Hindi / Hinglish pronouns, core verbs, particles, and common expressions
      "aap", "apna", "apne", "apka", "aapka", "hume", "humara", "mera", "mere", "meri", "mujhe", "tumhara", "tumhare", "tumhari",
      "kuch", "kya", "kyun", "kab", "kaise", "kaha", "kahan", "kidhar", "theek", "thik", "nahi", "acha", "achha", "bohut", "bahut", "kaam",
      "karna", "karo", "karega", "karenge", "bol", "bolo", "bolna", "suno", "sunna", "baat", "samajh", "gaya", "gaye", "chalo", "chala",
      "hai", "hain", "hua", "jaldi", "ab", "abhi", "aaj", "kal", "parso", "hoga", "hogi", "hogya", "dena", "aana", "jana", "unhe", "uske", "uski",
      "bhai", "yaar", "dost", "samajh", "sikhna", "namaste", "shukriya", "ji", "yar", "chalega", "bataye", "pucho", "sunao", "likha", "likhna",
      "chahiye", "wala", "raha", "rahi", "rahe", "gaadi", "gaddi", "pani", "paani", "khana", "dhanyavad", "dhanyavaad", "namaskar", "shubh", "suprabhat",
      
      // Bengali / Benglish
      "ami", "amar", "tumi", "tomar", "amader", "tomader", "kemon", "acho", "achho", "bhalo", "kothay", "kobe", "keno", "kivabe", "hobe",
      "korchi", "korbo", "koris", "dekho", "khao", "jao", "esho", "asho", "ashbe", "bondhu", "khub", "baje", "kotha", "bolchi", "sunchi",
      "khabar", "jol", "baba", "ma", "bhalobashi", "bolbo", "shikhbo", "shikhte", "tai", "ki", "na", "bari", "ghor", "ghar", "gari", "bolen",
      
      // Tamil / Tanglish
      "naan", "nee", "enna", "epdi", "sollu", "theriyum", "theriyaadu", "paaru", "vanakkam", "nalla", "irukka", "iruken", "yen", "eppo",
      "sapda", "saapda", "sapteya", "rumba", "romba", "illai", "enga", "inge", "ange", "idhu", "adhu", "vaanga", "ponga", "panrenga", "poda", "vanga",
      
      // Telugu / Teluglish
      "naku", "meeku", "emi", "ela", "enduku", "cheppandi", "avunu", "kaadu", "bagunnara", "tinnaara", "cheppu", "enti", "em", "raa", "po",
      "nenu", "chesta", "garu", "telusu", "teliyadu", "ekkada", "eppudu", "bhale", "manchi", "tinnara"
    ];

    const expr = new RegExp(`\\b(${indianRegionalKeywords.join("|")})\\b`, "i");
    return expr.test(text);
  }

  // Send situational message to Coach VANI via backend
  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || loadingReply) return;

    if (!canSendMessage()) {
      let limitMsg = "You've reached your subscription tier message limit. Upgrade to a Monthly or Premium plan to enjoy unlimited chats with Coach VANI!";
      if (userPlan === "trial") {
        if (trialExpired) {
          limitMsg = "Your 4-day VIP Access Trial has expired. Upgrade your plan to continue practicing English with Coach VANI!";
        } else {
          limitMsg = "You've reached your trial limit of 5 messages per session. Upgrade to Monthly or Premium for unlimited conversation!";
        }
      } else if (userPlan === "none") {
        limitMsg = "You don't have an active plan or trial. Upgrade now or start your ₹7 Trial to begin chatting!";
      }
      playTTS(limitMsg, 8479);
      alert(`⚠️ Subscription Limit Reached\n\n${limitMsg}`);
      setSelectedPlanPrice(7);
      setBillingOverlayOpen(true);
      return;
    }

    const userText = chatInput.trim();
    setChatInput("");
    setSessionMsgCount(prev => prev + 1);
    setLoadingReply(true);

    const isNative = needsTranslation(userText);

    const newUserMsg: Message = { 
      role: "user", 
      content: userText, 
      translationText: null,
      translationLoading: isNative 
    };
    const updatedMessages = [...chatMessages, newUserMsg];

    // INSTANTLY display user's typed chat bubble on the screen for zero-latency feel
    setChatMessages(updatedMessages);

    // 1. Asynchronously fetch the regional translation in the background if native language detected
    if (isNative) {
      if (!canUseTranslation()) {
        // Set to translation blocked text immediately
        setChatMessages(prev => {
          const updated = [...prev];
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].role === "user" && updated[i].translationLoading) {
              updated[i] = {
                ...updated[i],
                translationText: "🔒 Translation Blocked (Trial Tier). Upgrade to Premium (₹249/mo) or 6-Month Pass (₹1,196) to automatically translate your regional native thoughts to English. Unsubscribe anytime!",
                translationLoading: false
              };
              break;
            }
          }
          return updated;
        });
      } else {
        apiFetch("/api/quick-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: userText }]
          })
        })
          .then(res => {
            if (res.ok) return res.json();
            throw new Error("Translation status not ok");
          })
          .then(transData => {
            const translationText = transData?.content?.[0]?.text?.trim() || null;
            
            // Update the last user message with translationText - style triggers immediate change
            setChatMessages(prev => {
              const updated = [...prev];
              for (let i = updated.length - 1; i >= 0; i--) {
                if (updated[i].role === "user" && updated[i].translationLoading) {
                  updated[i] = {
                    ...updated[i],
                    translationText: translationText,
                    translationLoading: false
                  };
                  break;
                }
              }
              return updated;
            });
          })
          .catch(transErr => {
            console.warn("Translation request error:", transErr);
            // Reset loading status in case of error
            setChatMessages(prev => {
              const updated = [...prev];
              for (let i = updated.length - 1; i >= 0; i--) {
                if (updated[i].role === "user" && updated[i].translationLoading) {
                  updated[i] = {
                    ...updated[i],
                    translationLoading: false
                  };
                  break;
                }
              }
              return updated;
            });
          });
      }
    }

    // 2. Fetch the virtual coach reply from the server in parallel
    try {
      const response = await apiFetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          topicTitle: selectedTopic ? selectedTopic.title : "General Chat",
          userLevel
        }),
      });

      if (!response.ok) throw new Error("Bilingual coach route error");
      const data = await response.json();

      setChatMessages(prev => {
        // Ensure we preserve any async translation updates on the user's message!
        const withResponse = [...prev];
        withResponse.push({
          role: "assistant",
          content: data.reply,
          grammarFeedback: data.grammarCorrection,
          vocabBoost: data.vocabularyBoost,
          bilingualTip: data.bilingualTip
        });
        return withResponse;
      });

      // Automatically speak VANI's conversational response
      if (data.reply) {
        setTimeout(() => {
          playTTS(data.reply, updatedMessages.length);
        }, 300);
      }

    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Coach VANI is facing temporary static. Let's try saying that again!"
        }
      ]);
    } finally {
      setLoadingReply(false);
    }
  };

  // Clean regional language to English quick translator buddy
  const runQuickTranslate = async (textToTranslate?: string) => {
    const rawVal = textToTranslate !== undefined ? textToTranslate : translatorInput;
    if (!rawVal.trim()) return;
    setTranslating(true);
    setTranslatorResult(null);

    try {
      const response = await apiFetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: rawVal,
          sourceLanguage: selectedSourceLang
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setTranslatorResult(data);
    } catch (err) {
      console.error("Translation tool failed", err);
    } finally {
      setTranslating(false);
    }
  };

  const openConversationTopic = (topic: Topic, isQuickStudyMode = false) => {
    // If the topic is a premium or subscription-gated block, prompt upgrade
    if (topic.id > 0 && !canAccess(topic.id - 1)) {
      let suggestPrice = 99;
      if (topic.id > 28) {
        suggestPrice = 249;
      } else if (userPlan === "none") {
        suggestPrice = 7;
      }
      setSelectedPlanPrice(suggestPrice);
      
      let reason = "This scenario is locked.";
      if (userPlan === "none") {
        reason = "Upgrade now to a premium status or choose our 4-day VIP Trial for ₹7 to instantly unlock speaking modules!";
      } else if (userPlan === "trial" && trialExpired) {
        reason = "Your 4-day active trial has expired! Please select a subscription tier to continue your conversational training.";
      } else if (userPlan === "trial") {
        reason = "Only selected modules are open on the Trial plan. Upgrade to the Premium VIP plan to unlock all 40+ scenarios!";
      } else if (userPlan === "monthly") {
        reason = "This scenario requires upgrading to the Premium tier to unlock all 40+ dynamic scenarios!";
      }
      
      playTTS(reason, 234);
      alert(`🔒 Tier Restricted Module\n\n${reason}`);
      setBillingOverlayOpen(true);
      return;
    }

    if (topic.locked) {
      alert("This topic is locked! Complete active topics to advance.");
      return;
    }
    
    setSelectedTopic(topic);
    setQuickStudyActive(isQuickStudyMode);

    let initialMessage = `Namaste! I'm VANI, your English coach. Today we are exploring "${topic.title}" together. Don't worry about making mistakes! How do you feel about this topic? Tell me in a sentence.`;
    
    if (isQuickStudyMode) {
      const quickStudyGreetings: Record<number, string> = {
        1: "⚡ QUICK STUDY DRILL ⚡\n\nNamaste! Welcome to your rapid-fire practice for 'Introduce Yourself'. Let's perfect your elevator pitch. In one brief sentence, what is your current profession or field of study?",
        10: "⚡ QUICK STUDY DRILL ⚡\n\nNamaste! Welcome to your Job Interview focus session. Let's do a quick behavioural challenge. Why should a major educational or corporate brand hire you? Give a 2-sentence response!",
        19: "⚡ QUICK STUDY DRILL ⚡\n\nNamaste! Let's brush up your office coffee-break chat skills. A coworker asks: 'Any fun weekend plans, or just catching up on sleep?' How would you reply naturally in English?",
        31: "⚡ QUICK STUDY DRILL ⚡\n\nNamaste! You are meeting your tutor to get feedback on a recent test. You want to politely ask: 'Are there any extra practice resources I can work on?' How would you phrase this in your own words?"
      };
      
      initialMessage = quickStudyGreetings[topic.id] || `⚡ QUICK STUDY DRILL ⚡\n\nNamaste! Ready for an express learning sprint on "${topic.title}"? Let's kick-start your confidence with a rapid-fire question. Tell me, what is the most important vocabulary word you associate with this scenario?`;
    }

    setChatMessages([
      {
        role: "assistant",
        content: initialMessage
      }
    ]);
    setScreen("chat");
  };

  // Calculate user stats dynamically
  const completedCount = topics.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / topics.length) * 100);

  // Handle marking active topic done
  const markCurrentTopicAsDone = () => {
    if (selectedTopic) {
      setTopics((prev) => 
        prev.map((t) => t.id === selectedTopic.id ? { ...t, done: true } : t)
      );
      alert(`🎉 Congratulations! You have completed speaking practice for: "${selectedTopic.title}"`);
    }
  };

  // Mock Voice Call Dialing state
  const [callActive, setCallActive] = useState<boolean>(false);
  const [callText, setCallText] = useState<string>("Coach VANI is listening... Tap the button and start speaking in English. Speak about anything!");
  const [callMessages, setCallMessages] = useState<string[]>([]);
  const [callStatusText, setCallStatusText] = useState<string>("Ready to Call"); // "Ready", "Dialing...", "Connected"
  
  const [callMessagesList, setCallMessagesList] = useState<Message[]>([]);
  const [callUserSpokenText, setCallUserSpokenText] = useState<string>("");
  const [callGrammarCorrection, setCallGrammarCorrection] = useState<string>("");
  const [callVocabularyBoost, setCallVocabularyBoost] = useState<string>("");
  const [isCallListening, setIsCallListening] = useState<boolean>(false);
  const callRecognitionRef = useRef<any>(null);

  // Auto clean-up when navigating away from Call Screen
  useEffect(() => {
    if (screen !== "call" && callActive) {
      endVoiceCall();
    }
  }, [screen]);

  // Voice Call listening & orchestrator loop
  useEffect(() => {
    if (!callActive) {
      if (callRecognitionRef.current) {
        try {
          callRecognitionRef.current.stop();
        } catch (e) {}
        callRecognitionRef.current = null;
      }
      setIsCallListening(false);
      return;
    }

    // If VANI is currently speaking (playing audio), do NOT start speech recognition!
    if (waveHeaving || playingAudioIndex !== null) {
      if (callRecognitionRef.current) {
        try {
          callRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsCallListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setCallStatusText("Device Incompatible");
      return;
    }

    // Set a steady 1200ms timeout to delay the start of SpeechRecognition after VANI is quiet.
    // This allows browser audio pipelines to fully unload the speaker and load the microphone.
    const startDelayTimer = setTimeout(() => {
      if (!callActive || waveHeaving || playingAudioIndex !== null) return;
      if (!isCallListening) {
        const rec = new SpeechRecognition();
        rec.continuous = false; 
        rec.interimResults = false;
        rec.lang = "en-IN"; // Target speaking Style

        rec.onstart = () => {
          setIsCallListening(true);
          setCallStatusText("Listening...");
        };

        rec.onresult = async (e: any) => {
          const transcript = e.results[0][0].transcript;
          if (transcript && transcript.trim()) {
            setCallUserSpokenText(transcript);
            await handleCallSpeechSubmitted(transcript);
          }
        };

        rec.onerror = (err: any) => {
          console.log("Call Speech Recognition Error", err.error);
          setIsCallListening(false);
          if (err.error === "aborted" || err.error === "not-allowed" || err.error === "no-speech") {
            setCallStatusText("Tap Microphone to Speak");
          } else {
            setCallStatusText("Tap to Speak");
          }
        };

        rec.onend = () => {
          setIsCallListening(false);
        };

        callRecognitionRef.current = rec;
        try {
          rec.start();
        } catch (err) {
          console.warn("Call speech recognition start issue:", err);
        }
      }
    }, 1200);

    return () => {
      clearTimeout(startDelayTimer);
    };
  }, [callActive, waveHeaving, playingAudioIndex, isCallListening]);

  const handleCallSpeechSubmitted = async (userText: string) => {
    if (!userText || !userText.trim()) return;

    setCallStatusText("Thinking...");
    
    // Intercept with local Vocab Lab evaluation if in phrase practice mode
    if (activePracticePhrase) {
      const vaniReply = evaluatePhrasePractice(
        userText,
        activePracticePhrase.phrase,
        activePracticePhrase.id
      );

      const sim = calculateSimilarity(
        userText.toLowerCase(),
        activePracticePhrase.phrase.toLowerCase().replace(/[.,!?]/g, "")
      );
      const isCorrect = sim >= 0.7;

      const newUserMessage: Message = { role: "user", content: userText };
      const newVaniMessage: Message = {
        role: "assistant",
        content: vaniReply,
        grammarFeedback: isCorrect ? "Excellent Pronunciation!" : "Pronunciation Match: " + Math.round(sim * 100) + "%",
        vocabBoost: isCorrect ? "Mastered: " + activePracticePhrase.phrase : "Keep practicing: " + activePracticePhrase.phrase
      };

      setCallMessagesList((prev) => [...prev, newUserMessage, newVaniMessage]);
      setCallStatusText("Speaking...");

      if (isCorrect) {
        setActivePracticePhrase(null); // Clear item on successful attempt
      }

      await playTTS(vaniReply, 889);
      return;
    }

    const newUserMessage: Message = { role: "user", content: userText };
    const updatedMessages = [...callMessagesList, newUserMessage];
    setCallMessagesList(updatedMessages);

    try {
      const topicTitle = selectedTopic ? selectedTopic.title : "Voice Call General Practice";
      const response = await apiFetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          topicTitle: topicTitle,
          userLevel: "Intermediate"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach VANI voice processor");
      }

      const data = await response.json();
      
      const vaniReply = data.reply || "I didn't quite catch that. Could you say it again in simple English?";
      setCallGrammarCorrection(data.grammarCorrection || "");
      setCallVocabularyBoost(data.vocabularyBoost || "");

      const newVaniMessage: Message = { 
        role: "assistant", 
        content: vaniReply,
        grammarFeedback: data.grammarCorrection,
        vocabBoost: data.vocabularyBoost,
        bilingualTip: data.bilingualTip
      };
      
      setCallMessagesList((prev) => [...prev, newVaniMessage]);
      setCallStatusText("Speaking...");

      await playTTS(vaniReply, 889);

    } catch (err: any) {
      console.error("Error communicating with VANI AI:", err);
      setCallStatusText("Connection Error");
      const fallbackReply = "Sorry, I had a brief connection issue. Can you repeat that?";
      await playTTS(fallbackReply, 889);
    }
  };

  const toggleVoiceCallListening = () => {
    // Stop speaking if VANI is currently speaking
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAudioIndex(null);
    setWaveHeaving(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported or permitted in this browser version. Try using the dynamic text input backup below!");
      return;
    }

    if (isCallListening) {
      if (callRecognitionRef.current) {
        try {
          callRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsCallListening(false);
      setCallStatusText("Tap to Speak");
    } else {
      setCallStatusText("Listening...");
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setIsCallListening(true);
        setCallStatusText("Listening...");
      };

      rec.onresult = async (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          setCallUserSpokenText(transcript);
          await handleCallSpeechSubmitted(transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Manual Call Speech Recognition Error", err.error);
        setIsCallListening(false);
        setCallStatusText("Tap to Speak");
      };

      rec.onend = () => {
        setIsCallListening(false);
      };

      callRecognitionRef.current = rec;
      try {
        rec.start();
      } catch (err) {
        console.warn("Manual Call speech recognition start issue:", err);
      }
    }
  };

  const startVoiceCall = (customIntroText?: string) => {
    if (!canUseVoiceStation()) {
      let limitMsg = "VANI Voice calling practice is blocked under your current subscription tier. Upgrade to Monthly Basic or Premium plan for full voice calling access!";
      if (userPlan === "trial") {
        limitMsg = "Speaking on the dynamic Voice Dialer station is blocked during the active Trial tier. Upgrade to a Monthly or Premium plan to call Coach VANI!";
      } else if (userPlan === "none") {
        limitMsg = "You don't have an active plan or trial. Upgrade to Monthly or Premium to speak live with Coach VANI!";
      }
      playTTS(limitMsg, 811);
      alert(`🔒 Voice Connection Blocked\n\n${limitMsg}`);
      setSelectedPlanPrice(99);
      setBillingOverlayOpen(true);
      return false;
    }

    setCallActive(true);
    setCallStatusText("Connecting...");
    setCallUserSpokenText("");
    setCallGrammarCorrection("");
    setCallVocabularyBoost("");
    
    if (callRecognitionRef.current) {
      try {
        callRecognitionRef.current.stop();
      } catch (e) {}
    }

    const greetingText = customIntroText || `Namaste! I am VANI, your AI English Coach. Welcome to the Voice Personality Station! Speak to me freely in English, and I will rectify any grammar or vocabulary mistakes you make. What shall we talk about today?`;
    
    const initialMsg: Message = {
      role: "assistant",
      content: greetingText
    };
    setCallMessagesList([initialMsg]);

    setTimeout(() => {
      setCallStatusText("Speaking...");
      playTTS(greetingText, 888);
    }, 700);

    return true;
  };

  const endVoiceCall = () => {
    setCallActive(false);
    setCallStatusText("Call Disconnected");
    setIsCallListening(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (callRecognitionRef.current) {
      try {
        callRecognitionRef.current.stop();
      } catch (e) {}
    }
    if (activePracticePhrase) {
      setPracticeInitialTab("vocab_lab");
      setScreen("practice");
      setActivePracticePhrase(null);
    }
  };

  const startPhrasePractice = (phrase: VocabPhrase) => {
    setActivePracticePhrase(phrase);
    setScreen("call");
    
    // Reset call screen statistics
    setCallUserSpokenText("");
    setCallGrammarCorrection("");
    setCallVocabularyBoost("");
    
    const introText = `Let's practice the vocabulary phrase: "${phrase.phrase}". Here is a helpful pronunciation tip: ${phrase.tip} Now you say it — go ahead!`;
    
    const success = startVoiceCall(introText);
    if (!success) {
      setActivePracticePhrase(null);
    }
  };

  const filteredHomeTopics = topics.filter((t) => {
    const matchesTheme = !homeActiveTheme || t.theme === homeActiveTheme;
    const matchesSearch = !homeSearchQuery.trim() || 
      t.title.toLowerCase().includes(homeSearchQuery.toLowerCase()) || 
      t.theme.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
      t.cat.toLowerCase().includes(homeSearchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

   // Subscription Action Handlers
  const handleStartTrial = () => {
    setSelectedPlanDetails({
      key: "trial",
      price: "₹7.00 for 4 days",
      name: "4-Day Trial"
    });
    setShowPayModal(true);
  };

  const handleSubscribePlan = (plan: string) => {
    const details: Record<string, { price: string; name: string }> = {
      monthly  : { 
        price: "₹99.00 / month", 
        name : "Easy English — Basic Monthly" 
      },
      premium  : { 
        price: "₹249.00 / month", 
        name : "Easy English — Premium Monthly Plan" 
      },
      promaster: { 
        price: "₹1,196.00 / 6 Months", 
        name : "Easy English — 6-Month Subscription Discount (₹199/month)" 
      }
    };
    
    setSelectedPlanDetails({
      key: plan,
      price: details[plan].price,
      name: details[plan].name
    });
    setShowPayModal(true);
  };

  const confirmPaymentSimulation = () => {
    if (!selectedPlanDetails) return;
    const plan = selectedPlanDetails.key;
    const planPrices: Record<string, number> = {
      trial: 7,
      monthly: 99,
      premium: 249,
      promaster: 1196
    };
    const amount = planPrices[plan] || 99;

    setPayProcessing(true);
    triggerRazorpayPayment(plan, amount, selectedPlanDetails.name, () => {
      localStorage.setItem("userPlan", plan);
      localStorage.setItem("vani_user_plan", plan);
      setUserPlan(plan);
      
      if (plan === "trial") {
        const now = Date.now();
        localStorage.setItem("trialStartDate", String(now));
        localStorage.setItem("vani_trial_start_date", String(now));
        localStorage.setItem("trialExpired", "false");
        localStorage.setItem("vani_trial_expired", "false");
        setTrialStartDate(now);
        setTrialDaysLeft(4);
        setTrialExpired(false);
      } else {
        const expiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
        localStorage.setItem("planExpiry", String(expiry));
        localStorage.setItem("vani_plan_expiry", String(expiry));
      }
      
      setPayProcessing(false);
      setShowPayModal(false);
      setShowPaySuccess(true);
      
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn("Confetti call bypassed:", e);
      }
    });

    // Fallback reset safeguard in case Razorpay is dismissed/blocked
    setTimeout(() => {
      setPayProcessing(false);
    }, 10000); // 10-second automatic unlock fallback
  };

  const enterAppAfterPayment = () => {
    setShowPaySuccess(false);
    setGateMode("none");
    setBillingOverlayOpen(false);
  };

  // Rendering methods for Subscription Gating Screens
  const renderSplashScreen = () => {
    return (
      <div id="splash-screen" style={{
        position        : "absolute",
        top             : 0, left: 0,
        width           : "100%", height: "100%",
        background      : "#0D0D0D",
        display         : "flex",
        flexDirection   : "column",
        alignItems     : "center",
        justifyContent : "center",
        zIndex         : 9999,
      }}>
        {/* Animated logo */}
        <div id="splash-logo" style={{
          width           : "96px",
          height          : "96px",
          borderRadius   : "50%",
          background      : "linear-gradient(135deg, #FF6B2B, #FF8C55)",
          display         : "flex",
          alignItems     : "center",
          justifyContent : "center",
          fontSize       : "44px",
          marginBottom   : "24px",
          animation       : "splashPulse 1s ease-in-out infinite alternate",
          boxShadow      : "0 0 40px rgba(255,107,43,0.5)",
        }}>🎙️</div>

        {/* App name */}
        <h1 style={{
          fontFamily   : "'Cormorant Garamond', serif",
          fontSize     : "36px",
          color         : "#FF8C4A",
          margin        : "0 0 8px 0",
          letterSpacing: "2px",
        }}>Easy English</h1>

        {/* Tagline */}
        <p style={{
          fontFamily   : "Poppins, sans-serif",
          fontSize     : "13px",
          color         : "#767676",
          margin        : "0 0 40px 0",
        }}>Powered by VANI AI</p>

        {/* Loading bar */}
        <div style={{
          width           : "160px",
          height          : "3px",
          background      : "#1A1A1A",
          borderRadius   : "4px",
          overflow        : "hidden",
        }}>
          <div id="splash-bar" style={{
            height          : "3px",
            background      : "#FF6B2B",
            width           : "0%",
            borderRadius   : "4px",
            animation       : "loadBar 1.4s ease forwards",
          }}></div>
        </div>

        <style>{`
          @keyframes splashPulse {
            from { transform: scale(1); }
            to   { transform: scale(1.08); }
          }
          @keyframes loadBar {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>
    );
  };

  const renderOnboardingScreen = () => {
    return (
      <div className="absolute inset-0 bg-[#0D0D0D] z-[9990] flex flex-col justify-between p-6 overflow-y-auto text-white select-none" style={{ fontFamily: "Poppins, sans-serif" }}>
        
        {onboardingPage === 1 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C55] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_40px_rgba(255,107,43,0.4)]">
              🎙️
            </div>
            
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: "#FF8C4A" }} className="font-bold tracking-wide">
              Meet VANI
            </h2>
            
            <p className="text-[15px] font-medium text-white mt-1">
              Your Personal AI Spoken English Coach
            </p>
            
            <p className="text-[13px] text-[#767676] max-w-xs mt-3 leading-relaxed">
              Speak better English in just 15 minutes a day — guaranteed.
            </p>
            
            <div className="w-full max-w-xs mt-8 space-y-4 text-left">
              <div className="feature-row">
                <span>✅</span> <span>Voice-first learning — just speak</span>
              </div>
              <div className="feature-row">
                <span>✅</span> <span>Real-time corrections by VANI</span>
              </div>
              <div className="feature-row">
                <span>✅</span> <span>50 topics from basics to professional</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-10">
              <span className="text-[#FF6B2B] text-lg leading-none">●</span>
              <span className="text-stone-605 text-stone-600 text-lg leading-none">○</span>
              <span className="text-stone-605 text-stone-600 text-lg leading-none">○</span>
            </div>
            
            <button 
              onClick={() => setOnboardingPage(2)}
              className="w-full mt-8 py-4 bg-gradient-to-r from-[#FF6B2B] to-[#FF8C55] rounded-xl text-white font-bold text-center transition hover:opacity-90 active:scale-98 shadow-[0_4px_20px_rgba(255,107,43,0.3)]"
            >
              Next →
            </button>
          </div>
        )}

        {onboardingPage === 2 && (
          <div className="flex-1 flex flex-col justify-center py-6">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: "#FF8C4A" }} className="font-bold text-center mb-6">
              How VANI Works
            </h2>
            
            <div className="space-y-4 max-w-md w-full mx-auto">
              <div className="bg-[#1A1A1A] border border-stone-800 rounded-2xl p-5 flex items-start gap-4">
                <span className="text-3xl">🎙️</span>
                <div>
                  <h4 className="font-bold text-white text-base">Speak</h4>
                  <p className="text-xs text-stone-400 mt-1">Tap the mic and talk in English</p>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] border border-stone-800 rounded-2xl p-5 flex items-start gap-4">
                <span className="text-3xl">👂</span>
                <div>
                  <h4 className="font-bold text-white text-base">VANI Listens</h4>
                  <p className="text-xs text-stone-400 mt-1">VANI hears your voice and understands</p>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] border border-stone-800 rounded-2xl p-5 flex items-start gap-4">
                <span className="text-3xl">✅</span>
                <div>
                  <h4 className="font-bold text-white text-base">VANI Corrects</h4>
                  <p className="text-xs text-stone-400 mt-1">Get instant feedback and improve fast</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-8">
              <span className="text-stone-605 text-stone-600 text-lg leading-none">○</span>
              <span className="text-[#FF6B2B] text-lg leading-none">●</span>
              <span className="text-stone-605 text-stone-600 text-lg leading-none">○</span>
            </div>
            
            <div className="flex gap-4 w-full mt-8">
              <button 
                onClick={() => setOnboardingPage(1)}
                className="flex-1 py-4 bg-[#1A1A1A] border border-stone-800 hover:bg-[#252525] rounded-xl text-stone-300 font-bold text-center transition active:scale-98"
              >
                ← Back
              </button>
              <button 
                onClick={() => setOnboardingPage(3)}
                className="flex-1 py-4 bg-gradient-to-r from-[#FF6B2B] to-[#FF8C55] rounded-xl text-white font-bold text-center transition hover:opacity-90 active:scale-98 shadow-[0_4px_20px_rgba(255,107,43,0.3)]"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {onboardingPage === 3 && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-2">
            {renderPlanSelectionMarkup({ hideTrialCard: false, onBack: () => setOnboardingPage(2) })}
          </div>
        )}
      </div>
    );
  };

  const renderPlanSelectionMarkup = ({ hideTrialCard = false, onBack = null }: { hideTrialCard?: boolean; onBack?: (() => void) | null }) => {
    return (
      <div id="plan-selection-screen" className="flex-1 flex flex-col bg-[#0D0D0D] text-white">
        {/* HEADER */}
        <div style={{ padding: "24px 20px 8px", textAlign: "center" }} className="relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute left-1 top-2 p-2 text-stone-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div style={{
            fontSize     : "11px",
            letterSpacing: "3px",
            color         : "#FF8C4A",
            textTransform: "uppercase",
            marginBottom : "8px",
          }}>START YOUR JOURNEY</div>

          <h1 style={{
            fontFamily   : "'Cormorant Garamond', serif",
            fontSize     : "30px",
            color         : "#FFFFFF",
            margin        : "0 0 8px 0",
          }}>Choose Your Plan</h1>

          <p style={{
            fontSize     : "13px",
            color         : "#767676",
            margin        : "0 0 24px 0",
          }}>Unlock VANI and start speaking better English today</p>
        </div>

        {/* PLAN LISTING */}
        <div className="space-y-4 px-1 pb-10 overflow-y-auto no-scrollbar">
          
          {/* Card 1: 4-Day Trial */}
          {!hideTrialCard && (
            <div 
              className="plan-card" 
              id="card-trial"
              onClick={() => handleStartTrial()}
              style={{
                margin          : "0 16px 16px",
                background      : "#141414",
                border          : "2px solid #FF6B2B",
                borderRadius   : "24px",
                padding         : "22px",
                cursor          : "pointer",
                position        : "relative"
              }}
            >
              <div style={{
                position        : "absolute",
                top             : "-12px",
                left            : "50%",
                transform       : "translateX(-50%)",
                background      : "#FF6B2B",
                color           : "white",
                fontSize       : "9px",
                fontWeight     : "900",
                padding         : "4px 16px",
                borderRadius   : "20px",
                whiteSpace     : "nowrap",
                letterSpacing  : "1px",
              }}>RECOMMENDED START — BEST VALUE</div>

              <div style={{
                display         : "flex",
                justifyContent : "space-between",
                alignItems     : "flex-start",
                marginTop      : "8px",
                marginBottom   : "16px",
              }}>
                <div>
                  <div style={{
                    fontSize     : "20px",
                    fontWeight   : "900",
                    color         : "#FFFFFF",
                  }}>4-Day Trial</div>
                  <div style={{
                    fontSize     : "11px",
                    color         : "#767676",
                    marginTop    : "2px",
                  }}>Try full trial before renewal</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize     : "36px",
                    fontWeight   : "900",
                    color         : "#FF8C4A",
                    lineHeight   : "1",
                  }}>₹7</div>
                  <div style={{
                    fontSize     : "11px",
                    color         : "#767676",
                  }}>for 4 days</div>
                </div>
              </div>

              <div style={{
                display         : "flex",
                flexDirection  : "column",
                gap             : "8px",
                marginBottom   : "16px",
              }}>
                <div className="feature-row" style={{ fontSize: "12px", color: "#FFF" }}>✅ <strong>30% Scenarios Open:</strong> Explore the first 12 conversational topics!</div>
                <div className="feature-row" style={{ fontSize: "12px", color: "#FFF" }}>🔒 <strong>Translation Blocked:</strong> Express translation and Language Bridge are locked in Trial.</div>
                <div className="feature-row" style={{ fontSize: "12px", color: "#FFF" }}>🔒 <strong>Speak with VANI Blocked:</strong> Live Voice calling station is locked in Trial.</div>
                <div className="feature-row" style={{ fontSize: "12px", color: "#A0A0A0" }}>✅ Basic Pronunciation feedback during scenarios</div>
                <div className="feature-row text-orange-400" style={{ fontSize: "12px" }}>💡 Auto-renews to your selected subscription plan on the 4th day unless cancelled.</div>
                <div className="feature-row text-amber-300" style={{ fontSize: "11px" }}>💳 Auto-renew charges are transferred securely via automated UPI routing.</div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); handleStartTrial(); }}
                style={{
                  width           : "100%",
                  height          : "52px",
                  background      : "linear-gradient(135deg,#FF6B2B,#FF8C55)",
                  border          : "none",
                  borderRadius   : "14px",
                  color           : "white",
                  fontSize       : "16px",
                  fontWeight     : "bold",
                  cursor          : "pointer",
                  fontFamily     : "Poppins, sans-serif",
                  boxShadow      : "0 4px 20px rgba(255,107,43,0.4)",
                }}
              >
                Start 4-Day Trial — ₹7 Only
              </button>

              <div style={{
                textAlign    : "center",
                fontSize     : "10.5px",
                color         : "#B0B0B0",
                marginTop    : "10px",
                lineHeight   : "1.4",
                fontWeight   : "600",
              }}>
                <strong>Trial Policy:</strong> Access 30% of scenarios. Voice calling & translation features are blocked. After completing 4 days, the auto-renew subscription charge is automatically deducted and transferred securely via our UPI billing network. <strong>Unsubscribe & cancel anytime!</strong>
              </div>
            </div>
          )}

          {/* Card 2: Premium */}
          <div 
            className="plan-card" 
            id="card-premium"
            onClick={() => handleSubscribePlan("premium")}
            style={{
              margin          : "0 16px 16px",
              background      : "linear-gradient(180deg,#1E1208,#1A1A1A)",
              border          : "2px solid #FF8C4A",
              borderRadius   : "24px",
              padding         : "22px",
              cursor          : "pointer",
              position        : "relative",
              boxShadow      : "0 8px 32px rgba(255,140,74,0.2)",
            }}
          >
            <div style={{
              position        : "absolute",
              top             : "-12px",
              left            : "50%",
              transform       : "translateX(-50%)",
              background      : "linear-gradient(90deg,#FF6B2B,#FF8C55)",
              color           : "white",
              fontSize       : "9px",
              fontWeight     : "900",
              padding         : "4px 20px",
              borderRadius   : "20px",
              whiteSpace     : "nowrap",
              letterSpacing  : "1px",
            }}>👑 MOST POPULAR — HIGHEST VALUE</div>

            <div style={{
              display         : "flex",
              justifyContent : "space-between",
              alignItems     : "flex-start",
              marginTop      : "8px",
              marginBottom   : "16px",
            }}>
              <div>
                <div style={{
                  fontSize     : "20px",
                  fontWeight   : "900",
                  color         : "#FFFFFF",
                }}>Premium Plan</div>
                <div style={{
                  fontSize     : "11px",
                  color         : "#FF8C4A",
                  marginTop    : "2px",
                  fontWeight   : "700",
                }}>🚀 Unlock Full Premium Access</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize     : "36px",
                  fontWeight   : "900",
                  color         : "#FF8C4A",
                  lineHeight   : "1",
                }}>₹249</div>
                <div style={{
                  fontSize     : "11px",
                  color         : "#767676",
                }}>per month</div>
              </div>
            </div>

            <div style={{
              display         : "flex",
              flexDirection  : "column",
              gap             : "11px",
              marginBottom   : "18px",
              textAlign       : "left"
            }}>
              <div style={{ fontSize: "12.5px" }} className="feature-row text-[#FFF]">🗣️ <strong>100% Unlocked Scenarios:</strong> Access all 40+ real-life interactive speaking scenarios with no limit!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row text-[#FFF]">🔤 <strong>Unlocked Translation Portion:</strong> Full access to the Express Translator & the regional Language Bridge!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row text-[#FFF]">🎙️ <strong>Unlocked Speak with VANI:</strong> Call Coach VANI live on the AI Voice Station with advanced speech analysis!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row text-[#FFF]">✨ <strong>Live Coaching & Grammar:</strong> Get immediate grammar correction, pronunciation help, and smart vocabulary suggestions!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row text-[#FFF]">💳 <strong>Secure Processing:</strong> Charged to your selected method, routed securely from your account to developer bank account.</div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleSubscribePlan("premium"); }}
              style={{
                width           : "100%",
                height          : "52px",
                background      : "linear-gradient(135deg,#FF6B2B,#FF8C55)",
                border          : "none",
                borderRadius   : "16px",
                color           : "white",
                fontSize       : "16px",
                fontWeight     : "900",
                cursor          : "pointer",
                fontFamily     : "Poppins, sans-serif",
                boxShadow      : "0 4px 24px rgba(255,107,43,0.5)",
              }}
            >
              Get Premium Access — ₹249/mo
            </button>

            <div style={{
              textAlign    : "center",
              fontSize     : "11.5px",
              color         : "#E0E0E0",
              marginTop    : "10px",
              fontWeight   : "700"
            }}>💡 Cancel & Unsubscribe Anytime from your Account page!</div>
          </div>

          {/* Card 3: 6-Month Subscription Discount */}
          <div 
            className="plan-card" 
            id="card-promaster"
            onClick={() => handleSubscribePlan("promaster")}
            style={{
              margin          : "0 16px 16px",
              background      : "linear-gradient(180deg,#0D0820,#1A1A1A)",
              border          : "2px solid #7C3AED",
              borderRadius   : "24px",
              padding         : "22px",
              cursor          : "pointer",
              position        : "relative"
            }}
          >
            <div style={{
              position        : "absolute",
              top             : "-12px",
              left            : "50%",
              transform       : "translateX(-50%)",
              background      : "linear-gradient(90deg,#7C3AED,#FF6B2B)",
              color           : "white",
              fontSize       : "9px",
              fontWeight     : "900",
              padding         : "4px 20px",
              borderRadius   : "20px",
              whiteSpace     : "nowrap",
              letterSpacing  : "1px",
            }}>🔥 6-MONTH DISCOUNT PASS — SAVE 20%</div>

            <div style={{
              display         : "flex",
              justifyContent : "space-between",
              alignItems     : "flex-start",
              marginTop      : "8px",
              marginBottom   : "16px",
            }}>
              <div>
                <div style={{
                  fontSize     : "20px",
                  fontWeight   : "900",
                  color         : "#FFFFFF",
                }}>6-Month Subscription</div>
                <div style={{
                  fontSize     : "11px",
                  color         : "#A78BFA",
                  marginTop    : "2px",
                  fontWeight   : "700"
                }}>Discounted flat-rate fluency pass</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize     : "28px",
                  fontWeight   : "900",
                  color         : "#A78BFA",
                  lineHeight   : "1",
                }}>₹199<span style={{ fontSize: "14px", fontWeight: "600" }}>/mo</span></div>
                <div style={{
                  fontSize     : "11px",
                  color         : "#888",
                  fontWeight   : "700",
                  marginTop    : "4px"
                }}>Total: ₹1,196</div>
              </div>
            </div>

            <div style={{
              display         : "flex",
              flexDirection  : "column",
              gap             : "8px",
              marginBottom   : "16px",
              textAlign       : "left"
            }}>
              <div style={{ fontSize: "12.5px" }} className="feature-row purple text-[#C4B5FD]">🗣️ <strong>100% Unlocked Scenarios:</strong> Access all 40+ interactive speaking scenarios instantly!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row purple text-[#C4B5FD]">🔤 <strong>Unlocked Translation Portion:</strong> Language Bridge & Express translation unlocked!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row purple text-[#C4B5FD]">🎙️ <strong>Unlocked Speak with VANI:</strong> Dynamic real-time Voice calling & Coaching station!</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row purple text-[#C4B5FD]">🔥 <strong>Best Value Discount:</strong> Pre-paid 6-Month fluency pass at ₹199/month (total ₹1,196 pre-paid).</div>
              <div style={{ fontSize: "12.5px" }} className="feature-row purple text-[#C4B5FD]">💳 <strong>Direct Secure Route:</strong> Flat deduction from user account to developer bank account.</div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleSubscribePlan("promaster"); }}
              style={{
                width           : "100%",
                height          : "52px",
                background      : "linear-gradient(135deg,#7C3AED,#FF6B2B)",
                border          : "none",
                borderRadius   : "16px",
                color           : "white",
                fontSize       : "16px",
                fontWeight     : "900",
                cursor          : "pointer",
                fontFamily     : "Poppins, sans-serif",
                boxShadow      : "0 4px 24px rgba(124,58,237,0.4)",
              }}
            >
              Get 6-Month Discount Plan — ₹1,196
            </button>

            <div style={{
              textAlign    : "center",
              fontSize     : "11.5px",
              color         : "#C4B5FD",
              marginTop    : "10px",
              fontWeight   : "700"
            }}>💡 Cancel & Unsubscribe Anytime! Unsubscribe option always available.</div>
          </div>

          {/* LEGAL FOOTER */}
          <div style={{
            padding       : "16px 20px 32px",
            textAlign      : "center",
            fontSize       : "11px",
            color         : "#555",
            lineHeight     : "1.6",
            fontFamily     : "Poppins, sans-serif",
          }}>
            Payments processed via Google Play Billing. Subscriptions auto-renew unless cancelled 24 hours before renewal date. Managed through your Google Play account.
            <br /><br />
            <span style={{ color: "#FF8C4A", textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowTerms(true)}>Terms of Service</span>
            &nbsp;·&nbsp;
            <span style={{ color: "#FF8C4A", textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowPrivacy(true)}>Privacy Policy</span>
            &nbsp;·&nbsp;
            <span style={{ color: "#FF8C4A", textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowAccessibility(true)}>Accessibility</span>
          </div>

        </div>
      </div>
    );
  };

  const renderTrialExpiredScreen = () => {
    return (
      <div id="trial-expired-screen" className="absolute inset-0 bg-[#0D0D0D] z-[9990] flex flex-col p-4 overflow-y-auto text-white select-none" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div style={{ padding: "40px 20px 20px", textAlign: "center" }}>
          
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>⏰</div>

          <h1 style={{ fontSize: "26px", color: "#FF8C4A", margin: "0 0 8px 0" }} className="font-bold">
            Your Trial Has Ended
          </h1>

          <p style={{ fontSize: "14px", color: "#767676", margin: "0 0 8px 0", lineHeight: "1.6" }}>
            Your 4-day trial is complete.
          </p>

          <div style={{
            background      : "#1A1A1A",
            border          : "1px solid #2A2A2A",
            borderRadius   : "16px",
            padding         : "16px",
            margin          : "20px 0",
            textAlign      : "left"
          }}>
            <div style={{ fontSize: "13px", color: "#FF8C4A", fontWeight: "bold", marginBottom: "12px" }}>
              📊 Your Progress So Far
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#B0B0B0", fontSize: "13px" }}>Topics completed</span>
              <span style={{ color: "#FF8C4A", fontWeight: "bold", fontSize: "13px" }}>
                <span>{topics.filter(t => t.done).length}</span>/12
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#B0B0B0", fontSize: "13px" }}>Sessions with VANI</span>
              <span style={{ color: "#FF8C4A", fontWeight: "bold", fontSize: "13px" }}>
                <span>{trialSessionsCount}</span>
              </span>
            </div>
          </div>

          <p style={{ fontSize: "14px", color: "#B0B0B0", marginBottom: "24px" }} className="leading-relaxed">
            Continue your journey — upgrade to keep your progress and unlock everything.
          </p>
        </div>

        {renderPlanSelectionMarkup({ hideTrialCard: true, onBack: null })}
      </div>
    );
  };

  const renderPlanExpiredScreen = () => {
    return (
      <div id="plan-expired-screen" className="absolute inset-0 bg-[#0D0D0D] z-[9990] flex flex-col p-4 overflow-y-auto text-white select-none" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div style={{ padding: "40px 20px 20px", textAlign: "center" }}>
          
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔒</div>

          <h1 style={{ fontSize: "26px", color: "#FF8C4A", margin: "0 0 8px 0" }} className="font-bold">
            Subscription Expired
          </h1>

          <p style={{ fontSize: "14px", color: "#767676", margin: "0 0 16px 0", lineHeight: "1.6" }}>
            Your monthly access period has completed. Select a plan below to renew and continue chatting with VANI.
          </p>
        </div>

        {renderPlanSelectionMarkup({ hideTrialCard: true, onBack: null })}
      </div>
    );
  };

  const renderPaymentModal = () => {
    if (!selectedPlanDetails) return null;
    return (
      <div id="payment-modal" style={{
        display         : "flex",
        position        : "fixed",
        top             : 0, left: 0,
        width           : "100%", height: "100%",
        background      : "rgba(0,0,0,0.7)",
        zIndex         : 10000,
        alignItems     : "flex-end",
        justifyContent : "center",
      }}>
        <div id="payment-sheet" style={{
          background      : "#1A1A1A",
          borderRadius   : "24px 24px 0 0",
          padding         : "24px 20px 40px",
          width           : "100%",
          maxWidth       : "420px",
          fontFamily     : "Poppins, sans-serif",
        }} className="transform translate-y-0 transition-transform duration-350 text-white">
          
          {/* Google Play header */}
          <div style={{
            display         : "flex",
            alignItems     : "center",
            gap             : "10px",
            marginBottom   : "20px",
            paddingBottom  : "16px",
            borderBottom   : "1px solid #2A2A2A",
          }}>
            <div style={{
              width           : "32px",
              height          : "32px",
              background      : "linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335)",
              borderRadius   : "8px",
              display         : "flex",
              alignItems     : "center",
              justifyContent : "center",
              fontSize       : "16px",
            }}>▶</div>
            <div style={{
              fontSize       : "14px",
              fontWeight     : "bold",
              color           : "#FFFFFF",
            }}>Google Play</div>
          </div>

          {/* Plan summary */}
          <div style={{
            background      : "#222222",
            borderRadius   : "12px",
            padding         : "16px",
            marginBottom   : "20px",
          }}>
            <div id="modal-plan-name" style={{
              fontSize       : "16px",
              fontWeight     : "bold",
              color           : "#FFFFFF",
              marginBottom   : "4px",
            }}>{selectedPlanDetails.name}</div>

            <div id="modal-plan-price" style={{
              fontSize       : "24px",
              fontWeight     : "bold",
              color           : "#FF8C4A",
              marginBottom   : "4px",
            }}>{selectedPlanDetails.price}</div>

            <div style={{
              fontSize       : "12px",
              color         : "#767676",
            }}>Auto-renews monthly. Cancel anytime.</div>
          </div>

          {/* Payment method */}
          <div style={{
            display         : "flex",
            alignItems     : "center",
            justifyContent : "space-between",
            padding         : "14px 0",
            borderBottom   : "1px solid #2A2A2A",
            marginBottom   : "20px",
          }}>
            <div style={{
              display         : "flex",
              alignItems     : "center",
              gap             : "10px",
            }}>
              <div style={{
                width           : "36px",
                height          : "24px",
                background      : "#4285F4",
                borderRadius   : "6px",
                display         : "flex",
                alignItems     : "center",
                justifyContent : "center",
                fontSize       : "12px",
                color           : "white",
                fontWeight     : "bold",
              }}>G</div>
              <span style={{
                fontSize       : "13px",
                color           : "#FFFFFF",
              }}>Google Play (UPI)</span>
            </div>
            <span style={{ color: "#FF8C4A" }}>▼</span>
          </div>

          {/* Subscribe button */}
          <button 
            id="confirm-payment-btn"
            onClick={confirmPaymentSimulation}
            disabled={payProcessing}
            style={{
              width           : "100%",
              height          : "56px",
              background      : payProcessing ? "#555" : "#1A73E8",
              border          : "none",
              borderRadius   : "14px",
              color           : "white",
              fontSize       : "16px",
              fontWeight     : "bold",
              cursor          : payProcessing ? "not-allowed" : "pointer",
              fontFamily     : "Poppins, sans-serif",
              marginBottom   : "12px",
            }}
          >
            {payProcessing ? "Processing..." : "Subscribe Now"}
          </button>

          {/* Cancel link */}
          <div style={{ textAlign: "center" }} className="text-center">
            <span 
              onClick={() => setShowPayModal(false)}
              style={{
                fontSize       : "13px",
                color         : "#767676",
                cursor          : "pointer",
                textDecoration : "underline",
              }}
            >
              Cancel
            </span>
          </div>

          {/* Legal note */}
          <div style={{
            fontSize       : "10px",
            color           : "#555",
            textAlign      : "center",
            marginTop      : "12px",
            lineHeight     : "1.5",
          }}>
            By subscribing you agree to Google Play Terms. Subscription managed by Google Play. Cancel under Google Play → Subscriptions.
          </div>

        </div>
      </div>
    );
  };

  const renderPaymentSuccess = () => {
    if (!selectedPlanDetails) return null;
    
    const planKey = selectedPlanDetails.key;
    const premiumBenefits = [
      "Unlimited AI Speaking Practice",
      "40+ Real-Life Conversation Scenarios",
      "Live Pronunciation Analysis",
      "Grammar Correction Engine",
      "Business English Training",
      "Interview Preparation",
      "AI Voice Station Access",
      "Daily Progress Reports",
      "Vocabulary Booster Tools",
      "Regional Language Translation Support",
      "Continuous Feature Updates"
    ];

    const messages: Record<string, string> = {
      trial    : "Your 4-day trial is active!\nYou have unlocked ~30% of features. Auto-renews to full Premium unless cancelled.",
      premium  : "Welcome to Premium!\nAll elite coaching content, voice sessions, and AI correction tools are fully unlocked.",
      promaster: "Welcome to 6-Month Premium Plan!\nAll voice sessions, scenarios, and AI tools are fully unlocked for your 180 days pass."
    };

    return (
      <div id="payment-success" style={{
        position        : "fixed",
        top             : 0, left: 0,
        width           : "100%", height: "100%",
        background      : "radial-gradient(circle at 50% 15%, #1B0C2D 0%, #05010B 100%)",
        zIndex         : 10001,
        display         : "flex",
        flexDirection  : "column",
        alignItems     : "center",
        justifyContent : "center",
        fontFamily     : "Poppins, sans-serif",
        overflowY      : "auto",
        padding        : "20px"
      }} className="text-white">
        
        {/* Animated Glowing Violet Orbs in background */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(139, 92, 246, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0
        }} />

        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0) 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0
        }} />

        {/* Dynamic Fall-down Confetti */}
        <div id="confetti-container" className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {Array.from({ length: 45 }).map((_, i) => {
            const colorsList = ["#D9F99D", "#A78BFA", "#8B5CF6", "#C4B5FD", "#10B981", "#E9D5FF", "#FFFFFF"];
            const color = colorsList[i % colorsList.length];
            const top = Math.random() * 40;
            const left = Math.random() * 100;
            const duration = 1.0 + Math.random() * 1.5;
            const delay = Math.random() * 0.7;
            return (
              <div 
                key={i} 
                className="absolute w-2 h-2 rounded-full overflow-hidden"
                style={{
                  background: color,
                  top: `${top}%`,
                  left: `${left}%`,
                  animation: `fall ${duration}s ease-in forwards`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Content Wrapper */}
        <div style={{ 
          zIndex: 2, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          width: "100%", 
          maxWidth: "400px",
          textAlign: "center"
        }}>
          
          {/* Animated Success Badge with radial violet glow */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            style={{
              width           : "72px",
              height          : "72px",
              borderRadius   : "24px",
              background      : "linear-gradient(135deg, #7C3AED, #4C1D95)",
              display         : "flex",
              alignItems     : "center",
              justifyContent : "center",
              fontSize       : "32px",
              marginBottom   : "14px",
              border          : "2.5px solid #C4B5FD",
              boxShadow      : "0 0 25px rgba(139,92,246,0.6)",
            }}
          >
            {planKey === "trial" ? "🎁" : "👑"}
          </motion.div>

          {/* Status Capsule */}
          <div style={{
            background: "rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(167, 139, 250, 0.6)",
            color: "#D9F99D",
            fontSize: "9.5px",
            fontWeight: "900",
            letterSpacing: "1.5px",
            padding: "4px 14px",
            borderRadius: "50px",
            textTransform: "uppercase",
            marginBottom: "10px",
            boxShadow: "0 2px 10px rgba(124,58,237,0.2)"
          }}>
            {planKey === "trial" ? "🎟️ Trial Activated" : "✨ Subscription Success"}
          </div>

          <h2 style={{
            color         : "#FFFFFF",
            fontSize     : "24px",
            margin        : "0 0 4px 0",
            fontWeight    : "900",
            letterSpacing : "-0.5px",
            lineHeight    : "1.2"
          }} className="text-center font-black">
            {planKey === "trial" ? "4-Day Trial Unlocked!" : "PREMIUM BENEFITS UNLOCKED"}
          </h2>

          <p style={{
            color         : "#C4B5FD",
            fontSize     : "11.5px",
            margin        : "0 0 16px 0",
            fontWeight    : "600",
            maxWidth      : "330px",
            lineHeight    : "1.4"
          }}>
            {messages[planKey] || "Welcome to Premium English Practice!"}
          </p>

          {/* COLORFUL PREMIUM BENEFITS CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              background: "rgba(10, 4, 21, 0.8)",
              backdropFilter: "blur(16px)",
              border: "2px solid rgba(139, 92, 246, 0.45)",
              borderRadius: "24px",
              padding: "16px 14px",
              width: "100%",
              boxShadow: "0 12px 35px rgba(124, 58, 237, 0.4), inset 0 0 15px rgba(139,92,246,0.15)",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Header of features */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1.5px solid rgba(139, 92, 246, 0.25)",
              paddingBottom: "8px",
              marginBottom: "10px",
              paddingLeft: "4px",
              paddingRight: "4px"
            }}>
              <span style={{ fontSize: "10.5px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1.2px", color: "#C4B5FD" }}>
                🎖️ Your Premium Dashboard
              </span>
              <span style={{ fontSize: "10.5px", fontWeight: "950", color: "#34D399", background: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: "10px" }}>
                {planKey === "trial" ? "Limited Access Active" : "100% Active"}
              </span>
            </div>

            {/* Scrollable list of exact 11 items requested by the user */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              maxHeight: "280px",
              overflowY: "auto",
              paddingRight: "2px",
              textAlign: "left"
            }} className="no-scrollbar">
              {premiumBenefits.map((benefit, idx) => {
                // If it is trial, unlock approx 30% (first 4 items), lock the remaining ones.
                const isItemLockedOnTrial = planKey === "trial" && idx >= 4;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.03 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      background: isItemLockedOnTrial ? "rgba(255, 255, 255, 0.01)" : "rgba(139, 92, 246, 0.05)",
                      border: isItemLockedOnTrial ? "1.5px dashed rgba(255, 255, 255, 0.04)" : "1.5px solid rgba(139, 92, 246, 0.16)",
                      borderRadius: "11px",
                      padding: "7px 10px",
                      transition: "all 0.2s"
                    }}
                  >
                    <span style={{
                      fontSize: "13px",
                      filter: isItemLockedOnTrial ? "grayscale(100%) opacity(30%)" : "none",
                      flexShrink: 0
                    }}>
                      {isItemLockedOnTrial ? "🔒" : "✅"}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{
                        fontSize: "12.5px",
                        fontWeight: "700",
                        color: isItemLockedOnTrial ? "#6B7280" : "#FFFFFF",
                        lineHeight: "1.3"
                      }}>
                        {benefit}
                      </span>
                      {isItemLockedOnTrial && (
                        <span style={{ fontSize: "8.5px", color: "#A78BFA", fontWeight: "bold", opacity: 0.7 }}>
                          Upgrade to Premium (₹249) to Unlock
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Action Button styled as gorgeous deep violet-to-white interactive block */}
          <button 
            onClick={enterAppAfterPayment}
            style={{
              background    : "linear-gradient(135deg, #7C3AED, #A78BFA)",
              border        : "none",
              borderRadius : "16px",
              color         : "white",
              fontSize       : "15px",
              fontWeight     : "900",
              padding       : "14px 32px",
              cursor        : "pointer",
              fontFamily     : "Poppins, sans-serif",
              boxShadow      : "0 6px 20px rgba(124, 58, 237, 0.45)",
              width          : "100%",
              maxWidth       : "300px",
              letterSpacing  : "0.5px",
              transition     : "all 0.2s"
            }}
            className="hover:brightness-110 active:scale-95 duration-150"
          >
            Start Learning with VANI 🎙️
          </button>
          
          <div style={{
            fontSize: "10.5px",
            color: "#8B5CF6",
            fontWeight: "800",
            marginTop: "12px",
            letterSpacing: "0.5px"
          }}>
            VANI Coach — Speak with Confidence
          </div>

        </div>

        <style>{`
          @keyframes tickBounce {
            0%   { transform: scale(0); opacity: 0; }
            60%  { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fall {
            to { 
              transform  : translateY(100vh) rotate(360deg);
              opacity    : 0;
            }
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    );
  };

  const renderCustomUpiModal = () => {
    if (!customUpiModalOpen) return null;

    // Secure deep link remains functional behind-the-scenes for mobile without ever displaying the raw VPA text
    const upiLink = `upi://pay?pa=9804102281@axl&pn=VANI%20English%20Coach&am=${customUpiAmount}&cu=INR&tn=Vani%20Coach%20VIP`;

    const handleConfirmPayment = () => {
      if (!upiConfirmChecked) {
        playTTS("Please confirm that you have paid by ticking the checkbox first.", 20);
        alert("Please tick the confirmation checkbox to verify that you've sent the payment.");
        return;
      }
      setCustomUpiModalOpen(false);
      customUpiSuccessCallback();
    };

    const runAutomatedPushRequest = () => {
      if (!userVpa.trim() || !userVpa.includes("@")) {
        playTTS("Please enter a valid personal UPI ID first.", 15);
        alert("Please enter a valid personal UPI ID (e.g. yourname@okaxis) to receive the push notification request.");
        return;
      }

      setSimulatingPush(true);
      setPushProgress(5);
      setPushStage("Establishing secure SSL connection to NPCI gateway...");
      playTTS("Connecting to National Payments Corporation of India gateway.", 10);

      const stages = [
        { progress: 20, stage: "Resolving VPA address registry..." },
        { progress: 45, stage: `Dispatching ₹${customUpiAmount}.00 instant collect request to ${userVpa}...` },
        { progress: 75, stage: "Awaiting user authorization from your mobile UPI application..." },
        { progress: 95, stage: "Secure token match verified! Finalizing settlement handshake..." },
        { progress: 100, stage: "Transaction authorized successfully! Activating VIP profile." }
      ];

      stages.forEach((s, idx) => {
        setTimeout(() => {
          setPushProgress(s.progress);
          setPushStage(s.stage);
          if (idx === 1) {
            playTTS("Secure collect request sent. Please check your mobile UPI app notification or proceed with instant confirmation.", 15);
          } else if (idx === 4) {
            playTTS("Verification completed successfully. Welcome to premium VANI coach!", 15);
            setUpiConfirmChecked(true);
          }
        }, (idx + 1) * 1400);
      });
    };

    return (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[99999] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 text-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-950 to-slate-900 p-6 pb-5 relative overflow-hidden border-b border-slate-800/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Secured Automated UPI Gateway
              </div>
              <button 
                onClick={() => setCustomUpiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer duration-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-1">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest block">SECURE TRANSACT</span>
              <h3 className="text-lg font-black tracking-tight text-white leading-none">
                {customUpiPlanName || "VIP Premium Plan"}
              </h3>
              <div className="text-3xl font-black text-violet-400 mt-2">
                ₹{customUpiAmount}.00
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Step 1: Automated VPA Collection Request Simulator */}
            {!simulatingPush ? (
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-3xl p-4.5 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-violet-400 block">
                    ⚡ Option A: Instant Push Collection Request
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                  Enter your personal UPI ID. Our billing router will dispatch an instant secure payment request token directly to your UPI App.
                </p>
                <div className="space-y-1.5 pt-1">
                  <label className="text-[9px] uppercase font-black text-slate-500 block">Your Personal UPI ID (VPA)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userVpa}
                      onChange={(e) => setUserVpa(e.target.value)}
                      placeholder="e.g. name@okaxis, phone@paytm"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-700"
                    />
                    <button
                      onClick={runAutomatedPushRequest}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-black text-[10px] uppercase px-3.5 py-2 rounded-xl transition duration-150 cursor-pointer shrink-0"
                    >
                      Request Push
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/70 border border-violet-900/40 rounded-3xl p-5 text-center space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase text-violet-400">
                  <span>Routing Secure Collect Request</span>
                  <span className="text-white animate-pulse">{pushProgress}%</span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full duration-500 transition-all rounded-full"
                    style={{ width: `${pushProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-center gap-2.5 text-[11px] text-slate-300 font-bold min-h-[32px] leading-relaxed bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  {pushProgress < 100 && (
                    <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                  <span>{pushStage}</span>
                </div>

                {pushProgress < 100 && (
                  <button
                    onClick={() => {
                      setSimulatingPush(false);
                      setPushProgress(0);
                    }}
                    className="text-[9.5px] uppercase font-black text-slate-500 hover:text-slate-300 transition block mx-auto"
                  >
                    ← Edit UPI ID
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Quick Direct App Launch on Mobile */}
            <div className="space-y-2.5 text-left">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                📱 Option B: Open Instantly via Mobile App
              </span>
              <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                If you are on mobile, select your UPI app to complete the transaction securely. (Our developer's merchant credentials are securely bound within the encrypted deep-link payload).
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <a 
                  href={upiLink}
                  onClick={() => playTTS("Opening Google Pay secure channel.", 5)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2 duration-150 cursor-pointer text-white no-underline"
                >
                  <span className="text-emerald-400">🟢</span> Google Pay
                </a>
                <a 
                  href={upiLink}
                  onClick={() => playTTS("Opening Phone Pay secure channel.", 5)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2 duration-150 cursor-pointer text-white no-underline"
                >
                  <span className="text-purple-400">🟣</span> PhonePe
                </a>
                <a 
                  href={upiLink}
                  onClick={() => playTTS("Opening Paytm secure channel.", 5)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2 duration-150 cursor-pointer text-white no-underline"
                >
                  <span className="text-sky-400">🔵</span> Paytm
                </a>
                <a 
                  href={upiLink}
                  onClick={() => playTTS("Opening general UPI app.", 5)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2 duration-150 cursor-pointer text-white no-underline"
                >
                  <span className="text-amber-400">🟠</span> Any UPI App
                </a>
              </div>
            </div>

            {/* Step 3: Complete Confirmation */}
            <div className="pt-2 border-t border-slate-800/60 space-y-4">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-left">
                <input 
                  type="checkbox"
                  checked={upiConfirmChecked}
                  onChange={(e) => {
                    setUpiConfirmChecked(e.target.checked);
                    if (e.target.checked) {
                      playTTS("Payment confirmation marked. Please verify to activate.", 15);
                    }
                  }}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-300 font-semibold leading-snug">
                  I have authorized the transfer of ₹{customUpiAmount}.00 through my UPI application, and the amount is successfully processed.
                </span>
              </label>

              <button
                onClick={handleConfirmPayment}
                className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg duration-200 transition flex items-center justify-center gap-2 cursor-pointer ${
                  upiConfirmChecked 
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]" 
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Verify & Complete Activation ⚡</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderDeletionModal = () => {
    if (!deletionOverlayOpen) return null;

    const reasons = [
      "I have successfully achieved my language goals and sound fluent",
      "VANI AI's speed and grammatical checks are too advanced",
      "I am switching to another English learning program",
      "I have issues/concerns with voice storage and audio data privacy",
      "I want to reset my practice history and start over from scratch",
      "Other reason / not using the applet weekly anymore"
    ];

    const handleDeleteProceed = () => {
      if (deletionStep === 1) {
        if (!deletionReason) {
          playTTS("Please select a reason for deletion first.", 12);
          return;
        }
        if (!deletionChecked) {
          playTTS("Please check the confirmation box to proceed.", 12);
          return;
        }
        setDeletionStep(2);
        playTTS("Are you absolutely sure you want to proceed? This will erase all logs permanently.", 12);
      } else if (deletionStep === 2) {
        setDeletionStep(3);
        playTTS("Deleting your client profile. Please hold on.", 12);
        setTimeout(() => {
          // Perform full account wipe
          localStorage.removeItem("vani_opening_completed");
          localStorage.removeItem("trialSessionsCount");
          localStorage.removeItem("vocab_practiced_phrases");
          localStorage.removeItem("vani_practice_logs");
          localStorage.removeItem("vani_streak_count");
          localStorage.removeItem("vani_has_completed_topic");
          
          setIsOtpLoggedIn(false);
          setIsPhoneLoggedIn(false);
          setReportOverlayOpen(false);
          setDeletionOverlayOpen(false);
          setAppStage("opening");
          setPhoneNumber("");
          setLoginOtpSent(false);
          setOtpValue("");
          setUserPlan("none");
          setStreak(0);

          playTTS("Your account has been deleted successfully.", 12);
          setActiveToast({
            type: "success",
            message: "ACCOUNT SUCCESSFULY DELETED",
            subMessage: "All data has been safely cleared from our simulator databases."
          });
        }, 1800);
      }
    };

    return (
      <div id="deletion-modal-container" className="fixed inset-0 bg-black/60 z-[10006] flex items-center justify-center p-5 font-poppins select-none backdrop-blur-xs">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm text-left relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <Trash2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight">Account Deletion Hub</h3>
              <p className="text-[10px] text-stone-400 font-bold">Manage profile termination preferences</p>
            </div>
          </div>

          {deletionStep === 1 && (
            <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4 text-left">
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-[10.5px] text-rose-850 leading-relaxed font-bold flex gap-2">
                <span className="text-base shrink-0">⚠️</span>
                <span>Deleting your VANI account will permanently erase all accent scores, active streaks, daily goal histories, and grammar correction logs. This action cannot be undone.</span>
              </div>

              {/* Reasons Selection */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">Why are you leaving? (Required)</span>
                <div className="space-y-1.5">
                  {reasons.map((reason, i) => (
                    <button
                      key={i}
                      onClick={() => setDeletionReason(reason)}
                      className={`w-full text-left p-2.5 rounded-xl border text-[10.5px] font-bold transition flex items-start gap-2.5 leading-snug ${
                        deletionReason === reason
                          ? "bg-rose-50/50 border-rose-400 text-rose-700 font-black shadow-xxs"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        deletionReason === reason ? "border-rose-400 bg-rose-500" : "border-stone-300 bg-white"
                      }`}>
                        {deletionReason === reason && <span className="w-1.5 h-1.5 rounded-full bg-white animate-scale-in" />}
                      </span>
                      <span>{reason}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Warning */}
              <label className="flex items-start gap-2.5 cursor-pointer p-1.5 bg-stone-50 rounded-xl border border-stone-150">
                <input
                  type="checkbox"
                  checked={deletionChecked}
                  onChange={(e) => setDeletionChecked(e.target.checked)}
                  className="mt-1 transition border-stone-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-[9.5px] text-stone-600 leading-normal font-semibold">
                  I understand that deleting my profile is irreversible, and VANI AI will instantly erase all active badges, speech insights, and practice progress.
                </span>
              </label>
            </div>
          )}

          {deletionStep === 2 && (
            <div className="my-6 space-y-4 text-center">
              <span className="text-4xl animate-bounce block">🛑</span>
              <h4 className="text-sm font-black text-stone-900 uppercase">Double-Verify Request</h4>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto font-medium">
                Are you absolutely compile-certain? This is your final verification checkpoint. All conversational speech statistics, vocabulary goals, and premium certificates will be permanently purged.
              </p>
              <div className="bg-stone-50 p-3 rounded-xl text-left border border-stone-150 text-[10.5px] text-stone-600 space-y-1 font-bold">
                <p>• Leaving Reason: <span className="text-stone-900">"{deletionReason}"</span></p>
                <p>• Linked Profile: <span className="text-stone-900">{profilePhone || "Verified SIM/Email"}</span></p>
              </div>
            </div>
          )}

          {deletionStep === 3 && (
            <div className="my-10 space-y-4 text-center">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border-4 border-stone-100 border-t-rose-500 animate-spin" />
                <span className="text-2xl">⏳</span>
              </div>
              <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider">Purging Client Data Nodes</h4>
              <p className="text-[10.5px] text-stone-400 font-bold leading-normal">Safely wiping practice records, chat history & cookies from current session storage...</p>
            </div>
          )}

          {/* Action Buttons */}
          {deletionStep !== 3 && (
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 mt-4 shrink-0">
              <button
                onClick={() => {
                  if (deletionStep === 2) {
                    setDeletionStep(1);
                  } else {
                    setDeletionOverlayOpen(false);
                  }
                }}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-center text-xs transition active:scale-95"
              >
                {deletionStep === 2 ? "Go Back" : "Cancel"}
              </button>
              <button
                onClick={handleDeleteProceed}
                disabled={deletionStep === 1 && (!deletionReason || !deletionChecked)}
                className={`w-full py-2.5 rounded-xl font-bold text-center text-xs transition active:scale-95 ${
                  deletionStep === 1 && (!deletionReason || !deletionChecked)
                    ? "bg-rose-200 text-rose-400 cursor-not-allowed"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                }`}
              >
                {deletionStep === 2 ? "Purge Permanently" : "Next Option"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLegalModals = () => {
    if (!showTerms && !showPrivacy && !showAccessibility) return null;
    const title = showTerms ? "Terms of Service" : showPrivacy ? "Privacy Policy" : "Accessibility Guidelines";
    const content = showTerms 
      ? "Welcome to Easy English. By using our coaching platform powered by VANI AI, you agree to comply with our Terms of Service. Access to standard topics is subject to your selected plan limits. Subscription payments are processed securely, and no real-money transactions are processed in this simulator environment."
      : showPrivacy
      ? "Your privacy is important to us. VANI AI processes audio and conversational text to provide real-time grammatical corrections and vocabulary corrections. We do not store, sell, or analyze your voice recordings for any other purposes."
      : "Easy English is committed to digital accessibility. We support screen readers, adjustable speech synthesizers, manual keyboard inputs, and sound reactive waveforms to make English learning fully inclusive.";

    return (
      <div className="fixed inset-0 bg-black/80 z-[10005] flex items-center justify-center p-5 font-poppins text-white select-none">
        <div className="bg-[#1A1A1A] border border-stone-800 rounded-3xl p-6 w-full max-w-sm text-left relative shadow-2xl">
          <h3 className="text-lg font-bold text-[#FF8C4A] mb-3">{title}</h3>
          <p className="text-xs text-stone-300 leading-relaxed mb-6">{content}</p>
          <button 
            onClick={() => {
              setShowTerms(false);
              setShowPrivacy(false);
              setShowAccessibility(false);
            }}
            className="w-full py-3 bg-[#FF6B2B] hover:bg-[#FF8C55] rounded-xl text-white font-bold text-center text-xs transition active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    );
  };

  const MENU_ITEMS = [
    { 
      icon: <Languages className="w-5 h-5 text-rose-500" />, 
      label: "Express Translator", 
      action: () => { 
        if (!canUseTranslation()) {
          const limitMsg = "The Express Translator is blocked during the active Trial period. Upgrade to a Premium or 6-Month Discount plan to access real-time regional translations!";
          playTTS(limitMsg, 813);
          alert(`🔒 Translator Blocked\n\n${limitMsg}`);
          setMenuOpen(false);
          setBillingOverlayOpen(true);
          return;
        }
        setTranslatorOpen(true); 
        setMenuOpen(false); 
      } 
    },
    { icon: <Compass className="w-5 h-5 text-emerald-500" />, label: "Discover All Topics", action: () => { setScreen("topics"); setMenuOpen(false); } },
    { icon: <History className="w-5 h-5 text-amber-500" />, label: "Practice Log Performance", action: () => { setReportOverlayOpen(true); setMenuOpen(false); } },
    { icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />, label: "User's Account Status", action: () => { setReportOverlayOpen(true); setMenuOpen(false); } },
    { icon: <Trash2 className="w-5 h-5 text-rose-500" />, label: "Account Deletion Options", action: () => { setDeletionOverlayOpen(true); setDeletionStep(1); setDeletionReason(""); setDeletionChecked(false); setMenuOpen(false); } },
    { icon: <FileText className="w-5 h-5 text-stone-500" />, label: "Terms of Service", action: () => { setShowTerms(true); setMenuOpen(false); } },
  ];

  return (
    <div className="relative max-w-md mx-auto min-h-screen flex flex-col bg-stone-50 overflow-hidden shadow-2xl border-x border-stone-200">
      
      {/* ── NEW: Splash Screen ── */}
      {appStage === "splash" && (
        <SplashScreen />
      )}

      {/* ── NEW: Opening Screen ── */}
      {appStage === "opening" && (
        <OpeningScreen
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          otpSent={loginOtpSent}
          setOtpSent={setLoginOtpSent}
          otpValue={otpValue}
          setOtpValue={setOtpValue}
          onContinue={() => {
            localStorage.setItem("vani_opening_completed", "true");
            setAppStage("app");
          }}
          onShowTerms={() => setShowTerms(true)}
          onShowPrivacy={() => setShowPrivacy(true)}
        />
      )}

      {/* ── EXISTING APP ── */}
      {appStage === "app" && (
        <>
          {/* Global Celebrations and Milestone Toasts */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, y: -25 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-4 left-4 right-4 z-[9999] bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className={`p-2 rounded-xl text-lg flex items-center justify-center shrink-0 ${
              activeToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 font-bold' :
              activeToast.type === 'streak' ? 'bg-rose-500/20 text-rose-400 font-bold' :
              'bg-blue-500/20 text-blue-400 font-bold'
            }`}>
              {activeToast.type === 'success' ? '🏆' : activeToast.type === 'streak' ? '🔥' : '✨'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-black tracking-wide leading-tight uppercase text-slate-100">{activeToast.message}</p>
              {activeToast.subMessage && (
                <p className="text-[10px] text-slate-400 font-bold leading-normal mt-0.5">{activeToast.subMessage}</p>
              )}
            </div>
            <button 
              onClick={() => setActiveToast(null)}
              className="text-slate-500 hover:text-slate-300 text-xs p-1 font-black cursor-pointer active:scale-95 duration-100"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic start-up gating overlays */}
      {gateMode === "splash" && renderSplashScreen()}
      {gateMode === "onboarding" && renderOnboardingScreen()}
      {gateMode === "trial_expired" && renderTrialExpiredScreen()}
      {gateMode === "plan_expired" && renderPlanExpiredScreen()}

      {/* Payment Sheet & Success Celebrations */}
      {showPayModal && renderPaymentModal()}
      {showPaySuccess && renderPaymentSuccess()}

      {/* Legal Modals */}
      {renderLegalModals()}
      {renderDeletionModal()}
      {renderCustomUpiModal()}
      
      {/* Dynamic Left Hamburger Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="absolute inset-0 z-50 flex">
            {/* Drawer Area */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-4/5 bg-white h-full flex flex-col p-6 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex items-center gap-3 pb-6 border-b border-stone-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-2xl shadow-md">
                  V
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-stone-800">
                    <span className="text-rose-500">Easy</span> English
                  </h2>
                  <p className="text-xs text-stone-500 font-semibold">with Coach VANI 🤖</p>
                </div>
              </div>

              <div className="flex-1 py-6 space-y-1">
                {MENU_ITEMS.map((item, index) => (
                  <button 
                    key={index} 
                    onClick={item.action} 
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition active:bg-stone-100 text-stone-700 font-medium text-sm text-left"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  handleProgressStreak();
                }}
                className="w-full text-left p-4 bg-lime-50 hover:bg-lime-100/60 rounded-2xl border border-lime-200 mb-4 cursor-pointer active:scale-95 transition-all duration-200"
              >
                <p className="text-xs text-lime-800 font-extrabold mb-1 flex items-center gap-1">
                  <span>🔥 Current Streak</span>
                  <span className="animate-pulse text-[10px] bg-lime-200 text-lime-800 px-1.5 py-0.2 rounded-full font-black">TAP +XP</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">⚡</span>
                  <p className="text-sm font-black text-stone-800">{streak} Days Active</p>
                </div>
              </button>

              <div className="pt-4 border-t border-stone-100 text-center">
                <p className="text-xxs text-stone-400 font-bold">VANI ENG TUTOR VERSION 2.1</p>
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="flex-1 bg-black/40 h-full cursor-pointer"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Slide-Up Indian Translation Buddy */}
      <AnimatePresence>
        {translatorOpen && (
          <div className="absolute inset-0 z-40 bg-black/30 flex items-end">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full bg-white rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto shadow-2xl z-50"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-black text-rose-600 uppercase tracking-tight">English Translation Only</h3>
                </div>
                <button 
                  onClick={() => setTranslatorOpen(false)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Translate your native thoughts <strong className="text-rose-550 font-bold">strictly into fluent spoken English</strong>! VANI works exclusively to convert and elevate expressions into English only.
              </p>

              {/* Translation flow diagram indicator */}
              <div className="my-3 bg-rose-50/50 rounded-2xl p-3 border border-rose-100 flex items-center justify-between text-center select-none">
                <div className="flex-1">
                  <span className="block text-[10px] font-black text-rose-500 uppercase tracking-wider">Indian Source</span>
                  <span className="block text-xs font-bold text-stone-700 mt-0.5">{selectedSourceLang}</span>
                </div>
                <div className="px-2 font-black text-rose-500 text-sm animate-pulse">➜</div>
                <div className="flex-1">
                  <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-wider">English Output</span>
                  <span className="block text-xs font-bold text-stone-850 mt-0.5">Fluent Conversational</span>
                </div>
              </div>

              {/* Strict constraints notification */}
              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200/60 flex gap-2 items-start text-left mb-2">
                <span className="text-xs text-amber-600 mt-0.5 shrink-0">⚠️</span>
                <p className="text-[9.5px] text-amber-900 font-extrabold leading-normal uppercase">
                  Strictly Regional to English Conversational revisions only. Translation to other directions is deliberately unsupported.
                </p>
              </div>

              {/* Language Selector for Drawer */}
              <div className="flex gap-2 items-center bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-700">
                <span className="font-extrabold shrink-0 text-stone-500 uppercase text-[10px]">Source Language:</span>
                <select
                  value={selectedSourceLang}
                  onChange={(e) => {
                    setSelectedSourceLang(e.target.value);
                    setTranslatorResult(null);
                  }}
                  className="bg-transparent focus:outline-none flex-1 font-black text-rose-500 cursor-pointer"
                >
                  {INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="font-medium text-stone-800">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={translatorInput}
                    onChange={(e) => setTranslatorInput(e.target.value)}
                    placeholder={
                      selectedSourceLang === "Bengali" 
                        ? "e.g., Ami bhalo achi or আমার টিকিট এখনও কনফার্ম হয়নি..."
                        : selectedSourceLang === "Hindi"
                        ? "e.g., Flight ticket confirm ho gayi hai or मुझे कल छुट्टी चाहिए..."
                        : selectedSourceLang === "Telugu"
                        ? "e.g., Naku tondaraga vellali or నాకు సహాయం కావాలి..."
                        : selectedSourceLang === "Tamil"
                        ? "e.g., Yenakku ungalai pidikkum or எனக்கு ஒரு உதவி வேண்டும்..."
                        : `Type your ${selectedSourceLang} thought here...`
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium placeholder-stone-400"
                  />
                  {/* Speech input toggle */}
                  <button
                    type="button"
                    onClick={startTranslatorVoiceRecognition}
                    className={`absolute right-3 top-2.5 p-2 rounded-full transition-all active:scale-90 ${
                      isTranslatorListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-rose-100 text-rose-500 hover:bg-rose-200"
                    }`}
                    title={`Speak in ${selectedSourceLang}`}
                  >
                    {isTranslatorListening ? (
                      <span className="flex items-center justify-center relative w-4.5 h-4.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
                        <Mic className="w-3.5 h-3.5 shrink-0 z-10" />
                      </span>
                    ) : (
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                </div>
                
                <button
                  onClick={() => runQuickTranslate()}
                  disabled={translating || !translatorInput.trim()}
                  className="w-full py-3 bg-rose-500 text-white font-extrabold text-sm rounded-xl hover:bg-rose-600 active:scale-98 transition disabled:opacity-50"
                >
                  {translating ? "Translating Thoughts..." : "Translate to English"}
                </button>
              </div>

              {translatorResult && (
                <div className="mt-5 space-y-4 pt-4 border-t border-stone-100">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100/50">
                    <p className="text-[11px] font-black text-amber-800 tracking-wide uppercase">Simple English Translation</p>
                    <p className="text-sm font-bold text-stone-800 mt-1 leading-snug">
                      "{translatorResult.translatedSimple}"
                    </p>
                  </div>

                  <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100/50">
                    <p className="text-[11px] font-black text-rose-800 tracking-wide uppercase">Polished Conversational English</p>
                    <p className="text-sm font-bold text-stone-800 mt-1 leading-snug italic">
                      "{translatorResult.translatedSmart}"
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-700">Pronunciation & Use Tip</p>
                      <p className="text-xs text-stone-500 mt-1">{translatorResult.pronunciationTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Billing VIP Checkout Overlays & Pages */}
      <AnimatePresence>
        {billingOverlayOpen && (
          <div className="absolute inset-0 bg-[#0D0D0D] z-50 flex flex-col overflow-y-auto no-scrollbar">
            {renderPlanSelectionMarkup({ 
              hideTrialCard: true, 
              onBack: () => setBillingOverlayOpen(false) 
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Database sync Phone OTP Authentication simulator Overlays & Pages */}
      <AnimatePresence>
        {otpOverlayOpen && (
          <div id="otp-overlay-container" className="absolute inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-5 backdrop-blur-xs">
            <motion.div 
              id="otp-authenticator-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl z-50 text-left border border-stone-200 select-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-100" id="otp-header">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Firebase Sync Gateway</span>
                </div>
                <button 
                  id="btn-close-otp"
                  onClick={() => setOtpOverlayOpen(false)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-400 rounded-full text-[11px] font-extrabold transition"
                >
                  Close
                </button>
              </div>

              {/* Secure banner */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-2.5 mt-4" id="otp-description">
                <Lock className="w-5 h-5 text-indigo-505 shrink-0 mt-0.5 text-indigo-600" />
                <p className="text-[10.5px] text-stone-600 leading-normal font-semibold font-sans">
                  We use verified Google Firestore & Firebase SMS Authentication. Profiles, streaks, memories, and XP achievements sync cleanly.
                </p>
              </div>

              {/* FORM VIEW 1: Send OTP phone input */}
              {!otpSent ? (
                <form onSubmit={handleOTPLoginSimulate} className="mt-4 space-y-4" id="otp-phone-form">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">Enter Indian Mobile Number:</label>
                    <div className="flex border border-stone-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500">
                      <span className="bg-stone-50 px-3 py-2.5 text-xs text-stone-500 font-extrabold border-r border-stone-200 select-none">
                        +91
                      </span>
                      <input 
                        type="tel" 
                        required
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                        placeholder="e.g. 98765 43210"
                        className="flex-1 px-3 py-2.5 text-xs font-extrabold tracking-wide focus:outline-none placeholder-stone-400 text-stone-800"
                        id="input-phone-digits"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otpPhone.length < 10}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-45 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                    id="btn-otp-send-action"
                  >
                    {otpLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Firebase SMS code...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Send Authentication OTP Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* FORM VIEW 2: Verify secure SMS authentication code */
                <form onSubmit={verifyOTPCodeSimulate} className="mt-4 space-y-4" id="otp-code-form">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">Enter SMS verification code:</label>
                      <span className="text-[9.5px] text-indigo-600 font-black px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-lg">SMS Code: {syncGeneratedOtp}</span>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-black text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-500 text-stone-800"
                      id="input-verification-digits"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otpCode.length < 6}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-45 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                    id="btn-otp-verify-action"
                  >
                    {otpLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authenticating SMS credentials...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Verify OTP and Authorize Sync</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                    }}
                    className="w-full text-center text-stone-400 font-bold text-[10.5px] tracking-wider uppercase hover:text-stone-600 py-1"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Performance Assessment & User Account Overlay */}
      <AnimatePresence>
        {reportOverlayOpen && (
          <div id="report-overlay-container" className="absolute inset-0 z-50 bg-stone-900/60 flex items-end justify-center backdrop-blur-xs select-none">
            <motion.div 
              id="report-overlay-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full bg-white rounded-t-[32px] p-6 max-h-[88vh] overflow-y-auto shadow-2xl z-50 border-t border-stone-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100" id="report-header">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-indigo-950 uppercase">VANI Coach Analytics</h3>
                  <p className="text-[10px] text-stone-500 font-bold">Dynamic Performance Assessment Hub</p>
                </div>
                <button 
                  id="btn-close-report"
                  onClick={() => setReportOverlayOpen(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 rounded-full text-xs font-black transition"
                >
                  Close
                </button>
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-1 mt-4" id="report-tabs">
                <button
                  id="tab-btn-performance"
                  onClick={() => setReportTab('performance')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                    reportTab === 'performance' 
                      ? "bg-white text-rose-500 shadow-xs" 
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  📈 Practice Log
                </button>
                <button
                  id="tab-btn-account"
                  onClick={() => setReportTab('account')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                    reportTab === 'account' 
                      ? "bg-white text-indigo-600 shadow-xs" 
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  ⚙️ User's Account
                </button>
              </div>

              {/* TAB CONTENT 1: performance & practice log */}
              {reportTab === 'performance' && (
                <div className="mt-5 space-y-5 text-left" id="panel-performance">
                  {/* Accent score summary */}
                  <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-3xl border border-rose-100 text-left relative overflow-hidden flex items-center justify-between">
                    <div className="space-y-1 relative z-10">
                      <span className="px-2 py-0.5 bg-rose-500 text-white rounded font-black text-[7.5px] uppercase tracking-wider">Accent Quality</span>
                      <h4 className="text-sm font-black text-stone-900">Pronunciation Accent Score</h4>
                      <p className="text-[10.5px] text-stone-600 leading-snug font-medium">Calculated dynamically across active speaking logs</p>
                    </div>
                    {/* Score Circle */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-white border border-rose-200 rounded-full shadow-xs">
                      <span className="text-xl font-black text-rose-500">{accentScore}%</span>
                    </div>
                  </div>

                  {/* Competencies */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Metric Performance</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-150">
                        <p className="text-[10px] text-stone-400 font-bold">Fluency & Tempo</p>
                        <p className="text-lg font-black text-indigo-950 mt-1">130 WPM</p>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: "86%" }} />
                        </div>
                        <span className="text-[8.5px] text-emerald-600 font-bold block mt-1">Excellent standard flow</span>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-150">
                        <p className="text-[10px] text-stone-400 font-bold">Grammar Accuracy</p>
                        <p className="text-lg font-black text-indigo-950 mt-1">92%</p>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: "92%" }} />
                        </div>
                        <span className="text-[8.5px] text-rose-500 font-bold block mt-1">Superior subject concord</span>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-150">
                        <p className="text-[10px] text-stone-400 font-bold">Vocabulary Size</p>
                        <p className="text-lg font-black text-indigo-950 mt-1">85%</p>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: "85%" }} />
                        </div>
                        <span className="text-[8.5px] text-amber-600 font-bold block mt-1">Highly expressive phrasing</span>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-150">
                        <p className="text-[10px] text-stone-400 font-bold font-sans">Pause Frequency</p>
                        <p className="text-lg font-black text-indigo-950 mt-1">94%</p>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: "94%" }} />
                        </div>
                        <span className="text-[8.5px] text-indigo-600 font-bold block mt-1">Highly natural dialogue</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Timeline logs */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Practice log history timeline</h5>
                      <span className="bg-stone-100 text-stone-600 font-bold text-[9.5px] px-2 py-0.5 rounded-full">{topics.filter(t => t.done).length + 3} Completed workouts</span>
                    </div>

                    <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1 no-scrollbar">
                      {/* Topics that user set as done in this session */}
                      {topics.filter(t => t.done).map((topic) => (
                        <div key={topic.id} className="p-3 bg-white border border-stone-200 rounded-2xl flex items-start gap-3 shadow-xxs">
                          <span className="text-xl p-2 bg-emerald-50 text-emerald-600 rounded-xl">🎯</span>
                          <div className="flex-1 space-y-0.5">
                            <div className="flex justify-between items-baseline">
                              <h6 className="font-extrabold text-stone-850 text-xs truncate max-w-[150px]">{topic.title}</h6>
                              <span className="text-[8.5px] bg-emerald-100/60 text-[#137333] font-black px-1.5 py-0.5 rounded-sm uppercase">PRACTICED TODAY</span>
                            </div>
                            <p className="text-[10.5px] text-stone-500 font-semibold">Fluency Rating: <strong className="text-stone-700">92%</strong> | Theme: {topic.theme}</p>
                            <p className="text-[9.5px] text-rose-500 italic font-bold">Outstanding focus! Continuous dialogue makes perfect.</p>
                          </div>
                        </div>
                      ))}

                      {/* Mocked history logs */}
                      <div className="p-3 bg-white border border-stone-200 rounded-2xl flex items-start gap-3 shadow-xxs">
                        <span className="text-xl p-2 bg-rose-50 text-rose-500 rounded-xl">🗣️</span>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <h6 className="font-extrabold text-stone-850 text-xs">Introduce Yourself</h6>
                            <span className="text-[8.5px] bg-[#f9ebea] text-[#b03a2e] font-black px-1.5 py-0.5 rounded-sm uppercase">YESTERDAY</span>
                          </div>
                          <p className="text-[10.5px] text-stone-500 font-semibold">Fluency Rating: <strong className="text-stone-700">94%</strong> | Duration: {dailyGoalDone} mins</p>
                          <p className="text-[9.5px] text-emerald-600 font-black">Superb! Clean tone formulation with perfect career goal outlines.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-stone-200 rounded-2xl flex items-start gap-3 shadow-xxs">
                        <span className="text-xl p-2 bg-amber-50 text-amber-550 rounded-xl">🏫</span>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <h6 className="font-extrabold text-stone-850 text-xs">Meet Child's Teacher</h6>
                            <span className="text-[8.5px] text-stone-500 font-black px-1.5 py-0.5 rounded-sm bg-stone-100 uppercase">2 DAYS AGO</span>
                          </div>
                          <p className="text-[10.5px] text-stone-500 font-semibold">Fluency Rating: <strong className="text-stone-700">89%</strong> | Duration: 5 mins</p>
                          <p className="text-[9.5px] text-stone-600 font-bold leading-normal">Very polite and highly respectful. Focus slightly on preposition placements next.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-stone-200 rounded-2xl flex items-start gap-3 shadow-xxs">
                        <span className="text-xl p-2 bg-indigo-50 text-indigo-550 rounded-xl">💼</span>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <h6 className="font-extrabold text-stone-850 text-xs">Job Interview Practice</h6>
                            <span className="text-[8.5px] text-stone-500 font-black px-1.5 py-0.5 rounded-sm bg-stone-100 uppercase">3 DAYS AGO</span>
                          </div>
                          <p className="text-[10.5px] text-stone-500 font-semibold">Fluency Rating: <strong className="text-stone-700">91%</strong> | Duration: 6 mins</p>
                          <p className="text-[9.5px] text-stone-600 font-bold leading-normal">Awesome usage of robust verbs like "oversee", "spearhead", and "resolve".</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: accounts & present subscription status */}
              {reportTab === 'account' && (
                <div className="mt-5 space-y-5 text-left" id="panel-account">
                  {/* Simplified Subscription Card */}
                  <div className="bg-stone-50 border border-stone-200 p-5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Current Plan</span>
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-155 rounded-lg text-[9.5px] uppercase font-black">
                        {(userPlan === "pro" || userPlan === "promaster") ? "🔥 6-Month Pass" : userPlan === "premium" ? "👑 Premium Plan" : userPlan === "monthly" ? "⚡ Monthly Tier" : userPlan === "trial" ? "🎟️ VIP Trial" : "🎟️ Free Starter Plan"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none">
                        {(userPlan === "pro" || userPlan === "promaster") ? "⚡" : userPlan === "premium" ? "👑" : userPlan === "monthly" ? "⚡" : userPlan === "trial" ? "🎟️" : "🌱"}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-stone-900 leading-tight">
                          {(userPlan === "pro" || userPlan === "promaster") ? "6-Month Subscription Discount" : userPlan === "premium" ? "VIP Premium Fluency Client" : userPlan === "monthly" ? "English Student Monthly" : userPlan === "trial" ? "4-Day VIP Trial Active" : "Practice Learner Free Tier"}
                        </h4>
                        <p className="text-[10.5px] text-stone-500 font-bold mt-1">
                          {(userPlan === "pro" || userPlan === "promaster") && "Your 6-Month Premium checkout (₹199/month, total ₹1,196 pre-paid) has successfully unlocked all voice prioritizations and scenario simulations."}
                          {userPlan === "premium" && "Full voice calls, phonetic checks, and scenario libraries unlocked."}
                          {userPlan === "monthly" && "Unlimited texts unlocked. Upgradable to Voice system."}
                          {userPlan === "trial" && (trialExpired ? "Trial expired. Please select a plan option inside our pricing tab." : "4 days of absolute access features unlocked.")}
                          {userPlan === "none" && "Accessing basic learner materials. Upgrade anytime to begin call simulations."}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-stone-150 flex justify-between items-center text-xs font-semibold text-stone-600">
                      <span>Days Remaining:</span>
                      <strong className="text-stone-900 font-black text-sm">
                        {(userPlan === "pro" || userPlan === "promaster") ? "180 Days Remaining" : userPlan === "premium" ? "328 Days Remaining" : userPlan === "monthly" ? "21 Days Remaining" : userPlan === "trial" ? (trialExpired ? "Expired" : `${trialDaysLeft} Days Remaining`) : "0 Days (Starter Mode)"}
                      </strong>
                    </div>

                    {userPlan !== "none" && (
                      <div className="pt-3.5 border-t border-stone-150 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-stone-600">Auto-Renewal / Subscription Status:</span>
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                          </span>
                        </div>

                        {unsubscribeState === 'none' && (
                          <div className="flex flex-col gap-1.5 bg-rose-50/50 border border-rose-100 p-3 rounded-2xl">
                            <p className="text-[10px] text-rose-850 leading-relaxed font-medium">
                              💡 <strong>Cancellation Policy:</strong> You have the right to unsubscribe or cancel your subscription at any time. Canceling will instantly stop future automatic UPI transfers to the developer's registered merchant UPI account and downgrade you to the Free Starter mode.
                            </p>
                            <button
                              onClick={() => {
                                setUnsubscribeState('confirm');
                                playTTS("Are you sure you want to cancel your active subscription?", 925);
                              }}
                              className="mt-1 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-3 rounded-xl text-xs transition duration-150 text-center shadow-xs"
                            >
                              ❌ Cancel Subscription / Unsubscribe Anytime
                            </button>
                          </div>
                        )}

                        {unsubscribeState === 'confirm' && (
                          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl space-y-2.5">
                            <h5 className="text-xs font-black text-amber-900 flex items-center gap-1">
                              ⚠️ Confirm Unsubscription & Cancellation
                            </h5>
                            <p className="text-[10.5px] text-amber-950 font-semibold leading-relaxed">
                              Are you absolutely sure you want to cancel your current subscription/trial? This will instantly discontinue your premium features and ensure NO future automatic UPI billing deductions are sent to the developer's verified merchant account.
                            </p>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setUserPlan("none");
                                  setUnsubscribeState('success');
                                  playTTS("Subscription successfully canceled. You have been downgraded to the Free Starter mode, and all future automated UPI transfers have been terminated.", 926);
                                  alert("✅ Unsubscribed successfully!\n\nYour active plan/trial has been canceled immediately. All future automated payments to the developer's verified merchant UPI account are terminated.");
                                }}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] transition"
                              >
                                Yes, Cancel Immediately
                              </button>
                              <button
                                onClick={() => {
                                  setUnsubscribeState('none');
                                }}
                                className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-1.5 px-3 rounded-xl text-[11px] transition"
                              >
                                No, Keep Active
                              </button>
                            </div>
                          </div>
                        )}

                        {unsubscribeState === 'success' && (
                          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-1">
                            <h5 className="text-xs font-black text-emerald-800 flex items-center gap-1">
                              ✓ Successfully Cancelled & Unsubscribed
                            </h5>
                            <p className="text-[10.5px] text-emerald-950 font-semibold leading-relaxed">
                              All premium access is stopped. No automatic UPI deductions will be routed to the developer's account. You can upgrade again anytime!
                            </p>
                            <button
                              onClick={() => setUnsubscribeState('none')}
                              className="mt-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition"
                            >
                              Dismiss Status
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dev Sandbox State Selector (Extremely simple widget to test other plan views) */}
                  <div className="bg-stone-50/50 p-3 rounded-2xl text-left border border-stone-150/50">
                    <p className="text-[8.5px] uppercase font-black text-stone-400 tracking-wider">DEV PANEL: SWITCH PLAN VIEWS FOR PLAY STORE TESTING</p>
                    <div className="grid grid-cols-4 gap-1 mt-1.5">
                      {[
                        { id: "Trial", val: "trial" },
                        { id: "Monthly", val: "monthly" },
                        { id: "Premium", val: "premium" },
                        { id: "Pro", val: "pro" }
                      ].map((planOpt) => (
                        <button
                          key={planOpt.id}
                          onClick={() => {
                            setUserPlan(planOpt.val);
                            if (planOpt.val === "trial") {
                              setTrialStartDate(Date.now() - 1);
                              setTrialDaysLeft(7);
                              setTrialExpired(false);
                              setSessionMsgCount(0);
                            }
                            playTTS(`Simulating ${planOpt.id} account plan view.`, 12);
                          }}
                          className={`py-1 text-[8px] font-black uppercase text-center rounded-lg border transition ${
                            userPlan === planOpt.val 
                              ? "bg-stone-950 border-stone-950 text-white shadow-xxs" 
                              : "bg-white border-stone-200 text-stone-500 hover:bg-stone-100"
                          }`}
                        >
                          {planOpt.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Razorpay Integration Gateway Console */}
                  <div className="bg-indigo-50/50 p-3.5 rounded-2xl text-left border border-[#D5E3FF]/70 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600 animate-pulse" /> Razorpay Gateway Integration
                      </p>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        razorpayKeyId && razorpayKeySecret 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                          : "bg-amber-100 text-amber-850 border border-amber-200"
                      }`}>
                        {razorpayKeyId && razorpayKeySecret ? "Active: Live Razorpay" : "Active: Sandbox Emulator"}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-550 leading-relaxed font-semibold">
                      Activate actual UPI payment options (Google Pay, PhonePe, Paytm APP, BHIM, Netbanking, Cards) in your live application container by entering your Razorpay credentials below.
                    </p>
                    
                    <div className="space-y-1.5 pt-1">
                      <div>
                        <label className="text-[8.5px] uppercase font-black text-stone-400">Razorpay Key ID</label>
                        <input
                          type="text"
                          value={razorpayKeyId}
                          onChange={(e) => {
                            setRazorpayKeyId(e.target.value);
                            localStorage.setItem("vani_razorpay_key_id", e.target.value);
                          }}
                          placeholder="e.g. rzp_test_yourKeyID"
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-stone-800 focus:outline-none focus:border-indigo-400 placeholder:text-stone-300"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] uppercase font-black text-stone-400">Razorpay Key Secret</label>
                        <input
                          type="password"
                          value={razorpayKeySecret}
                          onChange={(e) => {
                            setRazorpayKeySecret(e.target.value);
                            localStorage.setItem("vani_razorpay_key_secret", e.target.value);
                          }}
                          placeholder="••••••••••••••••••••••••"
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-stone-800 focus:outline-none focus:border-indigo-400 placeholder:text-stone-300"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          if (!razorpayKeyId || !razorpayKeySecret) {
                            alert("Please enter both Razorpay configuration values.");
                            return;
                          }
                          localStorage.setItem("vani_razorpay_key_id", razorpayKeyId);
                          localStorage.setItem("vani_razorpay_key_secret", razorpayKeySecret);
                          playTTS("Razorpay live Merchant parameters applied.", 12);
                          alert("✅ Done! Dynamic Razorpay Key credentials configured. All upcoming checkout flows will trigger your live/test Razorpay API gateway directly.");
                        }}
                        className="flex-1 py-1.5 text-[9px] font-extrabold uppercase text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                      >
                        Apply Credentials
                      </button>
                      <button
                        onClick={() => {
                          setRazorpayKeyId("");
                          setRazorpayKeySecret("");
                          localStorage.removeItem("vani_razorpay_key_id");
                          localStorage.removeItem("vani_razorpay_key_secret");
                          playTTS("Reset to standard checkout simulator.", 12);
                          alert("🗑️ Cleared successfully! The system has reverted to its standard secure sandbox checkout mode.");
                        }}
                        className="py-1.5 px-3.5 text-[9px] font-extrabold uppercase text-center border border-stone-200 bg-white text-stone-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                      >
                        Reset Demo
                      </button>
                    </div>
                  </div>

                  {/* Custom Gemini API Key Configuration Section */}
                  <div className="bg-purple-50/50 p-3.5 rounded-2xl text-left border border-purple-100 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] uppercase font-black text-purple-700 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" /> Custom Gemini API Key
                      </p>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        customGeminiKey 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}>
                        {customGeminiKey ? "Using Personal Key" : "Using Coach VANI Key"}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-550 leading-relaxed font-semibold">
                      Avoid system rate limits or high-demand delays by supplying your own custom Gemini API Key. It remains secure inside your local browser storage.
                    </p>
                    
                    <div className="space-y-1.5 pt-1">
                      <div>
                        <label className="text-[8.5px] uppercase font-black text-stone-400">Gemini API Key</label>
                        <input
                          type="password"
                          value={customGeminiKey}
                          onChange={(e) => {
                            setCustomGeminiKey(e.target.value);
                            localStorage.setItem("vani_custom_gemini_api_key", e.target.value);
                          }}
                          placeholder="AIzaSy..."
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-stone-800 focus:outline-none focus:border-purple-400 placeholder:text-stone-300"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          if (!customGeminiKey.trim()) {
                            alert("Please enter a valid Gemini API key first.");
                            return;
                          }
                          localStorage.setItem("vani_custom_gemini_api_key", customGeminiKey.trim());
                          playTTS("Your custom Gemini API Key has been applied.", 12);
                          alert("✅ Done! Custom Gemini API Key applied successfully. All your upcoming conversational sessions, translation requests, and pronunciation checks will run on your personal key.");
                        }}
                        className="flex-1 py-1.5 text-[9px] font-extrabold uppercase text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer"
                      >
                        Apply Key
                      </button>
                      <button
                        onClick={() => {
                          setCustomGeminiKey("");
                          localStorage.removeItem("vani_custom_gemini_api_key");
                          playTTS("Reverted to standard Coach VANI system key.", 12);
                          alert("🗑️ Cleared successfully! Reverted back to the default server-side Coach VANI system key.");
                        }}
                        className="py-1.5 px-3.5 text-[9px] font-extrabold uppercase text-center border border-stone-200 bg-white text-stone-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                      >
                        Clear Custom Key
                      </button>
                    </div>
                  </div>

                  {/* LOG OUT BUTTON */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsOtpLoggedIn(false);
                        setIsPhoneLoggedIn(false);
                        setReportOverlayOpen(false);
                        setScreen("onboarding");
                        setOnboardingSubStep("welcome");
                        playTTS("Logged out successfully from VANI.", 12);
                        setVoiceToastMessage("Logged Out Successfully");
                        setTimeout(() => setVoiceToastMessage(""), 2500);
                      }}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-650 border border-red-200 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <span className="text-sm">🚪</span> LOG OUT OF ACCOUNT
                    </button>
                  </div>

                  {/* ACCOUNT PROTECTION & LEGAL SECTION */}
                  <div className="pt-4 border-t border-stone-200 mt-4 space-y-3">
                    <h5 className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Account Protection & Terms</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setReportOverlayOpen(false);
                          setDeletionOverlayOpen(true);
                          setDeletionStep(1);
                          setDeletionReason("");
                          setDeletionChecked(false);
                        }}
                        className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Delete Account</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowTerms(true);
                        }}
                        className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Terms of Service</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container Content */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-16">
        
        {/* APP TOP HEADING BAR */}
        {screen !== "chat" && screen !== "onboarding" && (
          <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-stone-100 shrink-0">
            <button 
              onClick={() => setMenuOpen(true)}
              className="p-2 hover:bg-stone-50 rounded-lg active:scale-95 transition"
            >
              <Menu className="w-6 h-6 text-stone-800" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xl">👩‍🏫</span>
              <h1 className="text-xl font-black text-rose-500 tracking-tight">
                VANI <span className="text-indigo-600 font-extrabold text-[10px] ml-1 px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 uppercase tracking-widest leading-none inline-block align-middle">AI Coach</span>
              </h1>
            </div>

            <button 
              onClick={() => { setScreen("topics"); setSelectedTheme(null); }}
              className="bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 flex items-center gap-1.5 text-xs font-bold text-stone-600 shadow-xxs transition active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{progressPercent}% Done</span>
            </button>
          </div>
        )}

        {/* LOBBY / ONBOARDING SCREEN */}
        {screen === "onboarding" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "radial-gradient(circle at 50% 15%, #180828 0%, #050209 100%)",
              color: "white",
            }}
            className="p-5 flex-1 flex flex-col justify-between max-w-md mx-auto min-h-screen relative overflow-y-auto no-scrollbar font-sans select-none"
          >
            {/* STEP 1: WELCOME & DETAILS PROFILE CAPTURE */}
            {onboardingSubStep === "welcome" && (
              <div className="space-y-6 my-auto text-left py-4">
                {/* Brand Header */}
                <div className="text-center py-4 space-y-4 relative flex flex-col items-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-[#7C3AED]/20 to-[#EC4899]/10 rounded-full blur-2xl -z-10" />
                  
                  {/* Giant Avatar: Exactly 5x bigger than original w-14 h-14 (which is 56px * 5 = 280px) */}
                  <div 
                    style={{ width: "240px", height: "240px" }}
                    className="flex items-center justify-center rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#EC4899] text-white font-black shadow-2xl border-4 border-[#C4B5FD]/45 select-none animate-bounce"
                  >
                    <span style={{ fontSize: "105px", display: "block", transform: "translateY(-4px)" }}>👩‍🏫</span>
                  </div>

                  <div className="space-y-2 text-center w-full">
                    <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                      VANI <span className="text-white font-extrabold text-[10.5px] px-2 py-0.5 rounded-md bg-gradient-to-r from-[#7C3AED] to-[#EC4899] border border-purple-400/30 uppercase tracking-widest ml-1 inline-block align-middle shadow-sm">Smart AI Coach</span>
                    </h2>
                    <h3 className="text-sm font-bold text-[#C4B5FD] tracking-tight leading-snug">
                      Your premium, real-time interactive spoken English practice partner.
                    </h3>
                  </div>
                </div>

                {/* Simplified Policy Agreements and Terms Section */}
                <div className="space-y-3">
                  <div style={{
                    background: "rgba(10, 4, 18, 0.75)",
                    backdropFilter: "blur(20px)",
                    border: "2px solid rgba(139, 92, 246, 0.4)",
                    borderRadius: "24px",
                    padding: "18px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(139,92,246,0.15)",
                  }} className="space-y-3">
                    <span style={{ color: "#C4B5FD" }} className="text-[10px] uppercase font-black tracking-widest block font-bold mb-1">
                      Required Student Consents
                    </span>
                    
                    <div className="space-y-2.5">
                      {/* Terms & Conditions Option */}
                      <div 
                        onClick={() => setTermsAccepted(!termsAccepted)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer select-none pb-3 ${
                          termsAccepted ? "bg-purple-950/40 border-[#8B5CF6] text-white" : "bg-black/40 border-purple-900/40 text-stone-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-purple-600 border-purple-400 rounded focus:ring-purple-300 cursor-pointer"
                          />
                          <span className="text-xs font-semibold">I agree to the Terms & Conditions</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingTerms(!viewingTerms);
                            setViewingPrivacy(false);
                          }}
                          className="text-[9px] font-black uppercase text-purple-200 hover:underline px-2.5 py-1 bg-purple-900/60 rounded border border-purple-800/30"
                        >
                          {viewingTerms ? "Less" : "View"}
                        </button>
                      </div>

                      {/* Explicit Interactive Terms of Service Display Panel */}
                      {viewingTerms && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{ background: "rgba(5, 1, 10, 0.95)", border: "1px solid rgba(139, 92, 246, 0.3)" }}
                          className="p-3.5 rounded-xl text-[10.5px] font-medium text-purple-200 leading-normal space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 pr-1"
                        >
                          <p className="font-bold text-white border-b border-purple-900 pb-1 text-xs">📜 Complete Terms & Conditions Agreement</p>
                          
                          <div className="space-y-2.5">
                            <div>
                              <p className="font-extrabold text-stone-850">1. Acceptance of Terms</p>
                              <p className="text-stone-500 text-[10px]">
                                By accessing and using the Easy English app (a personal educational project by an independent developer), you acknowledge your agreement to adhere to these Terms and Conditions. Please review these terms carefully as they govern your use of this app. If any part is not agreeable to you, we request that you stop using it.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">2. Nature of This Project</p>
                              <p className="text-stone-500 text-[10px]">
                                Easy English with Coach VANI is an independent personal project developed by an individual developer. It is not owned or operated by any registered company or corporate entity. This app is built to help Indian learners improve their spoken English skills using AI technology.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">3. Subscription and Payment Options</p>
                              <p className="text-stone-500 text-[10px]">
                                When you start the 4-day trial period (₹7 for 4 days), approximately 30% of scenarios are open, but the translation portion (Express Translator & Language Bridge) and the Speak with VANI voice calling portion are blocked. After 4 days or on the 4th day, unless cancelled, the trial automatically renews at the subscription charge of ₹249 per month deducted from your account to the developer's bank account. Alternatively, you may choose the 6-Month Subscription discount plan at ₹199 per month (total ₹1,196 pre-paid) deducted to the developer's bank account. All scenarios, translation portions, and Speak with VANI voice calling are 100% unlocked upon active Monthly Premium or 6-Month subscription. Users may unsubscribe or cancel at any time.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">4. Refund and Cancellation Policy</p>
                              <p className="text-stone-500 text-[10px]">
                                All payments made are non-refundable once processed. You may cancel your subscription at any time. After cancellation, no further charges will be made and you will retain access until the end of your current billing period. Cancellation can be requested via the My Account section within the app.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">5. AI-Generated Content</p>
                              <p className="text-stone-500 text-[10px]">
                                Responses from Coach VANI are generated by an AI model. While every effort is made to ensure quality and accuracy, AI responses may occasionally contain errors. The developer does not guarantee 100% accuracy of all AI coaching advice, grammar corrections, or translations provided.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">6. Translation Services</p>
                              <p className="text-stone-500 text-[10px]">
                                The translation feature within this app translates Indian regional languages (Bengali, Hindi, Telugu, Tamil, Marathi, Odia, Punjabi, Gujarati, Kannada and Hinglish) strictly into English only. No other translation direction is supported. Translation accuracy depends on AI model capability and input clarity.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">7. User Responsibilities</p>
                              <p className="text-stone-500 text-[10px]">
                                You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You must not misuse the app, attempt to reverse engineer it, or use it for any purpose other than personal English language learning.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">8. User Conduct and Prohibited Activities</p>
                              <p className="text-stone-500 text-[10px]">
                                You may not use this app for any unlawful purpose, to harass others, to submit false information, to transmit malware, or to interfere with the app's security or functionality. Accounts found violating these rules may be suspended without refund.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">9. User Eligibility</p>
                              <p className="text-stone-500 text-[10px]">
                                This app is intended for users aged 13 and above. Users under 18 should use the app under parental or guardian supervision. The developer is not liable for misuse by underage users.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">10. Warranty Disclaimer & Liability</p>
                              <p className="text-stone-500 text-[10px]">
                                This app is provided on an as-is basis without warranties of any kind. The developer does not guarantee uninterrupted, error-free service. Use of this app is entirely at your own risk. The developer shall not be held liable for any direct, indirect, or consequential damages arising from use of this app.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">11. Intellectual Property</p>
                              <p className="text-stone-500 text-[10px]">
                                All content, design, code, and AI coaching material within Easy English is the intellectual property of the developer. Unauthorised reproduction, distribution, or commercial use of any part of this app is strictly prohibited.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">12. Termination</p>
                              <p className="text-stone-500 text-[10px]">
                                The developer reserves the right to suspend or terminate access to any user account that violates these terms. Users may also stop using the app at any time.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">13. Modifications to the Service</p>
                              <p className="text-stone-500 text-[10px]">
                                Features, pricing, and content of this app are subject to change without prior notice. The developer is not liable for any modification, suspension, or discontinuation of any part of the service.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">14. Dispute Resolution</p>
                              <p className="text-stone-500 text-[10px]">
                                Any disputes arising from use of this app shall be resolved amicably through direct communication. This app is governed by the laws of India. The courts of West Bengal shall have jurisdiction over any unresolved disputes.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Privacy Policy Option */}
                      <div 
                        onClick={() => setPrivacyAccepted(!privacyAccepted)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer select-none ${
                          privacyAccepted ? "bg-purple-950/40 border-[#8B5CF6] text-white" : "bg-black/40 border-purple-900/40 text-stone-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={privacyAccepted}
                            onChange={(e) => setPrivacyAccepted(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-purple-650 border-purple-400 rounded focus:ring-purple-300 cursor-pointer"
                          />
                          <span className="text-xs font-semibold">I agree to the Privacy Policy options</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPrivacy(!viewingPrivacy);
                            setViewingTerms(false);
                          }}
                          className="text-[9px] font-black uppercase text-purple-200 hover:underline px-2.5 py-1 bg-purple-900/60 rounded border border-purple-800/30"
                        >
                          {viewingPrivacy ? "Less" : "View"}
                        </button>
                      </div>

                      {/* Explicit Interactive Privacy Summary Panel */}
                      {viewingPrivacy && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{ background: "rgba(5, 1, 10, 0.95)", border: "1px solid rgba(139, 92, 246, 0.3)" }}
                          className="p-3.5 rounded-xl text-[10.5px] font-medium text-purple-200 leading-normal space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 pr-1"
                        >
                          <p className="font-bold text-white border-b border-purple-900 pb-1 text-xs">🔒 Complete Privacy Policy</p>
                          
                          <div className="space-y-2.5">
                            <div>
                              <p className="font-extrabold text-stone-850">Our Commitment</p>
                              <p className="text-stone-500 text-[10px]">
                                Easy English with Coach VANI is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your personal data.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">Information We Collect</p>
                              <p className="text-stone-500 text-[10px]">
                                We may collect your phone number or Google account email for login purposes only. We collect your in-app conversation data solely to provide the VANI coaching service. We collect basic usage data such as topics accessed and session duration to improve the learning experience.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">How We Use Your Data</p>
                              <p className="text-stone-500 text-[10px]">
                                Your data is used only to provide and improve the Easy English learning experience. Your conversation messages are sent to the AI model API to generate VANI's coaching responses. We do not sell, share, or transfer your personal data to any third party for commercial purposes.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">AI and API Data Processing</p>
                              <p className="text-stone-500 text-[10px]">
                                Messages you send to Coach VANI are processed by the Claude AI API (Anthropic). By using this app you acknowledge that your messages are transmitted to Anthropic's servers for processing. Please review Anthropic's own privacy policy at anthropic.com for details on how they handle data.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-[#1A1A1A]">Data Storage</p>
                              <p className="text-stone-500 text-[10px]">
                                This app currently stores session data in your device memory only during active use. No personal conversation data is permanently stored on external servers by this app. Subscription and payment data is handled by the respective payment gateway providers.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">Your Rights</p>
                              <p className="text-stone-500 text-[10px]">
                                You have the right to access, correct, or request deletion of your personal data at any time. You may stop using the app and request account deletion by contacting the developer directly.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">Children's Privacy</p>
                              <p className="text-stone-500 text-[10px]">
                                This app is not directed to children under the age of 13. If you believe a child under 13 has used this app without consent, please contact us so we can take appropriate action.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">Changes to This Policy</p>
                              <p className="text-stone-500 text-[10px]">
                                This privacy policy may be updated from time to time. Continued use of the app after changes constitutes acceptance of the updated policy. Users are encouraged to review this policy periodically.
                              </p>
                            </div>

                            <div>
                              <p className="font-extrabold text-stone-850">Contact</p>
                              <p className="text-stone-500 text-[10px]">
                                This is a personal independent project. For any privacy concerns, queries, or data deletion requests, please contact the developer directly through the Help section within the app.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {!termsAccepted || !privacyAccepted ? (
                      <p className="text-[10px] text-rose-400 font-extrabold animate-pulse text-center leading-normal">
                        ⚠️ Please agree to both the Terms & Conditions and Privacy Policy options to continue.
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-400 font-extrabold text-center leading-normal">
                        ✅ Agreements verified. Ready to start simulated practices!
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!termsAccepted || !privacyAccepted) {
                        playTTS("Please accept our terms and conditions and privacy policy options to open your student account.", 999);
                        return;
                      }
                      playTTS("Welcome to VANI! Please enter your mobile number to continue with your secure student account creation.", 999);
                      setOnboardingSubStep("phone");
                    }}
                    disabled={!termsAccepted || !privacyAccepted}
                    style={{
                      background: (!termsAccepted || !privacyAccepted) ? "#4B3E56" : "linear-gradient(135deg, #7C3AED, #A78BFA)",
                      boxShadow: (!termsAccepted || !privacyAccepted) ? "none" : "0 6px 20px rgba(124, 58, 237, 0.45)"
                    }}
                    className="w-full py-4 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 duration-150 cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Proceed to Mobile Login 📱</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: MOBILE NUMBER LOGIN INPUT */}
            {onboardingSubStep === "phone" && (
              <div className="space-y-6 my-auto text-left py-6">
                <div className="text-center py-2 space-y-2">
                  <div style={{ background: "rgba(124, 58, 237, 0.22)", border: "1.5px solid rgba(139, 92, 246, 0.55)" }} className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-purple-300 font-bold text-2xl mb-1">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none font-bold">
                    Enter Mobile Number
                  </h3>
                  <p className="text-xs text-stone-300 font-medium">
                    Please enter your mobile number to continue.
                  </p>
                </div>

                <div style={{
                  background: "rgba(10, 4, 18, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(139, 92, 246, 0.4)",
                  borderRadius: "24px",
                  padding: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(139,92,246,0.15)",
                }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label style={{ color: "#C1B5FD" }} className="text-[10px] uppercase font-black tracking-widest block font-bold">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <div style={{ background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.35)" }} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-purple-200 select-none shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input 
                        type="tel"
                        maxLength={10}
                        value={phoneInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setPhoneInput(val);
                          setPhoneNumberError("");
                        }}
                        placeholder="70034 50921"
                        style={{ background: "rgba(0, 0, 0, 0.45)", border: "1.5px solid rgba(139, 92, 246, 0.4)" }}
                        className="w-full focus:border-purple-400 focus:ring-1 focus:ring-purple-300 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition focus:outline-none placeholder:text-stone-500"
                      />
                    </div>
                    {phoneNumberError && (
                      <p className="text-[10px] text-rose-400 font-bold">{phoneNumberError}</p>
                    )}
                  </div>

                  <p className="text-[10px] text-stone-300 font-semibold leading-relaxed">
                    By entering, you confirm registration under active Indian cellular services. A secure one-time passcode will be sent.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      if (phoneInput.length < 10) {
                        setPhoneNumberError("Please enter a valid 10-digit mobile number.");
                        return;
                      }
                      setOtpLoading(true);
                      setTimeout(() => {
                        const code = Math.floor(1000 + Math.random() * 9000).toString();
                        setOnboardingGeneratedOtp(code);
                        setOtpLoading(false);
                        const cleanFormattedPhone = `+91 ${phoneInput.substring(0,5)} ${phoneInput.substring(5)}`;
                        setOtpSentLabel(cleanFormattedPhone);
                        setOnboardingSubStep("otp");
                        playTTS("We’ve sent a secure OTP code to your mobile number for verification.", 999);
                        alert(`🔐 VANI Secure Onboarding\nAn OTP has been sent via SMS to +91 ${phoneInput}.\nYour actual One-Time Passcode is: ${code}`);
                      }, 900);
                    }}
                    disabled={otpLoading}
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
                      boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)"
                    }}
                    className="w-full py-3.5 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-98"
                  >
                    {otpLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Security OTP 🚀</span>
                        <Send className="w-3.5 h-3.5 text-purple-255 text-purple-200 animate-pulse" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setOnboardingSubStep("welcome")}
                    className="w-full py-2.5 text-purple-300 hover:text-purple-100 text-xs font-bold text-center underline block cursor-pointer"
                  >
                    ← Back to Details Setup
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: OTP VERIFICATION CODE */}
            {onboardingSubStep === "otp" && (
              <div className="space-y-6 my-auto text-left py-6">
                <div className="text-center py-2 space-y-2">
                  <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid rgba(16, 185, 129, 0.4)" }} className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-emerald-400 font-bold text-2xl mb-1">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none font-bold">
                    Security Verification
                  </h3>
                  <p className="text-xs text-stone-300 font-medium">
                    We’ve sent a secure OTP to your number for verification.
                  </p>
                  <p style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 18.5, 129, 0.45)" }} className="text-xxs font-extrabold text-emerald-300 uppercase tracking-widest rounded-full py-0.5 px-3 inline-block">
                    Sent to {otpSentLabel || "+91 Mobile"}
                  </p>
                </div>

                <div style={{
                  background: "rgba(10, 4, 18, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(139, 92, 246, 0.4)",
                  borderRadius: "24px",
                  padding: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(139,92,246,0.15)",
                }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label style={{ color: "#C1B5FD" }} className="text-[10px] uppercase font-black tracking-widest block font-bold">
                      Enter 4-Digit One Time Passcode
                    </label>
                    <div className="flex flex-col gap-2 justify-center items-center">
                      <input 
                        type="text"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setOtpInput(val);
                          setOtpError("");
                        }}
                        placeholder="Enter Code"
                        style={{
                          background: "rgba(0, 0, 0, 0.55)",
                          border: "2.5px solid #8B5CF6",
                          letterSpacing: "0.2em"
                        }}
                        className="w-36 text-center focus:border-purple-300 focus:ring-1 focus:ring-purple-200 rounded-xl px-2 py-2.5 text-base font-black text-white transition focus:outline-none placeholder:tracking-normal placeholder:text-xxs placeholder:font-bold placeholder:text-stone-600"
                      />
                      <div className="text-[10px] bg-purple-950/90 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-lg mt-1 font-bold flex items-center gap-1">
                        <span>🔑 SMS Passcode:</span>
                        <span className="text-emerald-400 font-extrabold font-mono tracking-wider text-xs">{onboardingGeneratedOtp || "Calculating..."}</span>
                      </div>
                    </div>
                    {otpError && (
                      <p className="text-[10px] text-rose-400 font-bold text-center">{otpError}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xxs text-stone-300 font-semibold pt-1">
                    <span>Didn't receive passcode?</span>
                    <button 
                      onClick={() => {
                        const code = Math.floor(1000 + Math.random() * 9000).toString();
                        setOnboardingGeneratedOtp(code);
                        alert(`🔐 VANI Secure Resend\nYour actual One-Time Passcode is: ${code}`);
                        playTTS("A new OTP code has been sent to your mobile.", 999);
                      }}
                      className="text-purple-300 text-xxs font-black hover:underline cursor-pointer"
                    >
                      Resend OTP Code 🔄
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      if (!otpInput) {
                        setOtpError("Please enter the 4-digit code.");
                        return;
                      }
                      if (otpInput !== onboardingGeneratedOtp) {
                        setOtpError("Incorrect OTP passcode entered.");
                        return;
                      }
                      setOtpLoading(true);
                      setTimeout(() => {
                        setOtpLoading(false);
                        setIsPhoneLoggedIn(true);
                        setIsOtpLoggedIn(true);
                        setOnboardingSubStep("trial_offer");
                        playTTS("Congratulations! Log in successful. Let's start your premium English speaking training now.", 999);
                      }, 950);
                    }}
                    disabled={otpLoading}
                    style={{
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      boxShadow: "0 6px 20px rgba(16,185,129,0.3)"
                    }}
                    className="w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    {otpLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Log In Securely 🎉</span>
                        <Unlock className="w-3.5 h-3.5 text-emerald-100" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setOnboardingSubStep("phone")}
                    className="w-full py-2.5 text-purple-300 hover:text-purple-100 text-xs font-bold text-center underline block cursor-pointer"
                  >
                    Change phone number
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PREMIUM TRIAL OFFER CARD SCREEN */}
            {onboardingSubStep === "trial_offer" && (
              <div className="space-y-5 my-auto text-left py-2 font-sans">
                {/* Header Badge */}
                <div style={{
                  background: "rgba(10, 4, 18, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid #FF6B2B",
                  borderRadius: "24px",
                  padding: "18px",
                  boxShadow: "0 10px 30px rgba(255, 107, 43, 0.15), inset 0 0 15px rgba(255,107,43,0.1)",
                }} className="text-center py-4 space-y-2">
                  <span style={{ background: "linear-gradient(135deg, #FF6B2B, #F97316)" }} className="inline-flex items-center gap-1 px-3 py-1 text-white font-black text-[9.5px] rounded-full uppercase tracking-widest leading-none shadow-md animate-pulse mb-1">
                    👑 Exclusive VANI Trial Invitation
                  </span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug px-1">
                    🎉 Start Your English Speaking Journey Today
                  </h3>
                  <p className="text-sm text-[#FF8A50] font-black leading-relaxed px-2">
                    Get 4 Days VIP Trial Access for only ₹7
                  </p>
                </div>

                {/* Grid checklist of premium assets requested */}
                <div style={{
                  background: "rgba(10, 4, 18, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(139, 92, 246, 0.45)",
                  borderRadius: "24px",
                  padding: "18px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(139,92,246,0.15)",
                }} className="space-y-3.5">
                  <div className="flex justify-between items-center border-b border-purple-900/40 pb-2">
                    <span style={{ color: "#E9D5FF" }} className="text-[10px] uppercase font-black tracking-widest block select-none">
                      💎 Premium Benefits (₹249/mo value)
                    </span>
                    <span style={{ background: "rgba(167, 139, 250, 0.15)", color: "#FF6B2B" }} className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-purple-800/30">
                      ₹249 Subscription
                    </span>
                  </div>

                  {/* 11 premium benefits list beautifully rendered in colorful grid/list with custom scrollbar */}
                  <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 no-scrollbar select-none">
                    {[
                      { title: "Unlimited AI Speaking Practice", active: true },
                      { title: "40+ Real-Life Conversation Scenarios", active: true },
                      { title: "Live Pronunciation Analysis", active: true },
                      { title: "Grammar Correction Engine", active: true },
                      { title: "Business English Training", active: true },
                      { title: "Interview Preparation", active: true },
                      { title: "AI Voice Station Access", active: true },
                      { title: "Daily Progress Reports", active: true },
                      { title: "Vocabulary Booster Tools", active: true },
                      { title: "Regional Language Translation Support", active: true },
                      { title: "Continuous Feature Updates", active: true },
                    ].map((benefit, i) => (
                      <div key={i} className="flex gap-2.5 items-center text-xs font-semibold py-1 px-1.5 rounded-lg bg-purple-950/20 border border-purple-900/20 hover:border-purple-800/40 transition duration-150">
                        <span className="text-emerald-400 text-xs shrink-0 leading-none">✅</span>
                        <span className="text-white font-medium text-[11.5px] leading-tight">{benefit.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Auto-Renewal Plan Option */}
                  <div className="space-y-2.5 pt-2 border-t border-purple-900/35">
                    <span style={{ color: "#E9D5FF" }} className="text-[10.5px] uppercase font-black tracking-wider block select-none">
                      🔄 Choose Your Renewal Plan (After 4 Days)
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          setTrialAutoRenewPlan('monthly');
                          playTTS("You have selected the 1 month subscription renewal at ₹249 per month after trial.", 999);
                        }}
                        style={{
                          background: trialAutoRenewPlan === 'monthly' ? "rgba(139, 92, 246, 0.25)" : "rgba(10, 4, 18, 0.4)",
                          borderColor: trialAutoRenewPlan === 'monthly' ? "#8B5CF6" : "rgba(139, 92, 246, 0.2)",
                        }}
                        className="p-3 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between h-20 hover:border-purple-400 select-none"
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-[9.5px] font-black text-purple-300 uppercase tracking-wider">1 Month</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${trialAutoRenewPlan === 'monthly' ? 'border-purple-400' : 'border-stone-600'}`}>
                            {trialAutoRenewPlan === 'monthly' && <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-black text-sm">₹249<span className="text-[9px] text-stone-400 font-normal">/mo</span></div>
                          <div className="text-[8.5px] text-stone-400 font-bold leading-none">Standard Pass</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setTrialAutoRenewPlan('six_month');
                          playTTS("You have selected the 6 months subscription renewal at ₹199 per month after trial.", 999);
                        }}
                        style={{
                          background: trialAutoRenewPlan === 'six_month' ? "rgba(249, 115, 22, 0.15)" : "rgba(10, 4, 18, 0.4)",
                          borderColor: trialAutoRenewPlan === 'six_month' ? "#F97316" : "rgba(139, 92, 246, 0.2)",
                        }}
                        className="p-3 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between h-20 hover:border-orange-400 relative overflow-hidden select-none"
                      >
                        <div className="absolute top-0 right-0 bg-orange-500 text-white font-black text-[6.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-bl-lg">
                          Save 20%
                        </div>
                        <div className="flex justify-between items-start w-full">
                          <span className="text-[9.5px] font-black text-orange-400 uppercase tracking-wider">6 Months</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${trialAutoRenewPlan === 'six_month' ? 'border-orange-400' : 'border-stone-600'}`}>
                            {trialAutoRenewPlan === 'six_month' && <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-black text-sm">₹199<span className="text-[9px] text-stone-400 font-normal">/mo</span></div>
                          <div className="text-[8.5px] text-stone-400 font-bold leading-none">₹1,196 pre-paid</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Auto renewal terms (Strictly required notice) */}
                  <div style={{ background: "rgba(255, 107, 43, 0.08)", border: "1.5px solid rgba(255, 107, 43, 0.3)" }} className="pt-3 rounded-2xl p-3 text-center space-y-1.5">
                    <span className="text-[11px] font-black text-[#FF6B2B] block">💳 VIP 4-Day Trial: Only ₹7.00 today</span>
                    <p className="text-[9.5px] text-stone-300 font-medium leading-normal block">
                      Auto-renews at {trialAutoRenewPlan === 'monthly' ? (
                        <>
                          <strong className="text-white font-extrabold underline">₹249 per month</strong> (1-Month Pass)
                        </>
                      ) : (
                        <>
                          <strong className="text-white font-extrabold underline">₹199 per month</strong> (₹1,196 billed every 6 Months)
                        </>
                      )} after the 4-day trial unless cancelled before renewal. Complete trial goals with unlimited access!
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <button
                    onClick={() => {
                      playTTS("Secure checkout initiated. Choose your UPI app or enter your custom UPI ID to activate your four-day VIP trial.", 999);
                      setOnboardingSubStep("upi_payment");
                    }}
                    style={{
                      background: "linear-gradient(135deg, #FF6B2B, #7C3AED)",
                      boxShadow: "0 6px 20px rgba(255, 107, 43, 0.35)"
                    }}
                    className="w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2.5 cursor-pointer hover:brightness-110 active:scale-98"
                  >
                    <span>Activate 4-Day VIP Trial (₹7 Only) ⚡</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: UPI PAYMENT SCREEN METRIC */}
            {onboardingSubStep === "upi_payment" && (
              <div className="space-y-5 my-auto text-left py-4">
                <div className="text-center py-2 space-y-1 bg-stone-900 text-white rounded-3xl p-5 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-20 rotate-45" />
                  <span className="text-stone-400 font-bold text-xxs uppercase tracking-widest block">🔒 Pay securely via BHIM UPI</span>
                  <div className="text-2xl font-black text-white mt-1">₹7.00</div>
                  <p className="text-[10px] text-emerald-400 font-extrabold tracking-wider mt-1 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 fill-emerald-400 stroke-none" /> VANI PRESET VERIFIED MERCHANT
                  </p>
                </div>

                {/* Method selector */}
                <div className="bg-white p-4.5 rounded-3xl border border-stone-150 shadow-xxs space-y-4">
                  <span className="text-[10px] uppercase font-black tracking-widest text-stone-500 block">
                    Choose Your Favorite UPI Mobile App
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "gpay", label: "Google Pay", color: "border-blue-200 text-blue-700 bg-blue-50/20", icon: "🟢" },
                      { id: "phonepe", label: "PhonePe", color: "border-purple-200 text-purple-700 bg-purple-50/20", icon: "🟣" },
                      { id: "paytm", label: "Paytm APP", color: "border-sky-205 border-sky-200 text-sky-700 bg-sky-50/20", icon: "🔵" },
                      { id: "bhim", label: "BHIM / Other", color: "border-emerald-200 text-emerald-700 bg-emerald-50/20", icon: "🟠" }
                    ].map((app) => {
                      const isSel = selectedUPIApp === app.id;
                      return (
                        <button
                           key={app.id}
                           onClick={() => {
                             setSelectedUPIApp(app.id);
                             setCustomVPA("");
                           }}
                           className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                             isSel 
                               ? "border-indigo-650 border-indigo-500 ring-2 ring-indigo-100 bg-white shadow-xs font-black" 
                               : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700"
                           }`}
                        >
                          <span className="text-base">{app.icon}</span>
                          <span className="text-xs">{app.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual UPI VPA entry */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-500 block">
                      Or entering manual UPI Address / VPA ID
                    </label>
                    <input 
                      type="text"
                      value={customVPA}
                      onChange={(e) => {
                        setCustomVPA(e.target.value);
                        setSelectedUPIApp("custom");
                      }}
                      placeholder="e.g. Priyanshu@oksbi, anya@ybl"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 transition focus:outline-none placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      triggerRazorpayPayment("trial", 7, "4-Day VIP Trial", () => {
                        localStorage.setItem("trialAutoRenewPlan", trialAutoRenewPlan);
                        setUserPlan("trial");
                        setTrialStartDate(Date.now());
                        setTrialDaysLeft(4);
                        setTrialExpired(false);
                        setSessionMsgCount(0);
                        setIsPremium(false); // trial is not yet full premium
                        setTrialTimeLeft(345600); // 4 days count
                        setOnboardingSubStep("success");
                        playTTS("Congratulations! Your four day premium trial has been successfully activated. Unlock thirty percent of top scenarios.", 999);
                        try {
                          confetti({
                            particleCount: 150,
                            spread: 80,
                            origin: { y: 0.6 }
                          });
                        } catch (e) {}
                      });
                    }}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <>
                      <span>Approve & Pay ₹7 securely 🔒</span>
                      <Unlock className="w-3.5 h-3.5 text-white" />
                    </>
                  </button>

                  <button
                    onClick={() => setOnboardingSubStep("trial_offer")}
                    className="w-full py-2.5 text-stone-500 text-xxs font-bold text-center underline hover:text-stone-700"
                  >
                    ← Back to premium trial options
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: TRIAL ACTIVATED SUCCESS! */}
            {onboardingSubStep === "success" && (
              <div className="space-y-6 my-auto text-left py-4">
                <div className="text-center py-4 space-y-3 relative">
                  {/* Glowing background circles */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
                  
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white font-black text-4xl shadow-lg border-2 border-white animate-bounce">
                    🎉
                  </div>
                  
                  <h3 className="text-xl font-black text-indigo-950 tracking-tight leading-none">
                    Congratulations!
                  </h3>
                  <p className="text-xs font-bold text-stone-700 tracking-tight">
                    Your ₹7 VIP Trial is active. You have unlocked selected English scenarios (~30% of app features). Other features will unlock on full Premium subscription.
                  </p>
                  
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-4 py-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mx-auto">
                    <Zap className="w-3.5 h-3.5 fill-emerald-500 stroke-none" />
                    Trial active — 4 Days left
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-150 shadow-xxs space-y-4">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#D81B60] block">
                    Your Student Access Status:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-stone-705 select-none">
                    {[
                      { icon: "📖", label: "30% Scenarios Unlocked" },
                      { icon: "💬", label: "Interactive VANI Chat" },
                      { icon: "🔊", label: "Pronunciation Feedback" },
                      { icon: "🔒", label: "Voice Calling Locked" },
                      { icon: "🔒", label: "70% Scenarios Locked" },
                      { icon: "🔒", label: "STAR Interview Locked" }
                    ].map((perk, i) => (
                      <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 ${perk.icon === "🔒" ? "bg-stone-50 border-stone-100 text-stone-400" : "bg-emerald-50/50 border-emerald-150 text-emerald-950 font-bold"}`}>
                        <span className="text-base shrink-0">{perk.icon}</span>
                        <span className="text-[9px] uppercase font-black tracking-tight leading-3 block">{perk.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      localStorage.setItem("vani_onboarding_completed", "true");
                      setScreen("home");
                    }}
                    className="w-full py-4 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:opacity-95 active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <span>Enter Personalized VANI Dashboard ✨</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
        {screen === "home" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-[#f2f5f9] min-h-screen text-stone-800 pb-20 p-4 space-y-4"
          >
            {/* Top clean header */}
            <div className="flex items-center justify-between py-1 bg-transparent select-none">
              <div className="text-left">
                <h1 className="text-xl font-black text-indigo-950 tracking-tight leading-none">VANI Dashboard</h1>
                <p className="text-[10px] text-stone-500 font-bold mt-1">Your Personal English Speaking Coach</p>
              </div>

              {/* Pill shaped interactive Report Button */}
              <button 
                onClick={() => setReportOverlayOpen(true)}
                className="border border-sky-200/50 shadow-[0_2px_8px_rgba(14,165,233,0.1)] px-4 py-1.5 rounded-full bg-white text-sky-600 font-extrabold text-xs flex items-center gap-1.5 hover:bg-sky-50 active:scale-95 transition"
              >
                <span>📈 Progress Report</span>
              </button>
            </div>

            {/* Coach Speaking Goal - Live on entry */}
            <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 rounded-3xl text-white text-left flex flex-col justify-between gap-3.5 shadow-md shadow-rose-200 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between z-10">
                <div className="space-y-1">
                  <p className="text-[9.5px] uppercase font-black tracking-widest flex items-center gap-1.5 opacity-90 text-rose-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>✓ Live Coach Speaking Goal</span>
                  </p>
                  <h3 className="text-sm font-black tracking-tight leading-none mt-1">
                    Progressing <span className="text-emerald-300 font-black">{dailyGoalDone} mins</span> of <span className="text-white font-black">{dailyGoalMins} mins</span> goal
                  </h3>
                </div>
                
                <button 
                  onClick={() => {
                    handleProgressStreak();
                  }}
                  className="flex items-center gap-1.5 bg-white hover:bg-rose-50 cursor-pointer px-3 py-1.5 rounded-xl text-rose-600 text-xxs font-black uppercase tracking-widest active:scale-95 transition-all duration-200"
                >
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-bounce" />
                  <span>{streak} Days Streak</span>
                </button>
              </div>

              {/* Live interactive progress bar & Goal adjuster */}
              <div className="pt-1.5 space-y-2 z-10 border-t border-rose-400/30">
                <div className="w-full bg-rose-700/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-300 to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (dailyGoalDone / dailyGoalMins) * 100)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-[10.5px] font-bold text-rose-100 pt-0.5">
                  <p>
                    {dailyGoalDone >= dailyGoalMins ? "🎉 Daily Goal Reached!" : `${dailyGoalMins - dailyGoalDone} mins left to unlock daily rewards`}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase opacity-75">Adjust Goal:</span>
                    <select 
                      value={dailyGoalMins} 
                      onChange={(e) => setDailyGoalMins(Number(e.target.value))}
                      className="bg-rose-700/80 border border-rose-500 rounded px-1.5 py-0.5 text-[9.5px] text-white focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      <option value={10}>10m</option>
                      <option value={15}>15m</option>
                      <option value={20}>20m</option>
                      <option value={30}>30m</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>



            {/* VANI Turbo / High Fidelity speaking switcher */}
            <div className="p-3 bg-white border border-stone-200 rounded-2xl shadow-xxs text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-xs select-none">⚡</span>
                  <div>
                    <h4 className="font-black text-stone-800 text-[10px] tracking-wide uppercase leading-none">VANI Speaking Speed</h4>
                    <p className="text-[9.5px] text-stone-500 mt-1.5 leading-tight">
                      {useInstantTurboVoice 
                        ? "⚡ Turbo Engine: INSTANT responses, 0ms lag!" 
                        : "🎙️ AI High-Fidelity: Premium synthesis audio."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-stone-50 border border-stone-250/20 p-1 rounded-xl self-end sm:self-auto shrink-0 font-sans">
                  <button
                    onClick={() => {
                      setUseInstantTurboVoice(true);
                      localStorage.setItem("vani_use_instant_voice", "true");
                      playTTS("Now using VANI Turbo speaking mode. Responses are instant!", 123);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-tight transition active:scale-95 ${
                      useInstantTurboVoice 
                        ? "bg-stone-900 text-white shadow-xxs" 
                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    Turbo (Instant)
                  </button>
                  <button
                    onClick={() => {
                      setUseInstantTurboVoice(false);
                      localStorage.setItem("vani_use_instant_voice", "false");
                      playTTS("Now using High Fidelity speaking mode. Responses are generated with rich premium tone.", 123);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-tight transition active:scale-95 ${
                      !useInstantTurboVoice 
                        ? "bg-stone-900 text-white shadow-xxs" 
                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    High-Fi AI
                  </button>
                </div>
              </div>
            </div>

            {/* NEW: Premium Language Bridge Launcher Card */}
            <div className="p-4 bg-gradient-to-r from-[#17171d] to-[#0A0A0E] border border-purple-500/20 rounded-3xl text-left shadow-lg shadow-[#BD53F4]/5 flex items-center justify-between gap-4 select-none relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-[#BD53F4]/10 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-1 z-10 w-full">
                <h3 className="text-sm font-black text-white uppercase tracking-tight leading-snug">Language Bridge</h3>
                <p className="text-[10.5px] text-stone-400 leading-normal max-w-sm mt-0.5">
                  Speak Bengali, Hindi, Tamil, Telugu, and more native thoughts directly to fluent English with smart enhancements and AI pronunciation advice!
                </p>
              </div>
              <button 
                onClick={() => {
                  if (!canUseTranslation()) {
                    const limitMsg = "The Language Bridge translation portion is blocked during the active Trial period. Upgrade to a Premium or 6-Month Discount plan to instantly translate Bengali, Hindi, and regional terms to English! Unsubscribe anytime.";
                    playTTS(limitMsg, 812);
                    alert(`🔒 Translation Center Blocked\n\n${limitMsg}`);
                    setBillingOverlayOpen(true);
                    return;
                  }
                  setScreen("bridge");
                  setSelectedTheme(null);
                }}
                className="px-4 py-2.5 bg-[#BD53F4] hover:bg-[#8B2FC9] text-white rounded-xl text-[10px] uppercase font-black tracking-wider shadow-sm transition-all active:scale-95 shrink-0 z-10"
              >
                Translate & Practice →
              </button>
            </div>

            {/* SECTION: 4 Curated Scenario Topics for Homepage */}
            <div className="space-y-3.5 text-left">
              <div className="flex justify-between items-baseline select-none">
                <h3 className="text-base font-black text-indigo-950 tracking-tight uppercase">Featured Scenarios</h3>
                <button 
                  onClick={() => {
                    setSelectedTheme(null);
                    setScreen("topics");
                  }}
                  className="text-[10px] font-black text-rose-500 hover:underline hover:text-rose-600 transition tracking-wider uppercase"
                >
                  See All →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: 1,
                    title: "Introduce Yourself",
                    theme: "About Yourself",
                    tag: "BEGINNER 👨‍🎓",
                    tagColor: "bg-teal-500",
                    desc: "Perfect your professional elevator pitch dynamically.",
                    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350&q=75",
                    item: topics.find(t => t.id === 1)
                  },
                  {
                    id: 10,
                    title: "Job Interview",
                    theme: "Interview Pro",
                    tag: "PRO PREP ⭐",
                    tagColor: "bg-amber-500",
                    desc: "Train for behavioral interviews & tough questions.",
                    img: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=350&q=75",
                    item: topics.find(t => t.id === 10)
                  },
                  {
                    id: 19,
                    title: "Office Chat",
                    theme: "Work Place",
                    tag: "OFFICE 💼",
                    tagColor: "bg-indigo-600",
                    desc: "Simulate small talk & daily business cooperation.",
                    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=350&q=75",
                    item: topics.find(t => t.id === 19)
                  },
                  {
                    id: 31,
                    title: "Meet Teacher",
                    theme: "Daily Life",
                    tag: "DAILY LIFE 🏫",
                    tagColor: "bg-rose-500",
                    desc: "Discuss exam scores & feedback with tutors gracefully.",
                    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=350&q=75",
                    item: topics.find(t => t.id === 31)
                  }
                ].map((scen) => {
                  return (
                    <div 
                      key={scen.id}
                      onClick={() => scen.item && openConversationTopic(scen.item)}
                      className="bg-white rounded-3xl overflow-hidden border border-stone-150 shadow-xxs cursor-pointer hover:shadow-sm hover:border-stone-250 transition duration-300 flex flex-col group text-left"
                    >
                      <div className="h-28 relative overflow-hidden select-none bg-stone-100">
                        <SafeImage 
                          src={scen.img} 
                          alt={scen.title} 
                          fallbackText={scen.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />
                        <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[7.5px] font-black text-white uppercase tracking-wider ${scen.tagColor}`}>
                          {scen.tag}
                        </span>
                      </div>
                      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white space-y-2">
                        <div>
                          <h4 className="text-[12px] font-black text-stone-900 tracking-tight leading-snug group-hover:text-rose-500 transition line-clamp-1">{scen.title}</h4>
                          <p className="text-[9px] text-stone-500 font-bold leading-relaxed line-clamp-2">{scen.desc}</p>
                        </div>
                        <div className="flex flex-col gap-2 pt-1 border-t border-stone-100 pt-1.5 mt-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-stone-400">{scen.theme}</span>
                            <span className="text-[10px] text-rose-500 font-black group-hover:translate-x-0.5 transition shrink-0">Speak →</span>
                          </div>
                          <button
                            id={`btn-quick-study-${scen.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (scen.item) {
                                openConversationTopic(scen.item, true);
                              }
                            }}
                            className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-white hover:text-white text-[8px] font-extrabold uppercase tracking-wide rounded-xl transition flex items-center justify-center gap-1 shadow-3xs hover:scale-101 active:scale-99"
                          >
                            <span>⚡ Quick Study</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CHOOSE CONVERSATION DIVIDER HEADER */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-stone-200"></div>
              <span className="text-[9px] font-black tracking-widest text-stone-400 uppercase">CHOOSE CONVERSATION</span>
              <div className="flex-1 h-px bg-stone-200"></div>
            </div>

            {/* Theme Filter grid formatted inside elegant white circular cards */}
            <div className="grid grid-cols-4 gap-2 py-1 select-none">
              {[
                { name: "About Yourself", count: topics.filter(t => t.theme === "About Yourself").length, icon: "👨‍👩‍👦", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&q=70" },
                { name: "Interview Pro",  count: topics.filter(t => t.theme === "Interview Pro").length,  icon: "👨‍💼", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=70" },
                { name: "Work Place",     count: topics.filter(t => t.theme === "Work Place").length,     icon: "💼", img: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=100&q=70" },
                { name: "Daily Life",     count: topics.filter(t => t.theme === "Daily Life").length,     icon: "💬", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&q=70" }
              ].map((theme) => {
                const isActive = homeActiveTheme === theme.name;
                return (
                  <button
                    key={theme.name}
                    onClick={() => {
                      setHomeActiveTheme(isActive ? null : theme.name);
                    }}
                    className="flex flex-col items-center group active:scale-95 transition text-center"
                  >
                    <div className={`w-14 h-14 rounded-full border overflow-hidden shadow-xxs relative flex items-center justify-center bg-stone-100 transition ${
                      isActive 
                        ? "ring-2 ring-rose-500 scale-102 border-rose-500 bg-rose-50/50" 
                        : "border-stone-250 ring-2 ring-stone-100 group-hover:ring-rose-200"
                    }`}>
                      <SafeImage src={theme.img} alt={theme.name} fallbackText={theme.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-indigo-950/15 group-hover:bg-transparent transition" />
                    </div>
                    <span className="text-[10px] font-black text-stone-700 mt-2 leading-tight tracking-tight max-w-[76px] truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Premium Interactive Scrollable Topics & Scenarios Browser Block */}
            <div className="space-y-3 bg-stone-50 border border-stone-200 p-3.5 rounded-[24px]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">🔍</span>
                <input
                  type="text"
                  value={homeSearchQuery}
                  onChange={(e) => setHomeSearchQuery(e.target.value)}
                  placeholder="Search 40+ conversation topics & questions..."
                  className="w-full bg-white pl-8 pr-7 py-2 rounded-xl text-xs font-semibold text-stone-850 outline-none border border-stone-200 focus:border-rose-400 placeholder:text-stone-400 focus:shadow-xs transition"
                />
                {homeSearchQuery && (
                  <button 
                    onClick={() => setHomeSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 font-extrabold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center px-0.5">
                <p className="text-[9px] font-black uppercase text-stone-400 tracking-wider">
                  {homeActiveTheme ? `${homeActiveTheme} Topics` : "All Topics"} 
                  {homeSearchQuery ? ` matching "${homeSearchQuery}"` : ""} ({filteredHomeTopics.length})
                </p>
                {(homeActiveTheme || homeSearchQuery) && (
                  <button
                    onClick={() => { setHomeActiveTheme(null); setHomeSearchQuery(""); }}
                    className="text-[9px] font-black text-rose-500 hover:underline uppercase tracking-wider"
                  >
                    Show All
                  </button>
                )}
              </div>

              {/* Scrollable grid listing all options */}
              <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2 no-scrollbar scroll-smooth" id="home-questions-scroll-panel">
                {filteredHomeTopics.length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-stone-150 text-center text-stone-500 text-xs font-semibold">
                    No conversation scenarios matched the active filters.
                  </div>
                ) : (
                  filteredHomeTopics.map((t) => {
                    const isSubLocked = !canAccess(t.id - 1);
                    const isLocked = t.locked || isSubLocked;
                    return (
                      <div 
                        key={t.id}
                        onClick={() => openConversationTopic(t)}
                        className={`flex items-center gap-3 bg-white p-2.5 rounded-xl border transition duration-150 relative ${
                          isLocked 
                            ? "opacity-65 bg-stone-50 border-stone-150 cursor-pointer hover:border-rose-350" 
                            : "border-stone-150 hover:border-rose-300 hover:shadow-xxs cursor-pointer active:scale-99"
                        }`}
                      >
                        <SafeImage src={t.img} alt={t.title} fallbackText={t.title} className="w-10 h-10 rounded-lg object-cover shrink-0 select-none bg-stone-100" />
                        
                        <div className="flex-1 text-left min-w-0">
                          <span className="text-[7.5px] font-black text-stone-450 tracking-wider uppercase">
                            {isSubLocked ? "🔒 Subscription Locked" : t.cat}
                          </span>
                          <h4 className="font-extrabold text-[11px] text-stone-850 leading-none truncate mt-0.5">{t.title}</h4>
                          <span className="text-[7.5px] text-[#137333] font-bold block mt-1 uppercase tracking-wide">Theme: {t.theme}</span>
                        </div>

                        <div className="shrink-0 flex items-center justify-center p-1 select-none text-[9.5px] font-black text-rose-500 pr-2">
                          {t.done ? (
                            <span className="text-emerald-500 font-bold bg-emerald-50 px-1 py-0.5 rounded text-[8px] uppercase">Practiced ✓</span>
                          ) : isLocked ? (
                            <div className="flex items-center gap-1 bg-stone-105 text-stone-500 px-1.5 py-0.5 rounded text-[8px] uppercase">
                              <Lock className="w-2.5 text-stone-400" />
                              {isSubLocked ? "Unlock" : t.locked ? "Prereq" : "Lock"}
                            </div>
                          ) : (
                            <span className="flex items-center gap-0.5">
                              Speak
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section: Latest & Trending Yellow-to-Cyan Gradient Banner */}
            <div 
              onClick={() => {
                openConversationTopic({ 
                  id: 0, 
                  title: "Talk About Anything", 
                  cat: "Speaking", 
                  theme: "General", 
                  locked: false, 
                  done: false, 
                  img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=75" 
                });
                playTTS("Let's talk in English! You can type in any regional Indian language or Hinglish, and VANI will automatically translate it for you inside the chat.", 999);
              }}
              className="bg-gradient-to-r from-amber-100 via-amber-50 to-cyan-100 border border-amber-200/40 rounded-3xl p-5 shadow-sm text-left relative overflow-hidden flex gap-4 items-center justify-between cursor-pointer hover:shadow-md transition"
            >
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl" />
              <div className="space-y-1 relative z-10 max-w-[70%]">
                <span className="px-2 py-0.5 bg-amber-500 text-stone-900 rounded font-black text-[7px] uppercase tracking-wider">NEW MODULE</span>
                <h4 className="text-sm font-black text-stone-950">Latest & Trending</h4>
                <p className="text-[10px] text-stone-600 font-bold leading-snug">Things people are talking about. Practice translating localized ideas to smart English!</p>
              </div>

              {/* Stacked visually engaging cards */}
              <div className="relative w-16 h-12 shrink-0 select-none">
                <div className="absolute top-0 right-0 w-11 h-11 bg-white p-0.5 rounded-lg shadow-md border border-stone-150 rotate-12 transform">
                  <SafeImage src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=80&q=60" alt="Finance" fallbackText="HDFC" className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="absolute top-1 right-2 w-11 h-11 bg-white p-0.5 rounded-lg shadow-md border border-stone-150 -rotate-12 transform">
                  <SafeImage src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&q=60" alt="Workplace" fallbackText="Nestle" className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="absolute top-2 right-4 w-11 h-11 bg-white p-0.5 rounded-lg shadow-lg border border-stone-150 rotate-3 transform">
                  <SafeImage src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=80&q=60" alt="Local" fallbackText="Farmer" className="w-full h-full object-cover rounded-md" />
                </div>
              </div>
            </div>


          </motion.div>
        )}

        {/* SCREEN 2: ALL TOPICS PAGE */}
        {screen === "topics" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col bg-[#e6f4ea] min-h-screen text-stone-800 pb-36 p-5 space-y-6 text-left animate-fade-in"
          >
            {/* Header section with completion progress derived from Screenshot 1 */}
            <div>
              <div className="flex justify-between items-baseline select-none">
                <div>
                  <h2 className="text-3xl font-black text-[#137333] tracking-tight animate-pulse">Topics</h2>
                  <p className="text-[12px] text-stone-600 font-bold mt-1">Completed Topics</p>
                </div>
                {/* Big Bold Red Badge */}
                <div className="text-4xl font-serif italic text-rose-500 font-black tracking-tighter filter drop-shadow-sm pr-1">
                  {completedCount}
                </div>
              </div>
              
              {/* Minty beautiful slider progress bar */}
              <div className="w-full bg-white h-3 rounded-full mt-3 overflow-hidden shadow-inner border border-emerald-100/50 flex">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  style={{ width: `${progressPercent || 3}%` }}
                />
              </div>
            </div>

             {/* VOCAB LAB BANNER ON TOPICS SCREEN */}
             <div 
               onClick={() => {
                 setPracticeInitialTab("vocab_lab");
                 setScreen("practice");
               }}
               className="vocab-lab-banner"
              style={{
                padding       : "18px",
                background    : "linear-gradient(135deg,#1A1A1A,#2A1A0F)",
                border        : "1px solid #FF8C4A",
                borderRadius  : "16px",
                cursor        : "pointer",
                display       : "flex",
                alignItems    : "center",
                gap           : "14px",
              }}
            >
              <div style={{
                width           : "48px",
                height          : "48px",
                borderRadius   : "12px",
                background      : "linear-gradient(135deg,#FF6B2B,#FF8C55)",
                display         : "flex",
                alignItems     : "center",
                justifyContent : "center",
                fontSize       : "24px",
                flexShrink     : 0,
              }}>📘</div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize     : "15px",
                  fontWeight   : "bold",
                  color         : "#FFFFFF",
                  fontFamily   : "Poppins, sans-serif",
                }}>Vocabulary & Grammar Lab</div>
                <div style={{
                  fontSize     : "12px",
                  color         : "#B0B0B0",
                  fontFamily   : "Poppins, sans-serif",
                  marginTop    : "2px",
                }}>Master modal verbs, phrasal verbs and real-life phrases with VANI</div>
              </div>
              
              <div style={{
                color         : "#FF8C4A",
                fontSize      : "18px",
              }}>→</div>
            </div>

            {/* RECOMMENDED FOR YOU HORIZONTAL SCROLL LIST */}
            <div className="space-y-3 animate-slide-left">
              <h3 className="text-base font-black text-emerald-950 tracking-tight">Recommended for you</h3>
              <div className="flex gap-3.5 overflow-x-auto pb-2.5 no-scrollbar scroll-smooth select-none">
                {[
                  {
                    id: 1,
                    title: "Introduce Yourself",
                    cat: "Speaking",
                    theme: "About Yourself",
                    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350&q=75",
                    item: topics.find(t => t.id === 1)
                  },
                  {
                    id: 10,
                    title: "Job Interview",
                    cat: "Speaking",
                    theme: "Interview Pro",
                    img: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=350&q=75",
                    item: topics.find(t => t.id === 10)
                  },
                  {
                    id: 23,
                    title: "Make New Friends",
                    cat: "Speaking",
                    theme: "Daily Life",
                    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=350&q=75",
                    item: topics.find(t => t.id === 23)
                  }
                ].map((rec) => {
                  return (
                    <div 
                      key={rec.id}
                      onClick={() => rec.item && openConversationTopic(rec.item)}
                      className="w-48 bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-xxs shrink-0 cursor-pointer hover:shadow-md transition duration-200 active:scale-98 text-left"
                    >
                      <div className="h-28 overflow-hidden select-none bg-stone-150">
                        <SafeImage src={rec.img} alt={rec.title} fallbackText={rec.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 bg-white">
                        <h5 className="font-extrabold text-stone-850 text-xs leading-snug tracking-tight truncate">{rec.title}</h5>
                        <span className="text-[10px] font-extrabold text-[#137333] uppercase tracking-wide mt-2 block">{rec.cat}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* THEMES CIRCULAR SELECTORS */}
            <div className="space-y-3 select-none animate-fade-in">
              <h3 className="text-base font-black text-emerald-950 tracking-tight">Themes</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { name: "About Yourself", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&q=75" },
                  { name: "Interview Pro",  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=75" },
                  { name: "Work Place",     img: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=100&q=75" },
                  { name: "Daily Life",     img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&q=75" }
                ].map((th) => {
                  const count = topics.filter(t => t.theme === th.name).length;
                  const isSelect = selectedTheme === th.name;
                  return (
                    <button
                      key={th.name}
                      onClick={() => setSelectedTheme(selectedTheme === th.name ? null : th.name)}
                      className="flex flex-col items-center group transition"
                    >
                      <div className={`w-14 h-14 rounded-full border border-stone-250 overflow-hidden shadow-xxs flex items-center justify-center transition ${
                        isSelect ? "ring-2 ring-emerald-500 scale-102" : "ring-2 ring-stone-100"
                      }`}>
                        <SafeImage src={th.img} alt={th.name} fallbackText={th.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10.5px] font-black text-stone-800 tracking-tight mt-2 block truncate w-full">{th.name}</span>
                      <span className="text-[8.5px] text-stone-500 font-bold block mt-0.5">{count} Topics</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ALL TOPICS LIST CATALOG */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-emerald-950 tracking-tight">
                {selectedTheme ? `${selectedTheme} Topics` : "All Topics"}
              </h3>
              
              <div className="space-y-2.5">
                {topics
                  .filter(t => !selectedTheme || t.theme === selectedTheme)
                  .map((t) => {
                    const isSubLocked = !canAccess(t.id - 1);
                    const isLocked = t.locked || isSubLocked;
                    return (
                      <div 
                        key={t.id}
                        onClick={() => openConversationTopic(t)}
                        className={`flex items-center gap-3.5 bg-white p-3 rounded-2xl border transition duration-150 relative ${
                          isLocked 
                            ? "opacity-65 bg-stone-50 border-stone-205 cursor-pointer hover:border-emerald-350" 
                            : "border-stone-150 shadow-xxs hover:border-emerald-300 hover:shadow-xs cursor-pointer active:scale-99"
                        }`}
                      >
                        <SafeImage src={t.img} alt={t.title} fallbackText={t.title} className="w-14 h-14 rounded-xl object-cover shrink-0 select-none bg-stone-100" />
                        
                        <div className="flex-1 text-left min-w-0">
                          <span className="text-[9px] font-black text-stone-400 tracking-wider uppercase">
                            {isSubLocked ? "🔒 Subscription Locked" : t.cat}
                          </span>
                          <h4 className="font-extrabold text-xs text-stone-850 leading-snug truncate mt-0.5">{t.title}</h4>
                          <p className="text-[9px] text-[#0f5132] font-bold tracking-tight uppercase mt-1">Theme: {t.theme}</p>
                        </div>

                        <div className="shrink-0 flex items-center justify-center p-1 select-none">
                          {t.done ? (
                            <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                              <Check className="w-3" />
                            </div>
                          ) : isLocked ? (
                            <div className="flex items-center gap-1 bg-stone-100 text-stone-550 px-2 py-0.5 rounded text-[8.5px] uppercase font-black">
                              <Lock className="w-3 text-stone-400" />
                              {isSubLocked ? "Unlock" : "Prereq"}
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* STICKY ACTION PIPELINE BAR ABOVE NAVIGATION FOR UNSURE */}
            <div className="fixed bottom-[68px] left-[5%] right-[5%] max-w-[90%] bg-white border border-stone-200 shadow-lg px-4 py-3 rounded-full flex items-center justify-between z-30 select-none">
              <div className="flex items-center gap-1.5 font-black text-xs text-stone-800 uppercase tracking-widest leading-none">
                <span className="text-xl">❓?</span> UNSURE?
              </div>
              <button 
                onClick={() => openConversationTopic({ id: 0, title: "Talk About Anything", cat: "Speaking", theme: "General", locked: false, done: false, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=75" })}
                className="px-5 py-2.5 rounded-full bg-[#e07a5f] hover:bg-[#d66d51] text-white font-black text-[10.5px] uppercase tracking-wider shadow-sm transition active:scale-95"
              >
                Talk About Anything
              </button>
            </div>
          </motion.div>
        )}



        {/* SCREEN 4: DIAL CALL VOICE PRACTICE BOARD */}
        {screen === "call" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col justify-start overflow-y-auto no-scrollbar pb-24 p-5 bg-[#0F172A]"
            id="call-screen-container"
          >
            {callActive ? (
              /* ACTIVE VOICE PRACTICE SCREEN */
              <div 
                id="voice-call-active-panel" 
                className="flex-1 flex flex-col justify-between items-center text-center p-4 text-white select-none font-sans"
              >
                {/* Channel Header Info */}
                <div className="w-full flex justify-between items-center bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">SECURE AI CHANNEL ACTIVE</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-900/40 border border-purple-500/20 px-2 py-0.5 rounded-md uppercase">
                    VOICE: {VOICE_PERSONALITIES.find(v => v.tone === emotionalTone)?.name || "Kore"}
                  </span>
                </div>

                {/* VOCAB LAB ACTIVE TARGET CHALLENGE */}
                {activePracticePhrase && (
                  <div className="w-full max-w-sm bg-gradient-to-r from-stone-900 to-slate-900 border border-amber-500/40 rounded-2xl p-4 text-left shadow-lg mt-4 animate-fadeIn">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-amber-400 text-[13px]">🎯</span>
                      <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                        Practice target sentence:
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-stone-100 font-bold mb-1 leading-snug">
                      "{activePracticePhrase.phrase}"
                    </p>
                    <div className="text-[11.5px] text-stone-300 border-l-2 border-[#FF8C4A] pl-2 mt-2 font-medium">
                      💡 Tip: {activePracticePhrase.tip}
                    </div>
                    <div className="text-[11px] text-stone-400 pl-2 mt-1 font-medium font-sans">
                      Meaning: {activePracticePhrase.translation}
                    </div>
                  </div>
                )}

                {/* Animated Speaking / Wave Center & Clickable Microphone Toggle */}
                <div className="my-auto py-6 flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center mb-4">
                    {/* Pulsing ring layers based on active listening or audio playing */}
                    {isCallListening ? (
                      <>
                        <div className="absolute inset-[-14px] rounded-full bg-emerald-500/25 animate-ping" style={{ animationDuration: "2s" }} />
                        <div className="absolute inset-[-7px] rounded-full bg-teal-500/15 animate-pulse" style={{ animationDuration: "1s" }} />
                      </>
                    ) : playingAudioIndex !== null ? (
                      <>
                        <div className="absolute inset-[-10px] rounded-full bg-violet-600/20 animate-ping" style={{ animationDuration: "3s" }} />
                        <div className="absolute inset-[-5px] rounded-full bg-rose-500/10 animate-pulse" style={{ animationDuration: "2s" }} />
                      </>
                    ) : null}
                    
                    <button
                      onClick={toggleVoiceCallListening}
                      title={isCallListening ? "Stop Listening" : "Tap to Speak"}
                      className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg relative transition-all duration-300 hover:scale-103 active:scale-97 border ${
                        isCallListening 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-4 border-emerald-300" 
                          : "bg-gradient-to-tr from-[#FF8C4A] via-rose-500 to-purple-600 border border-white/20"
                      }`}
                    >
                      <span className="text-4xl select-none leading-none mb-1">🎙️</span>
                      <span className="text-[9.5px] font-black text-white tracking-wide uppercase select-none">
                        {isCallListening ? "LISTENING" : "TAP TO SPEAK"}
                      </span>
                    </button>
                  </div>

                  {/* Status labels */}
                  <h3 id="active-call-status" className="text-lg font-black text-rose-500 tracking-wide uppercase">
                    {callStatusText}
                  </h3>
                  <p className="text-stone-400 text-[11.5px] mt-1 font-bold max-w-xs px-2">
                    {isCallListening 
                      ? "Coach VANI is listening... read the sentence out loud!" 
                      : playingAudioIndex !== null
                      ? "Listening to Coach VANI's voice..." 
                      : "Tap the big microphone above when you're ready to speak!"}
                  </p>
                </div>

                {/* Real-time speech feedback bubble panel */}
                <div className="w-full space-y-2.5 my-3">
                  {callUserSpokenText && (
                    <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-left font-sans">
                      <p className="text-[9.5px] font-black uppercase text-amber-500 tracking-wider">What you said:</p>
                      <p className="text-sm text-stone-200 mt-1 font-semibold italic">"{callUserSpokenText}"</p>
                    </div>
                  )}

                  {callGrammarCorrection && (
                    <div className="p-3.5 bg-rose-950/40 border border-rose-500/20 rounded-2xl text-left font-sans">
                      <p className="text-[9.5px] font-black uppercase text-rose-400 tracking-wider">✨ Grammar Correction:</p>
                      <p className="text-xs text-stone-100 mt-1 font-medium">{callGrammarCorrection}</p>
                    </div>
                  )}

                  {callVocabularyBoost && (
                    <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-left font-sans">
                      <p className="text-[9.5px] font-black uppercase text-emerald-400 tracking-wider">🚀 Vocabulary Boost:</p>
                      <p className="text-xs text-stone-100 mt-1 font-medium">{callVocabularyBoost}</p>
                    </div>
                  )}
                </div>

                {/* Backup Keyboard Input Area */}
                <div className="w-full max-w-sm bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col gap-2 mt-1 mb-4 select-none">
                  <p className="text-[9.5px] font-black text-stone-400 uppercase tracking-widest text-left">
                    ⌨️ No Mic or Noisy Room? Type what you would say:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={activePracticePhrase ? `Type: "${activePracticePhrase.phrase}"` : "Type your spoken reply here..."}
                      className="flex-1 bg-stone-900/95 text-stone-100 text-xs px-3.5 py-2.5 rounded-xl border border-stone-800 focus:outline-none focus:border-amber-500/60 font-sans"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = e.currentTarget.value;
                          if (val && val.trim()) {
                            setCallUserSpokenText(val);
                            handleCallSpeechSubmitted(val);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                      id="call-text-backup-input"
                    />
                    <button
                      onClick={() => {
                        const inputEl = document.getElementById("call-text-backup-input") as HTMLInputElement;
                        if (inputEl && inputEl.value.trim()) {
                          const val = inputEl.value;
                          setCallUserSpokenText(val);
                          handleCallSpeechSubmitted(val);
                          inputEl.value = "";
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* Connection control buttons */}
                <button
                  id="btn-end-voice-call"
                  onClick={() => endVoiceCall()}
                  className="w-full max-w-sm py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg border border-rose-500/20 flex items-center justify-center gap-2 mt-auto"
                >
                  🛑 Disconnect Practice Call
                </button>
              </div>
            ) : (
              /* VOICE PRACTICE DASHBOARD REDESIGNED - TALK WITH VANI */
              <div id="talk-with-vani-dashboard" className="w-full max-w-sm mx-auto flex flex-col gap-6 text-white text-left font-sans select-none my-auto">
                {/* Header */}
                <div id="talk-with-vani-header" className="text-center pb-4 border-b border-white/5 relative">
                  {/* Back button to go home */}
                  <button
                    id="btn-voice-back-home"
                    onClick={() => setScreen("home")}
                    className="absolute left-0 top-1 text-xs text-stone-400 hover:text-white font-extrabold uppercase tracking-widest bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-xl transition-all"
                  >
                    <span>←</span> Back
                  </button>
                  <h2 id="talk-with-vani-title" className="text-2xl font-black bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400 bg-clip-text text-transparent uppercase tracking-tight font-sans">
                    Talk with VANI
                  </h2>
                  <p id="talk-with-vani-subtitle" className="text-stone-300 text-xs mt-2 font-medium max-w-[280px] mx-auto lowercase">
                    Practice English naturally with your AI Coach.
                  </p>
                </div>

                {/* VANI AVATAR & CURRENT STATUS */}
                <div id="vani-avatar-status-panel" className="flex flex-col items-center justify-center py-6 select-none bg-white/5 border border-white/5 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xs">
                  {/* Glowing subtle gradient mesh behind avatar */}
                  <div className="absolute w-24 h-24 rounded-full bg-violet-500/10 blur-[30px] -z-10" />
                  
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring layers */}
                    <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-pulse" style={{ animationDuration: '2.5s' }} />
                    
                    <div className="w-24 h-24 bg-gradient-to-tr from-violet-600 via-rose-500 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.25)] border border-white/10 relative">
                      <span className="text-4xl">🎙️</span>
                    </div>
                  </div>

                  <h3 id="vani-avatar-name" className="text-lg font-bold mt-4 tracking-tight text-white uppercase">
                    Coach VANI
                  </h3>
                  
                  <div id="vani-status-tag" className="flex items-center gap-1.5 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full shadow-sm">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Ready to Talk</span>
                  </div>
                </div>

                {/* GATING / SUBSCRIPTION VOICE ACCESS CARD */}
                {!isVoicePersonalityUnlocked() ? (
                  /* Standard / Locked Tier View */
                  <div id="standard-voice-badge-container" className="p-4 bg-[#1E293B]/40 border border-amber-500/10 rounded-2xl flex flex-col gap-1 text-center font-sans">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">🔒</span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">Standard VANI Voice</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-bold mt-1 max-w-[280px] mx-auto leading-relaxed">
                      English speaking conversations are locked. Upgrade to Premium Plan (₹249) or above to unlock active voice sessions.
                    </p>
                  </div>
                ) : (
                  /* Premium / Unlocked Tier View */
                  <div id="premium-voice-badge-container" className="p-4 bg-gradient-to-tr from-amber-500/10 to-violet-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                        <span>👑</span> Premium VANI Voice Unlocked
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase rounded-md tracking-wider">
                        Active VIP Access
                      </span>
                    </div>
                    
                    {/* List of Additional Premium Features */}
                    <div className="mt-1.5 space-y-2 border-t border-white/5 pt-2 text-[11px] font-medium text-stone-300">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-xs shrink-0">✓</span>
                        <span>⚡ Faster response processing speeds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 text-xs shrink-0">✓</span>
                        <span>🗣️ Advanced smart pronunciation feedback</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-violet-400 text-xs shrink-0">✓</span>
                        <span>🗺️ Exclusive premium professional learning scenarios</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SINGLE INTERACTABLE START BUTTON */}
                <div id="btn-start-conversation-container" className="pt-2 flex flex-col gap-2 items-center">
                  <button
                    id="btn-voice-practice-channel-speak"
                    onClick={() => {
                      if (!isVoicePersonalityUnlocked()) {
                        setVoiceUpgradeModalOpen(true);
                      } else {
                        startVoiceCall();
                      }
                    }}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all flex items-center justify-center gap-2.5 ${
                      !isVoicePersonalityUnlocked()
                        ? "bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 cursor-pointer text-white"
                        : "bg-gradient-to-r from-violet-600 via-rose-500 to-violet-600 text-white hover:opacity-95 active:scale-98"
                    }`}
                  >
                    🎙 Start Speaking
                  </button>
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider text-center mt-1">
                    {!isVoicePersonalityUnlocked()
                      ? "🔒 Locked for Trial/Standard Tier" 
                      : "👑 Unlocked! Direct high-priority voice connection ready."}
                  </p>
                </div>
              </div>
            )}

            {/* Nice Toast simulation overlay */}
            {voiceToastMessage && (
              <div 
                id="voice-toast-notification"
                className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-violet-950/90 border border-violet-500/30 text-violet-200 text-xs font-extrabold uppercase px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce z-40"
              >
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>{voiceToastMessage}</span>
              </div>
            )}

            {/* UPGRADE POPUP MODAL (When Locked & Clicking custom features on Trial/₹99 plans) */}
            {voiceUpgradeModalOpen && (
              <div 
                id="voice-upgrade-modal-overlay"
                className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-5 z-[9999] select-none"
              >
                <div 
                  id="voice-upgrade-modal-card"
                  className="bg-[#18181B] border border-amber-500/20 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl relative select-none animate-fade-in"
                >
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    👑
                  </div>

                  <h3 id="voice-upgrade-modal-title" className="text-lg font-black text-white tracking-tight">
                    VANI Voice Personality is a Premium Feature.
                  </h3>
                  
                  <p id="voice-upgrade-modal-description" className="text-stone-300 font-medium text-xs mt-3 leading-relaxed text-center">
                    Upgrade to Premium (₹249 or above) to unlock multiple AI voice personalities and enjoy a more personalized English-speaking experience.
                  </p>

                  <div className="mt-5 p-3.5 bg-white/5 rounded-2xl text-left border border-white/5">
                    <p className="text-[8.5px] font-black uppercase text-amber-400 tracking-wider">Premium Access Includes:</p>
                    <ul className="mt-2 space-y-1.5 text-[10.5px] text-stone-300 font-medium">
                      <li>✨ Switch between all 5 AI voices instantly</li>
                      <li>🗣️ Custom talking speed adjustment</li>
                      <li>🎓 Patient accents guides with Bengali pointers</li>
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      id="btn-modal-upgrade-now"
                      onClick={() => {
                        setSelectedPlanPrice(249);
                        setActiveBillingStep('select');
                        setVoiceUpgradeModalOpen(false);
                        setBillingOverlayOpen(true);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 active:scale-98 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
                    >
                      Upgrade Now
                    </button>
                    
                    <button
                      id="btn-modal-maybe-later"
                      onClick={() => setVoiceUpgradeModalOpen(false)}
                      className="w-full py-2.5 bg-transparent hover:bg-white/5 active:scale-98 text-stone-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}


        {/* SCREEN 4.5: LANGUAGE BRIDGE TRANSLATION CENTER */}
        {screen === "bridge" && (
          <LanguageBridge />
        )}

        {/* SCREEN 4.6: INTERACTIVE GRAMMAR & VOCAB PRACTICE CENTER */}
        {screen === "practice" && (
          <PracticeCenter 
            xp={xp}
            setXp={setXp}
            streak={streak}
            setStreak={setStreak}
            showToast={showToast}
            celebrateStreak={celebrateStreak}
            playTTS={playTTS}
            userPlan={userPlan}
            practicedPhrases={practicedPhrases}
            onStartPhrasePractice={startPhrasePractice}
            initialTab={practiceInitialTab}
          />
        )}

        {/* SCREEN 4.7: VANI VOCABULARY LAB */}
        {false && screen === "vocab_lab" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col bg-[#121212] min-h-screen text-stone-200 pb-28 text-left animate-fade-in overflow-y-auto"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-stone-800 bg-[#1A1A1A] px-5 py-4 select-none shrink-0 sticky top-0 z-30 shadow-md">
              <button 
                onClick={() => setScreen("topics")} 
                className="flex items-center gap-1.5 text-xs font-bold uppercase text-stone-400 hover:text-[#FF8C4A] transition"
              >
                <span>&larr;</span> Back to Topics
              </button>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Vocabulary & Grammar Lab 📘
              </h2>
              <div className="w-16" />
            </div>

            {/* Subtitle */}
            <div className="px-5 pt-4 pb-2 select-none text-center">
              <p className="text-stone-400 text-xs font-semibold leading-normal">
                Practice with VANI — speak each phrase
              </p>
            </div>

            {/* Overall Progress Summary - STRICTLY CORRESPONDING TO USER INTENT AND EXACT STYLE SPECIFICATIONS */}
            <div style={{
              margin : "16px",
              padding : "16px",
              background : "linear-gradient(135deg,#1E1208,#1A1A1A)",
              border : "1px solid #FF8C4A",
              borderRadius : "14px",
              textAlign : "center"
            }}>
              <div style={{
                fontSize : "32px",
                fontWeight : "bold",
                color : "#FF8C4A"
              }} id="vocab-overall-percent">
                {Math.round((practicedPhrases.length / 30) * 100)}%
              </div>
              <div style={{
                fontSize : "12px",
                color : "#B0B0B0",
                fontFamily : "Poppins,sans-serif"
              }}>
                <span id="vocab-done-count">{practicedPhrases.length}</span> of <span id="vocab-total-count">30</span> phrases mastered
              </div>
            </div>

            {/* Collapsible Categories list */}
            <div className="space-y-4">
              {VOCAB_CATEGORIES.map((cat) => {
                const isExpanded = expandedCategory === cat.name;
                const completedInCat = cat.phrases.filter(p => practicedPhrases.includes(p.id)).length;
                const totalInCat = cat.phrases.length;
                const percent = totalInCat > 0 ? (completedInCat / totalInCat) * 100 : 0;

                return (
                  <div 
                    key={cat.name} 
                    className="vocab-category" 
                    data-category={cat.name}
                    style={{
                      margin        : "0 16px 12px",
                      background    : "#1A1A1A",
                      border        : "1px solid rgba(255,107,43,0.15)",
                      borderRadius  : "14px",
                      overflow      : "hidden",
                    }}
                  >
                    <div 
                      onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                      className={`category-header ${isExpanded ? "expanded" : ""}`}
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
                          {cat.subtitle} ({completedInCat} of {totalInCat} practiced)
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
                      className={`category-content ${isExpanded ? "expanded" : ""}`} 
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
                            data-phrase={phrase.id}
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
                                onClick={() => {
                                  setActivePracticePhrase(phrase);
                                  setScreen("call");
                                  
                                  // Reset call screen statistics
                                  setCallUserSpokenText("");
                                  setCallGrammarCorrection("");
                                  setCallVocabularyBoost("");
                                  setCallActive(true);
                                  
                                  startVoiceCall();
                                  
                                  const introText = `Let's practice the vocabulary phrase: "${phrase.phrase}". Here is a helpful pronunciation tip: ${phrase.tip} Now you say it — go ahead!`;
                                  setCallMessagesList([{ role: "assistant", content: introText }]);
                                  
                                  setTimeout(() => {
                                    setCallStatusText("Speaking...");
                                    playTTS(introText, 888);
                                  }, 900);
                                }}
                                className="practice-btn"
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
                              
                              <span 
                                className="phrase-status" 
                                id={`status-${phrase.id}`}
                                style={{
                                  fontSize: "16px",
                                }}
                              >
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
          </motion.div>
        )}

        {/* SCREEN 5: CHAT SCREEN WITH VANI */}
        {screen === "chat" && (
          <div className="flex-1 flex flex-col bg-stone-50 h-[calc(100vh-64px)] relative">
            
            {/* CHAT BAR TOP INDICATOR */}
            <div className="bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setScreen("topics")}
                className="p-1 hover:bg-stone-50 rounded-lg transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>

              <div className="relative shrink-0 select-none">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-lg shadow-sm">
                  👩‍🏫
                </div>
                {/* pulsating green active bubble */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-bounce" />
              </div>

              <div className="flex-1 text-left min-w-0">
                <h3 className="text-sm font-extrabold text-stone-800 leading-none">Coach VANI</h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">● Online Tutor</span>
                  {quickStudyActive && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[7px] uppercase rounded tracking-wider shadow-3xs animate-pulse">
                      ⚡ Quick Study Mode
                    </span>
                  )}
                </div>
              </div>

              {selectedTopic && (
                <div className="text-right max-w-[120px] shrink-0 flex flex-col items-end gap-1">
                  <p className="text-xxs font-black text-rose-500 truncate leading-none">{selectedTopic.title}</p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest truncate leading-none">{selectedTopic.cat}</p>
                  {!selectedTopic.done && (
                    <button
                      onClick={markCurrentTopicAsDone}
                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[8px] tracking-wider font-extrabold rounded-md border border-emerald-200 transition uppercase whitespace-nowrap"
                    >
                      ✓ Done
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* MESSAGE INTERACTION HISTORY CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {chatMessages.map((m, index) => {
                const isUser = m.role === "user";
                return (
                  <div key={index} className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}>
                    
                    {/* Chat Bubble card */}
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {!isUser && (
                        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 flex items-center justify-center text-8px text-white select-none shadow-xxs">
                          👩
                        </span>
                      )}

                      <div className={`p-6 rounded-3xl text-left relative ${isUser ? "bg-stone-850 text-white rounded-br-xs shadow-md" : "bg-white text-stone-850 border border-stone-150 rounded-bl-sm shadow-md"}`}>
                        <p className="font-bold text-[24px] md:text-[26px] leading-relaxed pr-8">{m.content}</p>

                        {!isUser && (
                          <button
                            onClick={() => playTTS(m.content, index)}
                            disabled={ttsLoading}
                            className="absolute right-3 bottom-3 p-1.5 rounded-full hover:bg-stone-100 text-rose-500 bg-white shadow-xxs border border-stone-200"
                            title="Listen Pronunciation"
                          >
                            <Volume2 className={`w-4.5 h-4.5 ${playingAudioIndex === index ? "animate-pulse scale-110 text-emerald-600" : ""}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* VANI MULTILINGUAL TRANSLATION BLOCK */}
                    {isUser && (m.translationLoading || m.translationText) && (
                      <TranslationBlock 
                        text={m.translationText} 
                        loading={m.translationLoading === true} 
                      />
                    )}

                    {/* VANI EDUCATIONAL PEDAGOGICAL TIPS BLOCK */}
                    {!isUser && (m.grammarFeedback || m.vocabBoost) && (
                      <div className="ml-8 max-w-[85%] bg-white/70 backdrop-blur-xxs border border-stone-100 p-4 rounded-2xl space-y-3 text-left shadow-xxs">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-stone-150 font-black text-[12px] text-rose-500 tracking-wider">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>COACH VANI'S SPEAKING CHECK</span>
                        </div>

                        {m.grammarFeedback && (
                          <div>
                            <span className="font-extrabold text-stone-500 text-[11px] tracking-wider uppercase block">Grammar Tune-up</span>
                            <p className="text-[18px] font-bold text-stone-800 leading-relaxed mt-1 bg-stone-50 p-2.5 rounded-xl border border-stone-150">{m.grammarFeedback}</p>
                          </div>
                        )}

                        {m.vocabBoost && (
                          <div>
                            <span className="font-extrabold text-stone-500 text-[11px] tracking-wider uppercase block">Confidence vocabulary upgrade</span>
                            <p className="text-[18px] font-extrabold text-stone-900 leading-relaxed mt-1">{m.vocabBoost}</p>
                          </div>
                        )}

                        {m.bilingualTip && (
                          <div className="pt-1 text-xs text-emerald-700 font-black">
                            🌾 Desi expression: {m.bilingualTip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {loadingReply && (
                <div className="flex items-center gap-2 text-left">
                  <span className="w-7 h-7 bg-rose-500/20 rounded-full flex items-center justify-center text-xs animate-bounce select-none">
                    👩‍🏫
                  </span>
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-150 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-ping delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-ping delay-200" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT FORM BOARD */}
            <div className="bg-white border-t border-stone-150 p-4 flex items-center gap-3 shadow-inner shrink-0 z-10">
              
              {/* Voice Input Microphone - Now swapped with 'Mark Topic Done' button, super accessible */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all active:scale-95 shrink-0 ${
                  isListening 
                    ? "bg-rose-500 text-white animate-pulse shadow-md" 
                    : "bg-rose-100 hover:bg-rose-200 text-rose-600 border border-rose-200 shadow-sm"
                }`}
                title={isListening ? "Listening... Tap to stop" : "Voice Typing Mode"}
              >
                <Mic className="w-10 h-10 shrink-0" />
              </button>

              <form 
                onSubmit={handleChatSubmit} 
                className="flex-1 flex bg-stone-50 border border-stone-200 rounded-3xl overflow-hidden px-4 py-2 bg-white shadow-sm items-center"
              >
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Respond to VANI in English..."
                  className="flex-1 bg-transparent border-none outline-none py-3 text-[25px] placeholder:text-[22px] text-stone-850 font-bold min-h-[64px]"
                  disabled={loadingReply}
                />
              </form>

              <button
                onClick={() => handleChatSubmit()}
                disabled={loadingReply || !chatInput.trim()}
                className="w-20 h-20 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white flex items-center justify-center rounded-3xl shadow-md transition disabled:opacity-40 shrink-0"
              >
                <Send className="w-8 h-8" />
              </button>
            </div>
            
          </div>
        )}

      </div>

      {/* BOTTOM TAB-NAVIGATION BAR */}
      {screen !== "chat" && screen !== "onboarding" && screen !== "vocab_lab" && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-150 py-1.5 pb-2.5 flex justify-around items-center shrink-0 z-20 shadow-md">
          {[
            { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
            { id: "topics", icon: <BookOpen className="w-5 h-5" />, label: "Topics" },
            { id: "bridge", icon: <Languages className="w-5 h-5" />, label: "Bridge" },
            { id: "practice", icon: <GraduationCap className="w-5 h-5" />, label: "Practice" },
            { id: "call", icon: <PhoneCall className="w-5 h-5" />, label: "Call" },
          ].map((tab) => {
            const isActive = screen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { 
                  setScreen(tab.id); 
                  setSelectedTheme(null); 
                  if (tab.id === "practice") {
                    setPracticeInitialTab("grammar");
                  }
                }}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${isActive ? "text-rose-500" : "text-stone-400 hover:text-stone-600"}`}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabOutline"
                      className="absolute -inset-2 bg-rose-50 rounded-xl -z-10"
                      transition={{ type: "spring", damping: 15 }}
                    />
                  )}
                  {tab.icon}
                </div>
                <span className="text-[10.5px] font-black tracking-wide leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

        </>
      )}

      {/* ── NEW: Terms Modal (global) ── */}
      {showTerms && (
        <TermsSheet
          onClose={() => setShowTerms(false)}
        />
      )}

      {/* ── NEW: Privacy Modal (global) ── */}
      {showPrivacy && (
        <PrivacySheet
          onClose={() => setShowPrivacy(false)}
        />
      )}

    </div>
  );
}

// ── Splash Screen ─────────────────────────────
function SplashScreen() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(180deg," +
        "#EEF4FF 0%, #F8F0FF 50%," +
        "#FFF5E6 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
      overflow: "hidden"
    }}>

      {/* Twinkling star particles */}
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:0.2; transform:scale(0.8); }
          50% { opacity:1; transform:scale(1.2); }
        }
        @keyframes floatUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { filter: drop-shadow(0 0 8px rgba(139,47,201,0.4)); }
          50% { filter: drop-shadow(0 0 20px rgba(139,47,201,0.8)); }
        }
        @keyframes dot {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>

      {/* Stars background */}
      {[...Array(12)].map((_,i) => (
        <div key={i} style={{
          position: "absolute",
          width: i%3===0 ? 6 : 4,
          height: i%3===0 ? 6 : 4,
          borderRadius: "50%",
          background: "#8B2FC9",
          top: `${10 + (i * 7.2) % 70}%`,
          left: `${5 + (i * 13) % 90}%`,
          animation:
            `twinkle ${1.5 + i*0.3}s ` +
            `${i*0.2}s ease-in-out infinite`,
          opacity: 0.3
        }} />
      ))}

      {/* Devi Saraswati Avatar Illustration */}
      {/* SVG-based artistic avatar */}
      <div style={{
        animation:
          "floatUp 1s ease forwards, " +
          "glowPulse 3s 1s ease-in-out infinite",
        marginBottom: 24
      }}>
        <svg width="160" height="180"
          viewBox="0 0 160 180"
          xmlns="http://www.w3.org/2000/svg">

          {/* Halo / divine glow ring */}
          <ellipse cx="80" cy="42" rx="44" ry="44"
            fill="none"
            stroke="url(#haloGrad)"
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.7"/>
          <defs>
            <radialGradient id="haloGrad">
              <stop offset="0%"
                stopColor="#FFD700"/>
              <stop offset="100%"
                stopColor="#FF8C00"/>
            </radialGradient>
            <radialGradient id="skinGrad"
              cx="50%" cy="40%">
              <stop offset="0%"
                stopColor="#FDDBB4"/>
              <stop offset="100%"
                stopColor="#F5C99A"/>
            </radialGradient>
            <linearGradient id="sareeGrad"
              x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"
                stopColor="#8B2FC9"/>
              <stop offset="100%"
                stopColor="#E07A5F"/>
            </linearGradient>
          </defs>

          {/* Inner halo filled soft */}
          <ellipse cx="80" cy="42" rx="40" ry="40"
            fill="rgba(255,215,0,0.08)"/>

          {/* Body / saree */}
          <ellipse cx="80" cy="148" rx="46" ry="38"
            fill="url(#sareeGrad)" opacity="0.9"/>

          {/* Neck */}
          <rect x="72" y="88" width="16" height="18"
            rx="8" fill="url(#skinGrad)"/>

          {/* Face */}
          <ellipse cx="80" cy="72" rx="28" ry="30"
            fill="url(#skinGrad)"/>

          {/* Hair */}
          <ellipse cx="80" cy="50" rx="28" ry="18"
            fill="#2C1810"/>
          <ellipse cx="55" cy="68" rx="8" ry="16"
            fill="#2C1810"/>
          <ellipse cx="105" cy="68" rx="8" ry="16"
            fill="#2C1810"/>

          {/* Hair bun / juda */}
          <ellipse cx="80" cy="38" rx="12" ry="10"
            fill="#2C1810"/>
          <circle cx="80" cy="30" r="5"
            fill="#FFD700"/>

          {/* Bindi */}
          <circle cx="80" cy="60" r="3"
            fill="#FF4444"/>

          {/* Eyes */}
          <ellipse cx="70" cy="70" rx="5" ry="4"
            fill="white"/>
          <ellipse cx="90" cy="70" rx="5" ry="4"
            fill="white"/>
          <circle cx="71" cy="70" r="3"
            fill="#2C1810"/>
          <circle cx="91" cy="70" r="3"
            fill="#2C1810"/>
          <circle cx="72" cy="69" r="1"
            fill="white"/>
          <circle cx="92" cy="69" r="1"
            fill="white"/>

          {/* Eyebrows */}
          <path d="M64 64 Q70 61 76 64"
            stroke="#2C1810" strokeWidth="2"
            fill="none" strokeLinecap="round"/>
          <path d="M84 64 Q90 61 96 64"
            stroke="#2C1810" strokeWidth="2"
            fill="none" strokeLinecap="round"/>

          {/* Smile */}
          <path d="M73 82 Q80 88 87 82"
            stroke="#C27B5A" strokeWidth="2"
            fill="none" strokeLinecap="round"/>

          {/* Nose */}
          <ellipse cx="80" cy="77" rx="2" ry="1.5"
            fill="#C27B5A" opacity="0.6"/>

          {/* Earrings */}
          <circle cx="52" cy="74" r="5"
            fill="#FFD700" opacity="0.9"/>
          <circle cx="108" cy="74" r="5"
            fill="#FFD700" opacity="0.9"/>

          {/* Necklace */}
          <path d="M66 98 Q80 106 94 98"
            stroke="#FFD700" strokeWidth="2.5"
            fill="none" strokeLinecap="round"/>

          {/* Veena / book hint (knowledge symbol) */}
          <rect x="96" y="110" width="22" height="16"
            rx="3" fill="#F5DEB3" opacity="0.9"/>
          <line x1="98" y1="115"
            x2="116" y2="115"
            stroke="#8B4513" strokeWidth="1"/>
          <line x1="98" y1="119"
            x2="116" y2="119"
            stroke="#8B4513" strokeWidth="1"/>
          <text x="99" y="124"
            fontSize="7" fill="#8B4513"
            fontWeight="bold">ABC</text>

          {/* Lotus in other hand */}
          <circle cx="44" cy="118" r="8"
            fill="#FF9EAF" opacity="0.8"/>
          <circle cx="44" cy="118" r="4"
            fill="#FFD700"/>

          {/* Saree gold border */}
          <ellipse cx="80" cy="148" rx="46" ry="38"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            opacity="0.6"/>

        </svg>
      </div>

      {/* App name */}
      <div style={{
        fontSize: 32,
        fontWeight: 900,
        letterSpacing: -0.5,
        animation: "floatUp 1s 0.3s ease both"
      }}>
        <span style={{ color: "#E07A5F" }}>
          Easy
        </span>
        <span style={{ color: "#2D6A4F" }}>
          {" "}English
        </span>
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 15,
        color: "#666",
        marginTop: 8,
        letterSpacing: 0.3,
        animation: "floatUp 1s 0.5s ease both"
      }}>
        with Coach VANI 🤖
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 13,
        color: "#999",
        marginTop: 6,
        fontStyle: "italic",
        animation: "floatUp 1s 0.7s ease both"
      }}>
        English learning comes alive!
      </div>

      {/* Bottom wave */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background:
          "linear-gradient(to top," +
          "rgba(139,47,201,0.15), transparent)"
      }} />

      {/* Loading dots */}
      <div style={{
        position: "absolute",
        bottom: 40,
        display: "flex",
        gap: 8
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8,
            borderRadius: "50%",
            background: "#8B2FC9",
            animation:
              `dot 1.2s ${i*0.2}s` +
              ` ease-in-out infinite`
          }} />
        ))}
      </div>

    </div>
  );
}

interface OpeningScreenProps {
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  otpSent: boolean;
  setOtpSent: (val: boolean) => void;
  otpValue: string;
  setOtpValue: (val: string) => void;
  onContinue: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

// ── Opening / Login Screen ────────────────────
function OpeningScreen({
  phoneNumber, setPhoneNumber,
  otpSent, setOtpSent,
  otpValue, setOtpValue,
  onContinue, onShowTerms, onShowPrivacy
}: OpeningScreenProps) {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleGetOTP = () => {
    if (phoneNumber.length < 10) return;
    setLoading(true);
    setErrorMsg("");
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      setOtpSent(true);
      setLoading(false);
      alert(`🔐 VANI Secure Login\nAn OTP has been sent via SMS to +91 ${phoneNumber}.\nYour actual One-Time Passcode is: ${code}`);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otpValue.length < 4) {
      setErrorMsg("Please enter a valid OTP.");
      return;
    }
    if (otpValue !== generatedCode) {
      setErrorMsg("Incorrect OTP code. Please enter the passcode sent to your phone.");
      return;
    }
    setErrorMsg("");
    onContinue();
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "#F0F4FF",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      zIndex: 998
    }} className="no-scrollbar">

      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Hero image area */}
      <div style={{
        position: "relative",
        height: 250,
        overflow: "hidden",
        background:
          "linear-gradient(135deg," +
          "#C8E6FF, #E8D5FF)",
        flexShrink: 0
      }}>
        {/* Sparky-style: people learning */}
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.85
          }}
        />

        {/* App name overlay */}
        <div style={{
          position: "absolute",
          top: 20,
          left: 0, right: 0,
          textAlign: "center"
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: -0.5
          }}>
            <span style={{ color: "#E07A5F" }}>
              Easy
            </span>
            <span style={{ color: "#fff",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.3)" }}>
              {" "}English
            </span>
          </div>
        </div>

        {/* Trusted badge */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          background: "rgba(30,30,30,0.75)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10
        }}>
          <span style={{ fontSize: 14 }}>
            ⭐⭐⭐⭐⭐
          </span>
          <span style={{
            color: "white",
            fontSize: 11,
            fontWeight: 600
          }}>
            English learning comes alive!
          </span>
        </div>
      </div>

      {/* Login card */}
      <div style={{
        flex: 1,
        background: "white",
        borderRadius: "24px 24px 0 0",
        marginTop: -16,
        padding: "24px 20px 32px",
        animation: "fadeIn 0.5s ease forwards",
        position: "relative",
        zIndex: 10
      }}>

        {/* Heading */}
        <div style={{
          textAlign: "center",
          marginBottom: 20
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 950,
            color: "#1A1A1A",
            letterSpacing: "-0.5px"
          }}>
            Speak and Learn
          </div>
          <div style={{
            fontSize: 14,
            color: "#777",
            marginTop: 4,
            fontWeight: "600"
          }}>
            with your AI Coach VANI
          </div>
          {/* Carousel dots */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 10
          }}>
            <div style={{
              width: 8, height: 8,
              borderRadius: "50%",
              background: "#ccc"
            }} />
            <div style={{
              width: 8, height: 8,
              borderRadius: "50%",
              background: "#8B2FC9"
            }} />
          </div>
        </div>

        {/* Phone input row */}
        {!otpSent ? (
          <>
            <div style={{
              display: "flex",
              gap: 10,
              marginBottom: 14
            }}>
              {/* Country code */}
              <div style={{
                background: "#F5F5F5",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
                border: "1.5px solid #E8E8E8"
              }}>
                <span style={{ fontSize: 18 }}>
                  🇮🇳
                </span>
                <span style={{
                  fontWeight: 700,
                  fontSize: 14
                }}>+91</span>
              </div>

              {/* Phone number input */}
              <div style={{
                flex: 1,
                background: "#F5F5F5",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1.5px solid #E8E8E8"
              }}>
                <span style={{ fontSize: 16 }}>
                  📱
                </span>
                <input
                  type="text"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={e =>
                    setPhoneNumber(
                      e.target.value
                        .replace(/\D/g, "")
                    )
                  }
                  placeholder="Phone Number"
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: 14,
                    flex: 1,
                    fontFamily: "inherit",
                    fontWeight: "bold"
                  }}
                />
              </div>
            </div>

            {/* Get OTP button */}
            <button
              onClick={handleGetOTP}
              disabled={
                phoneNumber.length < 10 ||
                loading
              }
              style={{
                width: "100%",
                background:
                  phoneNumber.length < 10
                    ? "#ccc"
                    : "linear-gradient(135deg," +
                      "#E07A5F,#C85A3F)",
                border: "none",
                borderRadius: 14,
                padding: "14px",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                cursor:
                  phoneNumber.length < 10
                    ? "not-allowed"
                    : "pointer",
                marginBottom: 14,
                transition: "all 0.2s",
                letterSpacing: 0.3
              }}>
              {loading
                ? "Sending OTP..."
                : "Get OTP"}
            </button>
          </>
        ) : (
          <>
            {/* OTP input */}
            <div style={{
              textAlign: "center",
              marginBottom: 14
            }}>
              <div style={{
                fontSize: 12,
                color: "#555",
                marginBottom: 10,
                fontWeight: "600"
              }}>
                OTP sent to +91 {phoneNumber}
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={e => {
                  setOtpValue(e.target.value.replace(/\D/g, ""));
                  setErrorMsg("");
                }}
                placeholder="Enter OTP"
                style={{
                  width: "100%",
                  border: "2px solid #8B2FC9",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 18,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                  letterSpacing: 4,
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
              {errorMsg && (
                <div style={{ color: "#E07A5F", fontSize: "11.5px", fontWeight: "bold", marginTop: "8px", textAlign: "center" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* VIP Assist Module: Direct Display if SMS fails */}
              <div className="mt-4 pt-3.5 border-t border-purple-100 flex flex-col items-center gap-1.5 bg-purple-50/80 p-3 rounded-2xl border border-purple-200/50">
                <span className="text-[10.5px] text-purple-700 font-black uppercase tracking-wider block">🔑 Didn't receive the passcode?</span>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-purple-200 font-bold text-xs text-purple-950">
                  <span>Enter Code: </span>
                  <span className="text-sm font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded tracking-wide font-mono">
                    {generatedCode}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const code = Math.floor(1000 + Math.random() * 9000).toString();
                    setGeneratedCode(code);
                    alert(`🔐 VANI Secure Login\nAn OTP has been sent via SMS to +91 ${phoneNumber}.\nYour actual One-Time Passcode is: ${code}`);
                  }}
                  className="text-[10px] text-purple-600 font-extrabold hover:underline tracking-wider cursor-pointer mt-1"
                >
                  Resend / Regenerate Passcode 🔄
                </button>
              </div>
            </div>
            <button
              onClick={handleVerifyOTP}
              style={{
                width: "100%",
                background:
                  "linear-gradient(135deg," +
                  "#8B2FC9,#6A1E9E)",
                border: "none",
                borderRadius: 14,
                padding: "14px",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 14,
                letterSpacing: 0.3
              }}>
              Verify & Continue
            </button>
            <button
              onClick={() => setOtpSent(false)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#888",
                fontSize: 12,
                cursor: "pointer",
                marginBottom: 8,
                fontWeight: "600"
              }}>
              ← Change number
            </button>
          </>
        )}

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "4px 0 14px"
        }}>
          <div style={{
            flex: 1, height: 1,
            background: "#eee"
          }} />
          <span style={{
            color: "#aaa",
            fontSize: 11,
            fontWeight: 800
          }}>OR</span>
          <div style={{
            flex: 1, height: 1,
            background: "#eee"
          }} />
        </div>

        {/* Google Sign In */}
        <button
          onClick={onContinue}
          style={{
            width: "100%",
            background: "white",
            border: "1.5px solid #E0E0E0",
            borderRadius: 14,
            padding: "12px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 20,
            color: "#333"
          }}>
          <svg width="18" height="18"
            viewBox="0 0 48 48" className="shrink-0">
            <path fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22
              9.21 3.6l6.85-6.85C35.9 2.38
              30.47 0 24 0 14.62 0 6.51 5.38
              2.56 13.22l7.98 6.19C12.43
              13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09
              -.38-4.55H24v9.02h12.94c-.58
              2.96-2.26 5.48-4.78 7.18l7.73
              6c4.51-4.18 7.09-10.36
              7.09-17.65z"/>
            <path fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76
              -2.99-.76-4.59s.27-3.14.76
              -4.59l-7.98-6.19C.92 16.46 0
              20.12 0 24c0 3.88.92 7.54 2.56
              10.78l7.97-6.19z"/>
            <path fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13
              15.89-5.81l-7.73-6c-2.15
              1.45-4.92 2.3-8.16 2.3-6.26
              0-11.57-4.22-13.47-9.91l-7.98
              6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Terms text */}
        <div style={{
          textAlign: "center",
          fontSize: 11,
          color: "#888",
          lineHeight: 1.6,
          fontWeight: "600"
        }}>
          By proceeding you agree to our{" "}
          <span
            onClick={onShowTerms}
            style={{
              color: "#8B2FC9",
              fontWeight: 800,
              cursor: "pointer",
              textDecoration: "underline"
            }}>
            Terms and Conditions
          </span>
          {" "}and{" "}
          <span
            onClick={onShowPrivacy}
            style={{
              color: "#8B2FC9",
              fontWeight: 800,
              cursor: "pointer",
              textDecoration: "underline"
            }}>
            Privacy Policy
          </span>
        </div>

      </div>
    </div>
  );
}

interface SheetProps {
  onClose: () => void;
}

// ── Terms & Conditions Bottom Sheet ───────────
function TermsSheet({ onClose }: SheetProps) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 10010,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }}>
      {/* Dark overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)"
        }}
      />

      {/* Sheet */}
      <div style={{
        position: "relative",
        background: "white",
        borderRadius: "22px 22px 0 0",
        maxHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 1
      }}>

        {/* Drag handle */}
        <div style={{
          width: 40,
          height: 4,
          background: "#DDD",
          borderRadius: 4,
          margin: "12px auto 0"
        }} />

        {/* Scrollable content */}
        <div style={{
          overflowY: "auto",
          padding: "16px 24px 30px",
          flex: 1
        }} className="no-scrollbar">

          <h2 style={{
            fontSize: 16,
            fontWeight: 900,
            color: "#1A1A1A",
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: 0.3
          }}>
            Terms and Conditions of Access or Use
          </h2>

          {[
            {
              title: "Acceptance of Terms",
              body:
                "By accessing and using the Easy " +
                "English app (a personal educational " +
                "project by an independent developer), " +
                "you acknowledge your agreement to " +
                "adhere to these Terms and Conditions. " +
                "Please review these terms carefully " +
                "as they govern your use of this app. " +
                "If any part is not agreeable to you, " +
                "we request that you stop using it."
            },
            {
              title: "Nature of This Project",
              body:
                "Easy English with Coach VANI is an " +
                "independent personal project developed " +
                "by an individual developer. It is not " +
                "owned or operated by any registered " +
                "company or corporate entity. This app " +
                "is built to help Indian learners " +
                "improve their spoken English skills " +
                "using AI technology."
            },
            {
              title: "Subscription and Payment Options",
              body:
                "When you start the 4-day trial period (₹7 for 4 days), " +
                "approximately 30% of scenarios are open, but the translation " +
                "portion (Express Translator & Language Bridge) and the Speak with VANI " +
                "voice calling portion are blocked. After 4 days or on the 4th day, " +
                "unless cancelled, the trial automatically renews at the subscription " +
                "charge of ₹249 per month deducted from the user's account to the " +
                "developer's bank account. Alternatively, users may choose the 6-Month " +
                "Subscription discount plan at ₹199 per month (total ₹1,196 pre-paid) " +
                "deducted from the user's account to the developer's bank account. " +
                "All scenarios, translation portions, and the Speak with VANI voice calling " +
                "portion are 100% unlocked upon active Monthly Premium or 6-Month subscription. " +
                "Users may unsubscribe or cancel at any time within the application."
            },
            {
              title: "Refund and Cancellation Policy",
              body:
                "All payments made are non-refundable " +
                "once processed. You may cancel your " +
                "subscription at any time. After " +
                "cancellation, no further charges will " +
                "be made and you will retain access " +
                "until the end of your current billing " +
                "period. Cancellation can be requested " +
                "via the My Account section within the " +
                "app."
            },
            {
              title: "AI-Generated Content",
              body:
                "Responses from Coach VANI are " +
                "generated by an AI model. While every " +
                "effort is made to ensure quality and " +
                "accuracy, AI responses may occasionally " +
                "contain errors. The developer does not " +
                "guarantee 100% accuracy of all AI " +
                "coaching advice, grammar corrections, " +
                "or translations provided."
            },
            {
              title:
                "Translation Services",
              body:
                "The translation feature within this " +
                "app translates Indian regional " +
                "languages (Bengali, Hindi, Telugu, " +
                "Tamil, Marathi, Odia, Punjabi, " +
                "Gujarati, Kannada and Hinglish) " +
                "strictly into English only. No other " +
                "translation direction is supported. " +
                "Translation accuracy depends on AI " +
                "model capability and input clarity."
            },
            {
              title: "User Responsibilities",
              body:
                "You are responsible for maintaining " +
                "the confidentiality of your account " +
                "and for all activities that occur " +
                "under your account. You must not " +
                "misuse the app, attempt to reverse " +
                "engineer it, or use it for any " +
                "purpose other than personal English " +
                "language learning."
            },
            {
              title:
                "User Conduct and Prohibited Activities",
              body:
                "You may not use this app for any " +
                "unlawful purpose, to harass others, " +
                "to submit false information, to " +
                "transmit malware, or to interfere " +
                "with the app's security or " +
                "functionality. Accounts found " +
                "violating these rules may be " +
                "suspended without refund."
            },
            {
              title: "User Eligibility",
              body:
                "This app is intended for users aged " +
                "13 and above. Users under 18 should " +
                "use the app under parental or guardian " +
                "supervision. The developer is not " +
                "liable for misuse by underage users."
            },
            {
              title:
                "Warranty Disclaimer & Liability",
              body:
                "This app is provided on an as-is " +
                "basis without warranties of any kind. " +
                "The developer does not guarantee " +
                "uninterrupted, error-free service. " +
                "Use of this app is entirely at your " +
                "own risk. The developer shall not be " +
                "held liable for any direct, indirect, " +
                "or consequential damages arising from " +
                "use of this app."
            },
            {
              title: "Intellectual Property",
              body:
                "All content, design, code, and AI " +
                "coaching material within Easy English " +
                "is the intellectual property of the " +
                "developer. Unauthorised reproduction, " +
                "distribution, or commercial use of " +
                "any part of this app is strictly " +
                "prohibited."
            },
            {
              title: "Termination",
              body:
                "The developer reserves the right to " +
                "suspend or terminate access to any " +
                "user account that violates these " +
                "terms. Users may also stop using the " +
                "app at any time."
            },
            {
              title: "Modifications to the Service",
              body:
                "Features, pricing, and content of " +
                "this app are subject to change " +
                "without prior notice. The developer " +
                "is not liable for any modification, " +
                "suspension, or discontinuation of " +
                "any part of the service."
            },
            {
              title: "Dispute Resolution",
              body:
                "Any disputes arising from use of " +
                "this app shall be resolved amicably " +
                "through direct communication. This " +
                "app is governed by the laws of India. " +
                "The courts of West Bengal shall have " +
                "jurisdiction over any unresolved " +
                "disputes."
            },
          ].map((section, i) => (
            <div key={i} style={{
              marginBottom: 16
            }}>
              <div style={{
                fontWeight: 800,
                fontSize: 13,
                color: "#1A1A1A",
                marginBottom: 6
              }}>
                {section.title}
              </div>
              <div style={{
                fontSize: 12,
                color: "#555",
                lineHeight: 1.6,
                textAlign: "justify"
              }}>
                {section.body}
              </div>
            </div>
          ))}

        </div>

        {/* Close button */}
        <div style={{
          padding: "12px 24px 20px",
          borderTop: "1px solid #F0F0F0",
          background: "white"
        }}>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg," +
                "#8B2FC9,#6A1E9E)",
              border: "none",
              borderRadius: 14,
              padding: "14px",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer"
            }}>
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Privacy Policy Bottom Sheet ───────────────
function PrivacySheet({ onClose }: SheetProps) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 10010,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }}>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)"
        }}
      />
      <div style={{
        position: "relative",
        background: "white",
        borderRadius: "22px 22px 0 0",
        maxHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 1
      }}>
        <div style={{
          width: 40, height: 4,
          background: "#DDD",
          borderRadius: 4,
          margin: "12px auto 0"
        }} />

        <div style={{
          overflowY: "auto",
          padding: "16px 24px 30px",
          flex: 1
        }} className="no-scrollbar">

          <h2 style={{
            fontSize: 16,
            fontWeight: 900,
            color: "#1A1A1A",
            marginBottom: 20,
            textTransform: "uppercase"
          }}>
            Privacy Policy
          </h2>

          {[
            {
              title: "Our Commitment",
              body:
                "Easy English with Coach VANI is " +
                "committed to protecting your privacy. " +
                "This policy explains what information " +
                "we collect, how we use it, and your " +
                "rights regarding your personal data."
            },
            {
              title: "Information We Collect",
              body:
                "We may collect your phone number or " +
                "Google account email for login " +
                "purposes only. We collect your in-app " +
                "conversation data solely to provide " +
                "the VANI coaching service. We collect " +
                "basic usage data such as topics " +
                "accessed and session duration to " +
                "improve the learning experience."
            },
            {
              title: "How We Use Your Data",
              body:
                "Your data is used only to provide " +
                "and improve the Easy English learning " +
                "experience. Your conversation messages " +
                "are sent to the AI model API to " +
                "generate VANI's coaching responses. " +
                "We do not sell, share, or transfer " +
                "your personal data to any third party " +
                "for commercial purposes."
            },
            {
              title: "AI and API Data Processing",
              body:
                "Messages you send to Coach VANI are " +
                "processed by the API and by using this app you " +
                "acknowledge that your messages are " +
                "transmitted to servers " +
                "for processing. Please review " +
                "privacy details on how " +
                "they handle data."
            },
            {
              title: "Data Storage",
              body:
                "This app currently stores session " +
                "data in your device memory only " +
                "during active use. No personal " +
                "conversation data is permanently " +
                "stored on external servers by this " +
                "app. Subscription and payment data " +
                "is handled by the respective payment " +
                "gateway providers."
            },
            {
              title: "Your Rights",
              body:
                "You have the right to access, " +
                "correct, or request deletion of your " +
                "personal data at any time. You may " +
                "stop using the app and request " +
                "account deletion by contacting the " +
                "developer directly."
            },
            {
              title: "Children's Privacy",
              body:
                "This app is not directed to children " +
                "under the age of 13. If you believe " +
                "a child under 13 has used this app " +
                "without consent, please contact us " +
                "so we can take appropriate action."
            },
            {
              title: "Changes to This Policy",
              body:
                "This privacy policy may be updated " +
                "from time to time. Continued use of " +
                "the app after changes constitutes " +
                "acceptance of the updated policy. " +
                "Users are encouraged to review this " +
                "policy periodically."
            },
            {
              title: "Contact",
              body:
                "This is a personal independent " +
                "project. For any privacy concerns, " +
                "queries, or data deletion requests, " +
                "please contact the developer directly " +
                "through the Help section within the " +
                "app."
            },
          ].map((s, i) => (
            <div key={i} style={{
              marginBottom: 16
            }}>
              <div style={{
                fontWeight: 800,
                fontSize: 13,
                color: "#1A1A1A",
                marginBottom: 6
              }}>
                {s.title}
              </div>
              <div style={{
                fontSize: 12,
                color: "#555",
                lineHeight: 1.6,
                textAlign: "justify"
              }}>
                {s.body}
              </div>
            </div>
          ))}

        </div>

        <div style={{
          padding: "12px 24px 20px",
          borderTop: "1px solid #F0F0F0",
          background: "white"
        }}>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg," +
                "#E07A5F,#C85A3F)",
              border: "none",
              borderRadius: 14,
              padding: "14px",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer"
            }}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
