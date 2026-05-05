import { NL_PHONEMES } from "./taalContent";

let voices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (typeof window === "undefined") return;
  voices = speechSynthesis.getVoices();
  if (voices.length === 0) {
    speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); };
  }
}

function bestVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) loadVoices();
  return voices.find(v => v.lang.startsWith(lang) && v.localService)
    ?? voices.find(v => v.lang.startsWith(lang));
}

function say(text: string, lang = "nl-NL", rate = 0.85, pitch = 1.1) {
  if (typeof window === "undefined") return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = lang;
  u.rate  = rate;
  u.pitch = pitch;
  const v = bestVoice(lang);
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// Spreek de klanknaam uit van een letter (niet de letternaam)
export function speakPhoneme(letter: string) {
  const phoneme = NL_PHONEMES[letter.toLowerCase()] ?? letter;
  say(phoneme, "nl-NL", 0.75, 1.2);
}

// Spreek een heel woord uit
export function speakWord(word: string) {
  say(word, "nl-NL", 0.75, 1.0);
}

// Spreek een segment (klank in een woord) uit
export function speakSegment(segment: string) {
  const phoneme = NL_PHONEMES[segment.toLowerCase()] ?? segment;
  say(phoneme, "nl-NL", 0.65, 1.15);
}

// Init voices alvast bij eerste gebruik
if (typeof window !== "undefined") loadVoices();
