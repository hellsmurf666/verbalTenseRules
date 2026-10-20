// English verb conjugator
// Handles regular verbs + a dictionary of English irregular verbs (base verbs and their
// prefixed compounds). Verbs not listed in IRREGULARS are treated as regular.
// Returns the bare lexical form needed for each tense; tense scaffolding
// (auxiliaries, negation, inversion) is composed in the UI layer.

const IRREGULARS = {
  // base: { past, pp }  — variants separated by "/" (first = preferred)
  // ---- base irregular verbs ----
  "arise":           { past: "arose", pp: "arisen" },
  "awake":           { past: "awoke", pp: "awoken" },
  "be":              { past: "was/were", pp: "been" },
  "bear":            { past: "bore", pp: "borne" },
  "beat":            { past: "beat", pp: "beaten" },
  "become":          { past: "became", pp: "become" },
  "beget":           { past: "begot", pp: "begotten" },
  "begin":           { past: "began", pp: "begun" },
  "behold":          { past: "beheld", pp: "beheld" },
  "bend":            { past: "bent", pp: "bent" },
  "beseech":         { past: "besought", pp: "besought" },
  "bet":             { past: "bet", pp: "bet" },
  "bid":             { past: "bid", pp: "bid" },
  "bind":            { past: "bound", pp: "bound" },
  "bite":            { past: "bit", pp: "bitten" },
  "bleed":           { past: "bled", pp: "bled" },
  "blow":            { past: "blew", pp: "blown" },
  "break":           { past: "broke", pp: "broken" },
  "breed":           { past: "bred", pp: "bred" },
  "bring":           { past: "brought", pp: "brought" },
  "broadcast":       { past: "broadcast", pp: "broadcast" },
  "build":           { past: "built", pp: "built" },
  "burn":            { past: "burned/burnt", pp: "burned/burnt" },
  "burst":           { past: "burst", pp: "burst" },
  "buy":             { past: "bought", pp: "bought" },
  "cast":            { past: "cast", pp: "cast" },
  "catch":           { past: "caught", pp: "caught" },
  "choose":          { past: "chose", pp: "chosen" },
  "cling":           { past: "clung", pp: "clung" },
  "come":            { past: "came", pp: "come" },
  "cost":            { past: "cost", pp: "cost" },
  "creep":           { past: "crept", pp: "crept" },
  "cut":             { past: "cut", pp: "cut" },
  "deal":            { past: "dealt", pp: "dealt" },
  "dig":             { past: "dug", pp: "dug" },
  "dive":            { past: "dived/dove", pp: "dived" },
  "do":              { past: "did", pp: "done" },
  "draw":            { past: "drew", pp: "drawn" },
  "dream":           { past: "dreamed/dreamt", pp: "dreamed/dreamt" },
  "drink":           { past: "drank", pp: "drunk" },
  "drive":           { past: "drove", pp: "driven" },
  "dwell":           { past: "dwelt", pp: "dwelt" },
  "eat":             { past: "ate", pp: "eaten" },
  "fall":            { past: "fell", pp: "fallen" },
  "feed":            { past: "fed", pp: "fed" },
  "feel":            { past: "felt", pp: "felt" },
  "fight":           { past: "fought", pp: "fought" },
  "find":            { past: "found", pp: "found" },
  "flee":            { past: "fled", pp: "fled" },
  "fling":           { past: "flung", pp: "flung" },
  "fly":             { past: "flew", pp: "flown" },
  "forbid":          { past: "forbade", pp: "forbidden" },
  "forget":          { past: "forgot", pp: "forgotten" },
  "forgive":         { past: "forgave", pp: "forgiven" },
  "forsake":         { past: "forsook", pp: "forsaken" },
  "freeze":          { past: "froze", pp: "frozen" },
  "get":             { past: "got", pp: "got/gotten", note: "past participle: got (UK) · gotten (US)" },
  "give":            { past: "gave", pp: "given" },
  "go":              { past: "went", pp: "gone" },
  "grind":           { past: "ground", pp: "ground" },
  "grow":            { past: "grew", pp: "grown" },
  "hang":            { past: "hung", pp: "hung" },
  "have":            { past: "had", pp: "had" },
  "hear":            { past: "heard", pp: "heard" },
  "hide":            { past: "hid", pp: "hidden" },
  "hit":             { past: "hit", pp: "hit" },
  "hold":            { past: "held", pp: "held" },
  "hurt":            { past: "hurt", pp: "hurt" },
  "keep":            { past: "kept", pp: "kept" },
  "kneel":           { past: "knelt/kneeled", pp: "knelt/kneeled" },
  "know":            { past: "knew", pp: "known" },
  "lay":             { past: "laid", pp: "laid" },
  "lead":            { past: "led", pp: "led" },
  "lean":            { past: "leaned/leant", pp: "leaned/leant" },
  "leap":            { past: "leaped/leapt", pp: "leaped/leapt" },
  "learn":           { past: "learned/learnt", pp: "learned/learnt" },
  "leave":           { past: "left", pp: "left" },
  "lend":            { past: "lent", pp: "lent" },
  "let":             { past: "let", pp: "let" },
  "lie":             { past: "lied/lay", pp: "lied/lain", note: "lie = tell an untruth → lied, lied · lie = recline → lay, lain" },
  "light":           { past: "lit", pp: "lit" },
  "lose":            { past: "lost", pp: "lost" },
  "make":            { past: "made", pp: "made" },
  "mean":            { past: "meant", pp: "meant" },
  "meet":            { past: "met", pp: "met" },
  "mow":             { past: "mowed", pp: "mown/mowed" },
  "pay":             { past: "paid", pp: "paid" },
  "plead":           { past: "pleaded/pled", pp: "pleaded/pled" },
  "prove":           { past: "proved", pp: "proven/proved" },
  "put":             { past: "put", pp: "put" },
  "quit":            { past: "quit", pp: "quit" },
  "read":            { past: "read", pp: "read" },
  "rend":            { past: "rent", pp: "rent" },
  "ride":            { past: "rode", pp: "ridden" },
  "ring":            { past: "rang", pp: "rung" },
  "rise":            { past: "rose", pp: "risen" },
  "run":             { past: "ran", pp: "run" },
  "saw":             { past: "sawed", pp: "sawn/sawed" },
  "say":             { past: "said", pp: "said" },
  "see":             { past: "saw", pp: "seen" },
  "seek":            { past: "sought", pp: "sought" },
  "sell":            { past: "sold", pp: "sold" },
  "send":            { past: "sent", pp: "sent" },
  "set":             { past: "set", pp: "set" },
  "sew":             { past: "sewed", pp: "sewn/sewed" },
  "shake":           { past: "shook", pp: "shaken" },
  "shear":           { past: "sheared", pp: "shorn/sheared" },
  "shed":            { past: "shed", pp: "shed" },
  "shine":           { past: "shone", pp: "shone" },
  "shoot":           { past: "shot", pp: "shot" },
  "show":            { past: "showed", pp: "shown/showed" },
  "shrink":          { past: "shrank", pp: "shrunk" },
  "shut":            { past: "shut", pp: "shut" },
  "sing":            { past: "sang", pp: "sung" },
  "sink":            { past: "sank", pp: "sunk" },
  "sit":             { past: "sat", pp: "sat" },
  "slay":            { past: "slew", pp: "slain" },
  "sleep":           { past: "slept", pp: "slept" },
  "slide":           { past: "slid", pp: "slid" },
  "sling":           { past: "slung", pp: "slung" },
  "slit":            { past: "slit", pp: "slit" },
  "smell":           { past: "smelled/smelt", pp: "smelled/smelt" },
  "sneak":           { past: "sneaked/snuck", pp: "sneaked/snuck" },
  "sow":             { past: "sowed", pp: "sown/sowed" },
  "speak":           { past: "spoke", pp: "spoken" },
  "speed":           { past: "sped", pp: "sped" },
  "spell":           { past: "spelled/spelt", pp: "spelled/spelt" },
  "spend":           { past: "spent", pp: "spent" },
  "spill":           { past: "spilled/spilt", pp: "spilled/spilt" },
  "spin":            { past: "spun", pp: "spun" },
  "spit":            { past: "spat", pp: "spat" },
  "split":           { past: "split", pp: "split" },
  "spoil":           { past: "spoiled/spoilt", pp: "spoiled/spoilt" },
  "spread":          { past: "spread", pp: "spread" },
  "spring":          { past: "sprang", pp: "sprung" },
  "stand":           { past: "stood", pp: "stood" },
  "steal":           { past: "stole", pp: "stolen" },
  "stick":           { past: "stuck", pp: "stuck" },
  "sting":           { past: "stung", pp: "stung" },
  "stink":           { past: "stank", pp: "stunk" },
  "stride":          { past: "strode", pp: "stridden" },
  "strike":          { past: "struck", pp: "struck" },
  "string":          { past: "strung", pp: "strung" },
  "strive":          { past: "strove", pp: "striven" },
  "swear":           { past: "swore", pp: "sworn" },
  "sweep":           { past: "swept", pp: "swept" },
  "swell":           { past: "swelled", pp: "swollen/swelled" },
  "swim":            { past: "swam", pp: "swum" },
  "swing":           { past: "swung", pp: "swung" },
  "take":            { past: "took", pp: "taken" },
  "teach":           { past: "taught", pp: "taught" },
  "tear":            { past: "tore", pp: "torn" },
  "tell":            { past: "told", pp: "told" },
  "think":           { past: "thought", pp: "thought" },
  "throw":           { past: "threw", pp: "thrown" },
  "thrust":          { past: "thrust", pp: "thrust" },
  "tread":           { past: "trod", pp: "trodden" },
  "understand":      { past: "understood", pp: "understood" },
  "wake":            { past: "woke", pp: "woken" },
  "wear":            { past: "wore", pp: "worn" },
  "weave":           { past: "wove", pp: "woven" },
  "weep":            { past: "wept", pp: "wept" },
  "wet":             { past: "wet", pp: "wet" },
  "win":             { past: "won", pp: "won" },
  "wind":            { past: "wound", pp: "wound" },
  "wring":           { past: "wrung", pp: "wrung" },
  "write":           { past: "wrote", pp: "written" },

  // ---- compounds / prefixed forms (inherit the root's forms) ----
  "babysit":         { past: "babysat", pp: "babysat" },
  "breastfeed":      { past: "breastfed", pp: "breastfed" },
  "forecast":        { past: "forecast", pp: "forecast" },
  "foresee":         { past: "foresaw", pp: "foreseen" },
  "foretell":        { past: "foretold", pp: "foretold" },
  "forgo":           { past: "forwent", pp: "forgone" },
  "inbreed":         { past: "inbred", pp: "inbred" },
  "inlay":           { past: "inlaid", pp: "inlaid" },
  "inset":           { past: "inset", pp: "inset" },
  "interbreed":      { past: "interbred", pp: "interbred" },
  "interweave":      { past: "interwove", pp: "interwoven" },
  "miscast":         { past: "miscast", pp: "miscast" },
  "misdo":           { past: "misdid", pp: "misdone" },
  "mislay":          { past: "mislaid", pp: "mislaid" },
  "mislead":         { past: "misled", pp: "misled" },
  "misread":         { past: "misread", pp: "misread" },
  "mistake":         { past: "mistook", pp: "mistaken" },
  "misunderstand":   { past: "misunderstood", pp: "misunderstood" },
  "offset":          { past: "offset", pp: "offset" },
  "outbid":          { past: "outbid", pp: "outbid" },
  "outdo":           { past: "outdid", pp: "outdone" },
  "outgrow":         { past: "outgrew", pp: "outgrown" },
  "outrun":          { past: "outran", pp: "outrun" },
  "outsell":         { past: "outsold", pp: "outsold" },
  "outshoot":        { past: "outshot", pp: "outshot" },
  "outspend":        { past: "outspent", pp: "outspent" },
  "overbid":         { past: "overbid", pp: "overbid" },
  "overbuild":       { past: "overbuilt", pp: "overbuilt" },
  "overcome":        { past: "overcame", pp: "overcome" },
  "overdo":          { past: "overdid", pp: "overdone" },
  "overdraw":        { past: "overdrew", pp: "overdrawn" },
  "overeat":         { past: "overate", pp: "overeaten" },
  "overfeed":        { past: "overfed", pp: "overfed" },
  "overgrow":        { past: "overgrew", pp: "overgrown" },
  "overhang":        { past: "overhung", pp: "overhung" },
  "overhear":        { past: "overheard", pp: "overheard" },
  "overlay":         { past: "overlaid", pp: "overlaid" },
  "overpay":         { past: "overpaid", pp: "overpaid" },
  "override":        { past: "overrode", pp: "overridden" },
  "overrun":         { past: "overran", pp: "overrun" },
  "oversee":         { past: "oversaw", pp: "overseen" },
  "overshoot":       { past: "overshot", pp: "overshot" },
  "oversleep":       { past: "overslept", pp: "overslept" },
  "overspend":       { past: "overspent", pp: "overspent" },
  "overtake":        { past: "overtook", pp: "overtaken" },
  "overthink":       { past: "overthought", pp: "overthought" },
  "overthrow":       { past: "overthrew", pp: "overthrown" },
  "overwrite":       { past: "overwrote", pp: "overwritten" },
  "partake":         { past: "partook", pp: "partaken" },
  "prepay":          { past: "prepaid", pp: "prepaid" },
  "proofread":       { past: "proofread", pp: "proofread" },
  "rebid":           { past: "rebid", pp: "rebid" },
  "rebind":          { past: "rebound", pp: "rebound" },
  "rebuild":         { past: "rebuilt", pp: "rebuilt" },
  "recast":          { past: "recast", pp: "recast" },
  "redo":            { past: "redid", pp: "redone" },
  "redraw":          { past: "redrew", pp: "redrawn" },
  "refeed":          { past: "refed", pp: "refed" },
  "refreeze":        { past: "refroze", pp: "refrozen" },
  "regrow":          { past: "regrew", pp: "regrown" },
  "remake":          { past: "remade", pp: "remade" },
  "repay":           { past: "repaid", pp: "repaid" },
  "reread":          { past: "reread", pp: "reread" },
  "rerun":           { past: "reran", pp: "rerun" },
  "resell":          { past: "resold", pp: "resold" },
  "reset":           { past: "reset", pp: "reset" },
  "reshoot":         { past: "reshot", pp: "reshot" },
  "retake":          { past: "retook", pp: "retaken" },
  "retell":          { past: "retold", pp: "retold" },
  "rethink":         { past: "rethought", pp: "rethought" },
  "rewind":          { past: "rewound", pp: "rewound" },
  "rewrite":         { past: "rewrote", pp: "rewritten" },
  "sublet":          { past: "sublet", pp: "sublet" },
  "telecast":        { past: "telecast", pp: "telecast" },
  "typecast":        { past: "typecast", pp: "typecast" },
  "unbind":          { past: "unbound", pp: "unbound" },
  "underbid":        { past: "underbid", pp: "underbid" },
  "undercut":        { past: "undercut", pp: "undercut" },
  "underfeed":       { past: "underfed", pp: "underfed" },
  "undergo":         { past: "underwent", pp: "undergone" },
  "underpay":        { past: "underpaid", pp: "underpaid" },
  "undersell":       { past: "undersold", pp: "undersold" },
  "undershoot":      { past: "undershot", pp: "undershot" },
  "underspend":      { past: "underspent", pp: "underspent" },
  "undertake":       { past: "undertook", pp: "undertaken" },
  "underwrite":      { past: "underwrote", pp: "underwritten" },
  "undo":            { past: "undid", pp: "undone" },
  "unfreeze":        { past: "unfroze", pp: "unfrozen" },
  "unmake":          { past: "unmade", pp: "unmade" },
  "unwind":          { past: "unwound", pp: "unwound" },
  "uphold":          { past: "upheld", pp: "upheld" },
  "upset":           { past: "upset", pp: "upset" },
  "waylay":          { past: "waylaid", pp: "waylaid" },
  "withdraw":        { past: "withdrew", pp: "withdrawn" },
  "withhold":        { past: "withheld", pp: "withheld" },
  "withstand":       { past: "withstood", pp: "withstood" },
};

// ---- spelling rules ----

const VOWELS = "aeiou";
const isVowel = (c) => c && VOWELS.includes(c.toLowerCase());

// Doubling final consonant for -ing / -ed (CVC, single syllable, not w/x/y final).
// Multi-syllable verbs with stress on the last syllable must be listed explicitly.
const STRESSED_FINAL = new Set([
  "begin", "beget", "forget", "forbid", "overrun", "outrun", "rerun", "upset", "offset",
  "reset", "inset", "undercut", "outbid", "overbid", "underbid", "rebid", "sublet", "babysit",
  "regret", "admit", "commit", "permit", "omit", "submit", "transmit", "prefer", "refer",
  "occur", "recur", "incur", "control", "equip", "expel", "compel", "repel", "propel",
  "rebel", "excel", "defer", "confer", "infer", "deter",
]);

function syllables(w) {
  const m = w.replace(/[^aeiouy]e$/, (x) => x[0]).match(/[aeiouy]+/g);
  return m ? m.length : 0;
}

function shouldDouble(base) {
  if (STRESSED_FINAL.has(base)) return true;
  const w = base.replace(/qu/g, "kw"); // quit → kwit (the u is a consonant)
  if (syllables(w) !== 1) return false;
  return /[^aeiou][aeiou][^aeiouwxy]$/.test(w);
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
  if (/[^aeiou]o$/.test(base)) return base + "es"; // do/go compounds: undo→undoes, undergo→undergoes
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
    note: IRREGULARS[v] ? IRREGULARS[v].note : undefined,
  };
}

window.conjugate = conjugate;
