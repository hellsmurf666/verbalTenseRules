import React, { useState, useEffect, useMemo } from "react";

// Main app — verb conjugation reference, table layout matching the sketch.
// Structure:
//   Row 1: [Verb infinitive] [Simple] [Continuous] [Perfect] [Perfect Continuous]
//   Row 2: [aux. verb]       [to do]  [to be]      [to have] [to have been]
//   Row 3: [Present]         [pres-simple] [pres-cont] [pres-perf] [pres-perf-cont]
//   Row 4: [Past]            [past-simple] [past-cont] [past-perf] [past-perf-cont]
// Each tense cell shows a compact summary, expands to reveal Aff/Neg/Int sub-tables.

const POLARITIES = [
  { id: "aff", label: "Affirmative", glyph: "+", tone: "aff" },
  { id: "neg", label: "Negative",    glyph: "−", tone: "neg" },
  { id: "int", label: "Interrogative", glyph: "?", tone: "int" },
];

// ---------- token rendering ----------
function Sentence({ parts }) {
  return (
    <span className="sentence">
      {parts.map((p, i) => {
        const isPunct = p.t === "plain" && /^[?.!,]/.test(p.text);
        return (
          <React.Fragment key={i}>
            {i > 0 && !isPunct && <span className="sp"> </span>}
            <span className={`tok tok-${p.t}`}>{p.text}</span>
          </React.Fragment>
        );
      })}
    </span>
  );
}

function ConjRow({ row }) {
  const parts = row.parts;
  const pronIdx = parts.findIndex(p => p.t === "pron");
  if (pronIdx === -1) {
    return (
      <div className="cr">
        <div className="cr-pron"></div>
        <div className="cr-rest"><Sentence parts={parts} /></div>
      </div>
    );
  }
  const pron = parts[pronIdx];
  const before = parts.slice(0, pronIdx);
  const after  = parts.slice(pronIdx + 1);

  return (
    <div className="cr">
      {before.length > 0 && (
        <div className="cr-aux-pre"><Sentence parts={before} /></div>
      )}
      <div className="cr-pron"><span className="tok tok-pron">{pron.text}</span></div>
      <div className="cr-rest"><Sentence parts={after} /></div>
    </div>
  );
}

function PolarityBlock({ pol, tense, conj }) {
  const rows = window.buildTense(conj, tense.id, pol.id);
  const rule = window.RULES[tense.id][pol.id];
  return (
    <div className={`pol-block tone-${pol.tone}`}>
      <header className="pol-head">
        <span className="pol-glyph">{pol.glyph}</span>
        <span className="pol-name">{pol.label}</span>
      </header>
      <div className="pol-rule" dangerouslySetInnerHTML={{ __html: rule }} />
      <div className="pol-rows">
        {rows.map((r, i) => <ConjRow key={i} row={r} />)}
      </div>
    </div>
  );
}

// ---------- Compact summary inside a closed tense cell ----------
function TenseSummary({ tense, conj }) {
  // Pick one Affirmative example sentence for the chosen verb (3rd person sg.)
  const affRows = window.buildTense(conj, tense.id, "aff");
  const negRows = window.buildTense(conj, tense.id, "neg");
  const intRows = window.buildTense(conj, tense.id, "int");

  // Use the 3rd-person row (index 2) as the canonical preview
  const preview = (rows) => {
    const r = rows[2];
    return r.parts;
  };

  return (
    <div className="tense-summary">
      <div className="ts-line tone-aff">
        <span className="ts-tag">+</span>
        <Sentence parts={preview(affRows)} />
      </div>
      <div className="ts-line tone-neg">
        <span className="ts-tag">−</span>
        <Sentence parts={preview(negRows)} />
      </div>
      <div className="ts-line tone-int">
        <span className="ts-tag">?</span>
        <Sentence parts={preview(intRows)} />
      </div>
    </div>
  );
}

// ---------- Tense cell ----------
function TenseCell({ tense, conj, expanded, onToggle, showExample }) {
  const usage = window.USAGE[tense.id];

  return (
    <div className={`tense-cell ${expanded ? "is-open" : ""}`} data-tense={tense.id}>
      <div className="tc-head">
        <div className="tc-name">{tense.row} {tense.col.toLowerCase()}</div>
        <div className="tc-usage">{usage}</div>
        <button className="tc-toggle" onClick={onToggle} aria-expanded={expanded} aria-label={expanded ? "Collapse" : "Expand"}>
          {expanded ? "−" : "+"}
        </button>
      </div>

      {!expanded && <TenseSummary tense={tense} conj={conj} />}

      {expanded && (
        <div className="tc-body">
          <div className="tc-pol-stack">
            {POLARITIES.map(pol => (
              <PolarityBlock key={pol.id} pol={pol} tense={tense} conj={conj} />
            ))}
          </div>
          {showExample && (
            <div className="tc-examples">
              <div className="tc-ex-label">in context (with “play”)</div>
              <div className="tc-ex-list">
                {window.EXAMPLES[tense.id].map((e, i) => {
                  const playConj = { base: "play", ing: "playing", third: "plays", past: "played", pp: "played" };
                  const t = window.buildExample(playConj, tense.id, e);
                  const tag = e.pol === "aff" ? "+" : e.pol === "neg" ? "−" : "?";
                  return (
                    <div key={i} className={`tc-ex tone-${e.pol}`}>
                      <span className="tc-ex-tag">{tag}</span>
                      <span className="tc-ex-text">{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Verb infinitive cell (left column, present/past rows) ----------
function VerbCell({ rowLabel, conj, accent }) {
  return (
    <div className={`verb-cell verb-cell-${accent}`}>
      <div className="vc-row-label">{rowLabel}</div>
      <div className="vc-verb">
        <span className="vc-to">to</span>
        <span className="vc-base">{conj.base}</span>
      </div>
      <div className="vc-forms">
        {accent === "present" ? (
          <>
            <div className="vc-form"><span className="vc-tag">3rd sg.</span><b>{conj.third}</b></div>
            <div className="vc-form"><span className="vc-tag">-ing</span><b>{conj.ing}</b></div>
            <div className="vc-form"><span className="vc-tag">past part.</span><b>{conj.pp}</b></div>
          </>
        ) : (
          <>
            <div className="vc-form"><span className="vc-tag">past</span><b>{conj.past}</b></div>
            <div className="vc-form"><span className="vc-tag">-ing</span><b>{conj.ing}</b></div>
            <div className="vc-form"><span className="vc-tag">past part.</span><b>{conj.pp}</b></div>
          </>
        )}
      </div>
      {conj.isIrregular && <div className="vc-irreg">irregular verb</div>}
    </div>
  );
}

// ---------- App ----------
function App() {
  const defaults = window.TWEAK_DEFAULTS;
  const [tweaks, setTweak] = window.useTweaks(defaults);

  const [verb, setVerb] = useState(tweaks.verb || "play");
  useEffect(() => {
    if (tweaks.verb && tweaks.verb !== verb) setVerb(tweaks.verb);
  }, [tweaks.verb]);

  const handleVerbChange = (v) => {
    setVerb(v);
    setTweak("verb", v);
  };

  const conj = useMemo(() => window.conjugate(verb), [verb]);

  const [open, setOpen] = useState({});
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));
  const allOpen = ["pres-simple","pres-cont","pres-perf","pres-perf-cont","past-simple","past-cont","past-perf","past-perf-cont"]
    .every(id => open[id]);
  const setAll = (v) => setOpen({
    "pres-simple": v, "pres-cont": v, "pres-perf": v, "pres-perf-cont": v,
    "past-simple": v, "past-cont": v, "past-perf": v, "past-perf-cont": v,
  });

  const showExample = tweaks.showExamples !== false;
  const theme = tweaks.theme || "warm";

  const [visibleCols, setVisibleCols] = useState({
    simple: true,
    cont: true,
    perf: true,
    "perf-cont": true,
  });

  const COLS = [
    { key: "simple", title: "Simple", aux: "do", presentId: "pres-simple", pastId: "past-simple" },
    { key: "cont", title: "Continuous", aux: "be", presentId: "pres-cont", pastId: "past-cont" },
    { key: "perf", title: "Perfect", aux: "have", presentId: "pres-perf", pastId: "past-perf" },
    { key: "perf-cont", title: "Perfect Continuous", aux: "have been", presentId: "pres-perf-cont", pastId: "past-perf-cont" },
  ];
  const shownCols = COLS.filter(c => visibleCols[c.key]);
  const displayedCols = shownCols.length > 0 ? shownCols : [COLS[0]];

  const toggleCol = (key) => {
    setVisibleCols(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const count = Object.values(next).filter(Boolean).length;
      // Keep at least one tense column visible so the table always has content.
      if (count === 0) return prev;
      return next;
    });
  };

  const TENSES = {
    "pres-simple": { id: "pres-simple", row: "Present", col: "Simple",     auxLabel: "do" },
    "pres-cont":   { id: "pres-cont",   row: "Present", col: "Continuous", auxLabel: "be" },
    "pres-perf":   { id: "pres-perf",   row: "Present", col: "Perfect",    auxLabel: "have" },
    "pres-perf-cont": { id: "pres-perf-cont", row: "Present", col: "Perfect Continuous", auxLabel: "have been" },
    "past-simple": { id: "past-simple", row: "Past",    col: "Simple",     auxLabel: "did" },
    "past-cont":   { id: "past-cont",   row: "Past",    col: "Continuous", auxLabel: "was/were" },
    "past-perf":   { id: "past-perf",   row: "Past",    col: "Perfect",    auxLabel: "had" },
    "past-perf-cont": { id: "past-perf-cont", row: "Past", col: "Perfect Continuous", auxLabel: "had been" },
  };

  return (
    <div className={`app theme-${theme}`}>
      <header className="page-head">
        <div className="ph-eyebrow">English grammar</div>
        <h1 className="ph-title">Verb conjugation rules</h1>
        <p className="ph-sub">
          Present and Past · Simple, Continuous, Perfect and Perfect Continuous — affirmative, negative and interrogative forms.
        </p>
      </header>

      <section className="verb-bar">
        <label className="vb-label" htmlFor="verb-input">conjugate the verb</label>
        <div className="vb-input-wrap">
          <span className="vb-to">to</span>
          <input
            id="verb-input"
            className="vb-input"
            value={verb}
            onChange={(e) => handleVerbChange(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="vb-suggestions">
          {["play", "run", "eat", "write", "go", "be", "have"].map(v => (
            <button
              key={v}
              className={`vb-chip ${v === conj.base ? "is-active" : ""}`}
              onClick={() => handleVerbChange(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="vb-actions">
          <button className="vb-action" onClick={() => setAll(!allOpen)}>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <div className="vb-column-toggles">
          <span className="vb-toggle-label">show tenses</span>
          <div className="vb-toggle-list">
            {COLS.map(col => {
              const isOn = visibleCols[col.key];
              const visibleCount = Object.values(visibleCols).filter(Boolean).length;
              const isOnlyVisible = isOn && visibleCount === 1;
              return (
                <button
                  key={col.key}
                  className={`vb-chip vb-toggle-chip ${isOn ? "is-active" : ""}`}
                  onClick={() => toggleCol(col.key)}
                  disabled={isOnlyVisible}
                  aria-pressed={isOn}
                  title={isOnlyVisible ? "At least one tense column must remain visible" : ""}
                >
                  {col.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* The grand table — matches the sketch: 5 cols × 4 rows */}
      <section className="big-table" style={{ gridTemplateColumns: `240px repeat(${displayedCols.length}, 1fr)` }}>
        {/* Row 1: column headers */}
        <div className="bt-cell bt-head bt-corner">
          <div className="bt-col-eyebrow">verb in the</div>
          <div className="bt-col-name">infinitive</div>
        </div>
        {displayedCols.map((col, idx) => (
          <div className={`bt-cell bt-head ${idx === displayedCols.length - 1 ? "bt-last-col" : ""}`} key={`head-${col.key}`}>
            <div className="bt-col-eyebrow">tense</div>
            <div className="bt-col-name">{col.title}</div>
          </div>
        ))}

        {/* Row 2: aux verbs */}
        <div className="bt-cell bt-aux bt-aux-label">
          <span className="bt-aux-eyebrow">auxiliary</span>
          <span className="bt-aux-arrow">→</span>
        </div>
        {displayedCols.map((col, idx) => (
          <div className={`bt-cell bt-aux ${idx === displayedCols.length - 1 ? "bt-last-col" : ""}`} key={`aux-${col.key}`}>
            <span className="bt-aux-to">to</span><span className="bt-aux-verb">{col.aux}</span>
          </div>
        ))}

        {/* Row 3: Present */}
        <div className="bt-cell bt-row-head">
          <VerbCell rowLabel="Present" conj={conj} accent="present" />
        </div>
        {displayedCols.map((col, idx) => (
          <div className={`bt-cell bt-tense ${idx === displayedCols.length - 1 ? "bt-last-col" : ""}`} key={`pres-${col.key}`}>
            <TenseCell tense={TENSES[col.presentId]} conj={conj} expanded={!!open[col.presentId]}
                       onToggle={() => toggle(col.presentId)} showExample={showExample} />
          </div>
        ))}

        {/* Row 4: Past */}
        <div className="bt-cell bt-row-head">
          <VerbCell rowLabel="Past" conj={conj} accent="past" />
        </div>
        {displayedCols.map((col, idx) => (
          <div className={`bt-cell bt-tense ${idx === displayedCols.length - 1 ? "bt-last-col" : ""}`} key={`past-${col.key}`}>
            <TenseCell tense={TENSES[col.pastId]} conj={conj} expanded={!!open[col.pastId]}
                       onToggle={() => toggle(col.pastId)} showExample={showExample} />
          </div>
        ))}
      </section>

      <footer className="page-foot">
        <span>Tap any cell to expand the full conjugation. Type any verb to see all forms update.</span>
      </footer>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Verb">
          <window.TweakText
            label="Verb (infinitive)"
            value={tweaks.verb}
            onChange={(v) => { setTweak("verb", v); setVerb(v); }}
          />
        </window.TweakSection>
        <window.TweakSection title="Display">
          <window.TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "warm",  label: "Warm"  },
              { value: "paper", label: "Paper" },
              { value: "ink",   label: "Ink"   },
            ]}
          />
          <window.TweakToggle
            label="Show example sentences"
            value={tweaks.showExamples}
            onChange={(v) => setTweak("showExamples", v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

export default App;
