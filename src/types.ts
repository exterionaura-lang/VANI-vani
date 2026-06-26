export interface Topic {
  id: number;
  title: string;
  cat: string;
  theme: string;
  img: string;
  locked: boolean;
  done: boolean;
}

export interface Theme {
  name: string;
  count: number;
  img: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  src: string;
  img: string;
  comment: string;
  name: string;
  commenters: number;
  color: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  grammarFeedback?: string;
  vocabBoost?: string;
  bilingualTip?: string;
  audioUrl?: string; // Cache for base64 sound
  translationText?: string | null;
  translationLoading?: boolean;
}

export interface TranslationResult {
  original: string;
  translatedSimple: string;
  translatedSmart: string;
  pronunciationTip: string;
}
