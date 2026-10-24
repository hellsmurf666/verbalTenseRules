// Tense definitions. Each tense produces three tables (Aff / Neg / Int).
// A "row" is { subject, aux, lex, contractedAux, contractedNeg }.
// Example sentences come from a small fixed verb so learners see real usage.

const PRONOUNS = ["I", "you", "he / she / it", "we", "you (pl.)", "they"];
const SHORT_PRONOUNS = ["I", "You", "He / She / It", "We", "You", "They"];

// Returns { rows: [{ pronoun, parts: [...] }, ...], example: "..." }
// Each `parts` entry is a token: { t: 'aux'|'neg'|'lex'|'pron'|'plain', text }

function buildTense(c, tense, polarity) {
  // c = conjugation object
  const isInt = polarity === "int";
  const isNeg = polarity === "neg";

  const rows = [];

  const push = (subject, parts, ex) => rows.push({ subject, parts, ex });

  // helpers
  const lex = (t) => ({ t: "lex", text: t });
  const aux = (t) => ({ t: "aux", text: t });
  const neg = (t) => ({ t: "neg", text: t });
  const pron = (t) => ({ t: "pron", text: t });
  const plain = (t) => ({ t: "plain", text: t });
  // inverted subject: lowercase except "I"
  const pronInt = (t) => pron(t === "I" ? t : t.toLowerCase());

  const pronounsCanon = ["I", "You", "He / She / It", "We", "You (pl.)", "They"];

  // ----------- PRESENT SIMPLE (aux: do) -----------
  if (tense === "pres-simple" && c.base === "be") {
    // "be" is its own auxiliary: no do-support (I am not, Am I?)
    const forms = ["am", "are", "is", "are", "are", "are"];
    pronounsCanon.forEach((p, i) => {
      if (polarity === "aff")      push(p, [pron(p), lex(forms[i])]);
      else if (polarity === "neg") push(p, [pron(p), lex(forms[i]), neg("not")]);
      else push(p, [lex(forms[i][0].toUpperCase() + forms[i].slice(1)), pronInt(p), plain("?")]);
    });
  } else if (tense === "pres-simple") {
    if (polarity === "aff") {
      // base form, 3rd sg → -s
      pronounsCanon.forEach((p, i) => {
        const v = (i === 2) ? c.third : c.base;
        push(p, [pron(p), lex(v)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p, i) => {
        const a = (i === 2) ? "does" : "do";
        push(p, [pron(p), aux(a), neg("not"), lex(c.base)]);
      });
    } else {
      pronounsCanon.forEach((p, i) => {
        const a = (i === 2) ? "Does" : "Do";
        push(p, [aux(a), pronInt(p), lex(c.base), plain("?")]);
      });
    }
  }

  // ----------- PRESENT CONTINUOUS (aux: be) -----------
  if (tense === "pres-cont") {
    const beAff = ["am", "are", "is", "are", "are", "are"];
    const beCap = ["Am", "Are", "Is", "Are", "Are", "Are"];
    if (polarity === "aff") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(beAff[i]), lex(c.ing)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(beAff[i]), neg("not"), lex(c.ing)]);
      });
    } else {
      pronounsCanon.forEach((p, i) => {
        push(p, [aux(beCap[i]), pronInt(p), lex(c.ing), plain("?")]);
      });
    }
  }

  // ----------- PRESENT PERFECT (aux: have) -----------
  if (tense === "pres-perf") {
    const haveAff = ["have", "have", "has", "have", "have", "have"];
    const haveCap = ["Have", "Have", "Has", "Have", "Have", "Have"];
    if (polarity === "aff") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(haveAff[i]), lex(c.pp)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(haveAff[i]), neg("not"), lex(c.pp)]);
      });
    } else {
      pronounsCanon.forEach((p, i) => {
        push(p, [aux(haveCap[i]), pronInt(p), lex(c.pp), plain("?")]);
      });
    }
  }

  // ----------- PAST SIMPLE (aux: did) -----------
  if (tense === "past-simple" && c.base === "be") {
    // "be" is its own auxiliary: no did-support (I was not, Was I?)
    const forms = ["was", "were", "was", "were", "were", "were"];
    pronounsCanon.forEach((p, i) => {
      if (polarity === "aff")      push(p, [pron(p), lex(forms[i])]);
      else if (polarity === "neg") push(p, [pron(p), lex(forms[i]), neg("not")]);
      else push(p, [lex(forms[i][0].toUpperCase() + forms[i].slice(1)), pronInt(p), plain("?")]);
    });
  } else if (tense === "past-simple") {
    if (polarity === "aff") {
      pronounsCanon.forEach((p) => {
        push(p, [pron(p), lex(c.past)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p) => {
        push(p, [pron(p), aux("did"), neg("not"), lex(c.base)]);
      });
    } else {
      pronounsCanon.forEach((p) => {
        push(p, [aux("Did"), pronInt(p), lex(c.base), plain("?")]);
      });
    }
  }

  // ----------- PAST CONTINUOUS (aux: was/were) -----------
  if (tense === "past-cont") {
    const beAff = ["was", "were", "was", "were", "were", "were"];
    const beCap = ["Was", "Were", "Was", "Were", "Were", "Were"];
    if (polarity === "aff") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(beAff[i]), lex(c.ing)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(beAff[i]), neg("not"), lex(c.ing)]);
      });
    } else {
      pronounsCanon.forEach((p, i) => {
        push(p, [aux(beCap[i]), pronInt(p), lex(c.ing), plain("?")]);
      });
    }
  }

  // ----------- PAST PERFECT (aux: had) -----------
  if (tense === "past-perf") {
    if (polarity === "aff") {
      pronounsCanon.forEach((p) => {
        push(p, [pron(p), aux("had"), lex(c.pp)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p) => {
        push(p, [pron(p), aux("had"), neg("not"), lex(c.pp)]);
      });
    } else {
      pronounsCanon.forEach((p) => {
        push(p, [aux("Had"), pronInt(p), lex(c.pp), plain("?")]);
      });
    }
  }

  // ----------- PRESENT PERFECT CONTINUOUS (aux: have + been) -----------
  if (tense === "pres-perf-cont") {
    const haveAff = ["have", "have", "has", "have", "have", "have"];
    const haveCap = ["Have", "Have", "Has", "Have", "Have", "Have"];
    if (polarity === "aff") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(haveAff[i]), aux("been"), lex(c.ing)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p, i) => {
        push(p, [pron(p), aux(haveAff[i]), neg("not"), aux("been"), lex(c.ing)]);
      });
    } else {
      pronounsCanon.forEach((p, i) => {
        push(p, [aux(haveCap[i]), pronInt(p), aux("been"), lex(c.ing), plain("?")]);
      });
    }
  }

  // ----------- PAST PERFECT CONTINUOUS (aux: had + been) -----------
  if (tense === "past-perf-cont") {
    if (polarity === "aff") {
      pronounsCanon.forEach((p) => {
        push(p, [pron(p), aux("had"), aux("been"), lex(c.ing)]);
      });
    } else if (polarity === "neg") {
      pronounsCanon.forEach((p) => {
        push(p, [pron(p), aux("had"), neg("not"), aux("been"), lex(c.ing)]);
      });
    } else {
      pronounsCanon.forEach((p) => {
        push(p, [aux("Had"), pronInt(p), aux("been"), lex(c.ing), plain("?")]);
      });
    }
  }

  return rows;
}

// Rule-of-thumb explanations per cell
const RULES = {
  "pres-simple": {
    aff:  "Subject + base form. Third-person singular adds <em>-s / -es / -ies</em>.",
    neg:  "Subject + <em>do / does</em> + <em>not</em> + base form.",
    int:  "<em>Do / Does</em> + subject + base form + ?",
  },
  "pres-cont": {
    aff:  "Subject + <em>am / is / are</em> + verb + <em>-ing</em>.",
    neg:  "Subject + <em>am / is / are</em> + <em>not</em> + verb + <em>-ing</em>.",
    int:  "<em>Am / Is / Are</em> + subject + verb + <em>-ing</em> + ?",
  },
  "pres-perf": {
    aff:  "Subject + <em>have / has</em> + past participle.",
    neg:  "Subject + <em>have / has</em> + <em>not</em> + past participle.",
    int:  "<em>Have / Has</em> + subject + past participle + ?",
  },
  "past-simple": {
    aff:  "Subject + past form (regular: <em>-ed</em>; irregular: memorise).",
    neg:  "Subject + <em>did</em> + <em>not</em> + base form.",
    int:  "<em>Did</em> + subject + base form + ?",
  },
  "past-cont": {
    aff:  "Subject + <em>was / were</em> + verb + <em>-ing</em>.",
    neg:  "Subject + <em>was / were</em> + <em>not</em> + verb + <em>-ing</em>.",
    int:  "<em>Was / Were</em> + subject + verb + <em>-ing</em> + ?",
  },
  "past-perf": {
    aff:  "Subject + <em>had</em> + past participle.",
    neg:  "Subject + <em>had</em> + <em>not</em> + past participle.",
    int:  "<em>Had</em> + subject + past participle + ?",
  },
  "pres-perf-cont": {
    aff:  "Subject + <em>have / has</em> + <em>been</em> + verb + <em>-ing</em>.",
    neg:  "Subject + <em>have / has</em> + <em>not</em> + <em>been</em> + verb + <em>-ing</em>.",
    int:  "<em>Have / Has</em> + subject + <em>been</em> + verb + <em>-ing</em> + ?",
  },
  "past-perf-cont": {
    aff:  "Subject + <em>had</em> + <em>been</em> + verb + <em>-ing</em>.",
    neg:  "Subject + <em>had</em> + <em>not</em> + <em>been</em> + verb + <em>-ing</em>.",
    int:  "<em>Had</em> + subject + <em>been</em> + verb + <em>-ing</em> + ?",
  },
};

// When-to-use blurbs (kept short)
const USAGE = {
  "pres-simple": "Habits, routines, facts and timetables.",
  "pres-cont":   "Actions happening right now or around now.",
  "pres-perf":   "Past actions with a link to the present.",
  "past-simple": "Completed actions at a definite past time.",
  "past-cont":   "Actions in progress at a moment in the past.",
  "past-perf":   "An action completed before another past action.",
  "pres-perf-cont": "An action that started in the past and continues up to now, or has just stopped with a visible result.",
  "past-perf-cont": "An action in progress up to a moment in the past, or until just before another past event.",
};

// Example sentences using "play" — re-rendered live with the chosen verb.
// Pattern: { subjectIndex, polarity, time?, extra? }
const EXAMPLES = {
  "pres-simple": [
    { si: 2, pol: "aff", tail: "tennis every Saturday." },
    { si: 0, pol: "neg", tail: "video games." },
    { si: 1, pol: "int", tail: "the piano" },
  ],
  "pres-cont": [
    { si: 0, pol: "aff", tail: "with the dog right now." },
    { si: 5, pol: "neg", tail: "in the garden." },
    { si: 2, pol: "int", tail: "alone" },
  ],
  "pres-perf": [
    { si: 3, pol: "aff", tail: "this song many times." },
    { si: 2, pol: "neg", tail: "for the school team." },
    { si: 5, pol: "int", tail: "before" },
  ],
  "past-simple": [
    { si: 0, pol: "aff", tail: "in the park yesterday." },
    { si: 2, pol: "neg", tail: "well last night." },
    { si: 1, pol: "int", tail: "after class" },
  ],
  "past-cont": [
    { si: 4, pol: "aff", tail: "when the bell rang." },
    { si: 0, pol: "neg", tail: "when she called." },
    { si: 2, pol: "int", tail: "alone at 8pm" },
  ],
  "past-perf": [
    { si: 0, pol: "aff", tail: "before they arrived." },
    { si: 5, pol: "neg", tail: "that song before." },
    { si: 2, pol: "int", tail: "the part already" },
  ],
  "pres-perf-cont": [
    { si: 3, pol: "aff", tail: "in the garden for two hours." },
    { si: 0, pol: "neg", tail: "much lately." },
    { si: 1, pol: "int", tail: "since morning" },
  ],
  "past-perf-cont": [
    { si: 5, pol: "aff", tail: "for an hour when it started to rain." },
    { si: 0, pol: "neg", tail: "for long before he arrived." },
    { si: 2, pol: "int", tail: "all morning" },
  ],
};

// "be" cannot take the "play" tails above (*"He is tennis"*), so it gets its own.
// Same order as EXAMPLES[tense].
const BE_TAILS = {
  "pres-simple":    ["a student at this school.", "late for class.", "at home"],
  "pres-cont":      ["careful right now.", "polite in class.", "silly"],
  "pres-perf":      ["here many times.", "to London.", "there before"],
  "past-simple":    ["at the park yesterday.", "ready last night.", "late for class"],
  "past-cont":      ["noisy when the bell rang.", "rude when she called.", "quiet at 8pm"],
  "past-perf":      ["at home before they arrived.", "at that concert before.", "there already"],
  "pres-perf-cont": ["patient for two hours.", "helpful lately.", "difficult since morning"],
  "past-perf-cont": ["very quiet for an hour when it started to rain.", "rude before he arrived.", "silly all morning"],
};

function buildExample(c, tenseId, ex) {
  if (c.base === "be" && BE_TAILS[tenseId]) {
    const i = EXAMPLES[tenseId].indexOf(ex);
    if (i >= 0) ex = { ...ex, tail: BE_TAILS[tenseId][i] };
  }
  const rows = buildTense(c, tenseId, ex.pol);
  const row = rows[ex.si];
  const text = row.parts.map(p => p.text).join(" ").replace(" ?", "?");
  if (ex.pol === "int") return text.replace(/\?$/, "") + " " + ex.tail + "?";
  return text + " " + ex.tail;
}

window.buildTense = buildTense;
window.RULES = RULES;
window.USAGE = USAGE;
window.EXAMPLES = EXAMPLES;
window.buildExample = buildExample;
window.PRONOUNS = PRONOUNS;
