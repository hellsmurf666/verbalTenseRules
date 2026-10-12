import React, { useMemo } from "react";

const TENSES = [
  { id: "past-simple", name: "Past Simple" },
  { id: "pres-perf", name: "Present Perfect" },
];

const POLARITIES = [
  { id: "aff", label: "Affirmative", glyph: "+", tone: "aff" },
  { id: "neg", label: "Negative", glyph: "−", tone: "neg" },
  { id: "int", label: "Interrogative", glyph: "?", tone: "int" },
];

const SIGNAL_WORDS = {
  "past-simple": ["yesterday", "last week", "in [year]", "ago", "when…"],
  "pres-perf": ["just", "already", "yet", "ever", "never", "since", "for", "recently"],
};

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

function Comparison() {
  const defaults = window.TWEAK_DEFAULTS;
  const [tweaks, setTweak] = window.useTweaks(defaults);

  const verb = tweaks.verb || defaults.verb || "play";
  const theme = tweaks.theme || defaults.theme || "warm";
  const showExamples = tweaks.showExamples !== false;

  const conj = useMemo(() => window.conjugate(verb), [verb]);

  const setVerb = (value) => setTweak("verb", value);
  const setTheme = (value) => setTweak("theme", value);

  const calloutStyle =
    theme === "warm"
      ? { background: "linear-gradient(135deg, #fff4d8, #ffe9ba)", borderColor: "#e2b457" }
      : { background: "linear-gradient(135deg, #e8f1ff, #dbe9ff)", borderColor: "#7aa3d8" };

  return (
    <div className={`app comparison theme-${theme}`}>
      <style>{`
        .comparison {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .comparison .compare-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .comparison .usage-strip {
          background: var(--paper);
          border: 2px solid var(--rule-strong);
          border-radius: 16px;
          padding: 16px;
        }

        .comparison .usage-col {
          border: 2px solid var(--rule);
          border-radius: 12px;
          padding: 14px;
          background: var(--bg-2);
        }

        .comparison .usage-col h3 {
          margin: 0 0 8px;
          font-size: 22px;
          letter-spacing: -0.01em;
        }

        .comparison .usage-col p {
          margin: 0 0 10px;
          color: var(--ink-soft);
          line-height: 1.4;
        }

        .comparison .usage-words {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 4px;
        }

        .comparison .polarity-section {
          background: var(--paper);
          border: 2px solid var(--rule-strong);
          border-radius: 16px;
          padding: 14px;
          display: grid;
          gap: 12px;
          margin-bottom: 12px;
        }

        .comparison .polarity-header {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .comparison .polarity-header .pol-glyph {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-grid;
          place-items: center;
          color: #fff;
          font-weight: 800;
        }

        .comparison .polarity-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .comparison .tense-panel {
          border: 2px solid var(--rule);
          border-radius: 12px;
          background: var(--bg-2);
          padding: 12px;
        }

        .comparison .tense-panel h4 {
          margin: 0;
          font-size: 18px;
        }

        .comparison .rule {
          margin: 8px 0 12px;
          color: var(--ink-soft);
          font-size: 14px;
          line-height: 1.45;
        }

        .comparison .rows {
          display: grid;
          gap: 2px;
        }

        .comparison .examples-strip {
          background: var(--paper);
          border: 2px solid var(--rule-strong);
          border-radius: 16px;
          padding: 16px;
        }

        .comparison .examples-col {
          border: 2px solid var(--rule);
          border-radius: 12px;
          padding: 12px;
          background: var(--bg-2);
        }

        .comparison .examples-col h3 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .comparison .example-item {
          display: flex;
          gap: 8px;
          align-items: baseline;
          padding: 4px 0;
        }

        .comparison .example-glyph {
          width: 18px;
          text-align: center;
          font-weight: 800;
          flex: 0 0 18px;
        }

        .comparison .key-callout {
          border: 2px solid;
          border-radius: 14px;
          padding: 14px 16px;
          line-height: 1.5;
        }

        .comparison .theme-picks {
          display: inline-flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .comparison .theme-btn {
          border: 2px solid var(--rule);
          background: var(--paper);
          color: var(--ink);
          border-radius: 999px;
          font-weight: 700;
          padding: 8px 12px;
          cursor: pointer;
        }

        .comparison .theme-btn.is-active {
          background: var(--ink);
          color: var(--bg-2);
          border-color: var(--ink);
        }

        @media (max-width: 980px) {
          .comparison .compare-grid,
          .comparison .polarity-columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="page-head">
        <div className="ph-eyebrow">Tense Comparison</div>
        <h1 className="ph-title">Past Simple vs Present Perfect</h1>
        <p className="ph-sub">The two tenses learners confuse most — compared side by side.</p>
      </header>

      <section className="verb-bar">
        <label className="vb-label" htmlFor="comparison-verb-input">conjugate the verb</label>
        <div className="vb-input-wrap">
          <span className="vb-to">to</span>
          <input
            id="comparison-verb-input"
            className="vb-input"
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="vb-suggestions">
          {["play", "run", "eat", "write", "go", "be", "have"].map((v) => (
            <button
              key={v}
              className={`vb-chip ${v === conj.base ? "is-active" : ""}`}
              onClick={() => setVerb(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="vb-actions">
          <div className="theme-picks" role="group" aria-label="Theme">
            {[
              { value: "warm", label: "Warm" },
              { value: "paper", label: "Paper" },
              { value: "ink", label: "Ink" },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`theme-btn ${theme === opt.value ? "is-active" : ""}`}
                onClick={() => setTheme(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="usage-strip compare-grid">
        {TENSES.map((tense, idx) => (
          <article
            key={tense.id}
            className="usage-col"
            style={idx === 0 ? { borderLeft: "8px solid #e27d31" } : { borderLeft: "8px solid #2d7fc1" }}
          >
            <h3>{tense.name}</h3>
            <p>{window.USAGE[tense.id]}</p>
            <ul className="usage-words">
              {SIGNAL_WORDS[tense.id].map((word) => <li key={word}>{word}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section>
        {POLARITIES.map((polarity) => (
          <article key={polarity.id} className={`polarity-section tone-${polarity.tone}`}>
            <header className={`polarity-header tone-${polarity.tone}`}>
              <span className="pol-glyph">{polarity.glyph}</span>
              <span>{polarity.label}</span>
            </header>
            <div className="polarity-columns">
              {TENSES.map((tense) => {
                const rows = window.buildTense(conj, tense.id, polarity.id);
                return (
                  <section className="tense-panel" key={`${polarity.id}-${tense.id}`}>
                    <h4>{tense.name}</h4>
                    <div className="rule" dangerouslySetInnerHTML={{ __html: window.RULES[tense.id][polarity.id] }} />
                    <div className="rows">
                      {rows.map((row, i) => <ConjRow key={i} row={row} />)}
                    </div>
                  </section>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      {showExamples && (
        <section className="examples-strip compare-grid">
          {TENSES.map((tense) => (
            <article key={tense.id} className="examples-col">
              <h3>{tense.name}</h3>
              {window.EXAMPLES[tense.id].map((ex, i) => {
                const sentence = window.buildExample(conj, tense.id, ex);
                const glyph = ex.pol === "aff" ? "+" : ex.pol === "neg" ? "−" : "?";
                const toneClass = ex.pol === "aff" ? "tone-aff" : ex.pol === "neg" ? "tone-neg" : "tone-int";
                return (
                  <div key={i} className={`example-item ${toneClass}`}>
                    <span className="example-glyph">{glyph}</span>
                    <span>{sentence}</span>
                  </div>
                );
              })}
            </article>
          ))}
        </section>
      )}

      <section className="key-callout" style={calloutStyle}>
        Use the <strong>Past Simple</strong> for actions completed at a <strong>specific time</strong> in the past. Use the <strong>Present Perfect</strong> for actions where the exact time is <strong>unknown or unimportant</strong>, or that have a <strong>result in the present</strong>.
      </section>

      <footer className="page-foot">
        <span>Compare both tenses by polarity, then verify how form changes alter sentence meaning.</span>
      </footer>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Verb">
          <window.TweakText
            label="Verb (infinitive)"
            value={tweaks.verb}
            onChange={(v) => setTweak("verb", v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Display">
          <window.TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "warm", label: "Warm" },
              { value: "paper", label: "Paper" },
              { value: "ink", label: "Ink" },
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

export default Comparison;
