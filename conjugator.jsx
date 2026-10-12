// English verb conjugator
// Handles regular verbs + a small dictionary of common irregulars.
// Returns the bare lexical form needed for each tense; tense scaffolding
// (auxiliaries, negation, inversion) is composed in the UI layer.

const IRREGULARS = {
  // base: { past, pp }
  "be":      { past: "was/were", pp: "been" },
  "have":    { past: "had", pp: "had" },
  "do":      { past: "did", pp: "done" },
  "go":      { past: "went", pp: "gone" },
  "make":    { past: "made", pp: "made" },
  "take":    { past: "took", pp: "taken" },
  "see":     { past: "saw", pp: "seen" },
  "come":    { past: "came", pp: "come" },
  "get":     { past: "got", pp: "gotten" },
  "give":    { past: "gave", pp: "given" },
  "find":    { past: "found", pp: "found" },
  "think":   { past: "thought", pp: "thought" },
  "know":    { past: "knew", pp: "known" },
  "say":     { past: "said", pp: "said" },
  "tell":    { past: "told", pp: "told" },
  "eat":     { past: "ate", pp: "eaten" },
  "drink":   { past: "drank", pp: "drunk" },
  "run":     { past: "ran", pp: "run" },
  "swim":    { past: "swam", pp: "swum" },
  "write":   { past: "wrote", pp: "written" },
  "read":    { past: "read", pp: "read" },
  "speak":   { past: "spoke", pp: "spoken" },
  "buy":     { past: "bought", pp: "bought" },
  "bring":   { past: "brought", pp: "brought" },
  "catch":   { past: "caught", pp: "caught" },
  "teach":   { past: "taught", pp: "taught" },
  "leave":   { past: "left", pp: "left" },
  "feel":    { past: "felt", pp: "felt" },
  "sleep":   { past: "slept", pp: "slept" },
  "begin":   { past: "began", pp: "begun" },
  "break":   { past: "broke", pp: "broken" },
  "choose":  { past: "chose", pp: "chosen" },
  "drive":   { past: "drove", pp: "driven" },
  "fall":    { past: "fell", pp: "fallen" },
  "fly":     { past: "flew", pp: "flown" },
  "forget":  { past: "forgot", pp: "forgotten" },
  "grow":    { past: "grew", pp: "grown" },
  "hide":    { past: "hid", pp: "hidden" },
  "lose":    { past: "lost", pp: "lost" },
  "meet":    { past: "met", pp: "met" },
  "pay":     { past: "paid", pp: "paid" },
  "ride":    { past: "rode", pp: "ridden" },
  "rise":    { past: "rose", pp: "risen" },
  "send":    { past: "sent", pp: "sent" },
  "sing":    { past: "sang", pp: "sung" },
  "sit":     { past: "sat", pp: "sat" },
  "stand":   { past: "stood", pp: "stood" },
  "win":     { past: "won", pp: "won" },
  "build":   { past: "built", pp: "built" },
  "hold":    { past: "held", pp: "held" },
  "keep":    { past: "kept", pp: "kept" },
  "lead":    { past: "led", pp: "led" },
  "spend":   { past: "spent", pp: "spent" },
  "understand": { past: "understood", pp: "understood" },
  "wear":    { past: "wore", pp: "worn" },
  "put":     { past: "put", pp: "put" },
  "cut":     { past: "cut", pp: "cut" },
  "let":     { past: "let", pp: "let" },
  "hit":     { past: "hit", pp: "hit" },
  "cost":    { past: "cost", pp: "cost" },
};

// ---- spelling rules ----

const VOWELS = "aeiou";
const isVowel = (c) => c && VOWELS.includes(c.toLowerCase());

// Doubling final consonant for -ing / -ed (CVC, single syllable, not w/x/y final).
function shouldDouble(base) {
  const len = base.length;
  if (len < 3) return false;
  const last = base[len - 1];
  const mid  = base[len - 2];
  const first = base[len - 3];
  if ("wxy".includes(last)) return false;
  if (!/[a-z]/i.test(last) || isVowel(last)) return false;
  if (!isVowel(mid)) return false;
  if (isVowel(first)) return false;
  // crude "single syllable" heuristic: length ≤ 5 OR ends in stressed-consonant pattern.
  // For a teaching reference we accept the common short verbs (run→running, sit→sitting, plan→planning).
  return len <= 5;
}

function ingForm(base) {
  if (base === "be") return "being";
  if (base === "have") return "having";
  if (base.endsWith("ie")) return base.slice(0, -2) + "ying"; // lie→lying
  if (base.endsWith("e") && base.length > 2 && !base.endsWith("ee") && !base.endsWith("ye") && !base.endsWith("oe")) {
    return base.slice(0, -1) + "ing";
  }
  if (shouldDouble(base)) return base + base[base.length - 1] + "ing";
  return base + "ing";
}

function thirdPerson(base) {
  if (base === "be")   return "is";
  if (base === "have") return "has";
  if (base === "do")   return "does";
  if (base === "go")   return "goes";
  if (/(s|x|z|ch|sh)$/.test(base)) return base + "es";
  if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + "ies";
  return base + "s";
}

function pastSimple(base) {
  if (IRREGULARS[base]) return IRREGULARS[base].past;
  if (base.endsWith("e")) return base + "d";
  if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + "ied";
  if (shouldDouble(base)) return base + base[base.length - 1] + "ed";
  return base + "ed";
}

function pastParticiple(base) {
  if (IRREGULARS[base]) return IRREGULARS[base].pp;
  return pastSimple(base); // regular: same as past simple
}

function conjugate(rawVerb) {
  let v = (rawVerb || "").trim().toLowerCase();
  if (v.startsWith("to ")) v = v.slice(3);
  if (!v) v = "play";
  return {
    base: v,
    ing: ingForm(v),
    third: thirdPerson(v),
    past: pastSimple(v),
    pp:   pastParticiple(v),
    isIrregular: !!IRREGULARS[v],
  };
}

window.conjugate = conjugate;
