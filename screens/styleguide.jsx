// screens/styleguide.jsx — type, color, AI-locked vs active, iconography
function StyleGuide() {
  return (
    <div className="frame sg">
      <div className="sg__shell">
        <header className="sg__hero">
          <div className="eyebrow"><span className="dot" /><span className="mono">STYLE GUIDE</span></div>
          <h1 className="sg__title" style={{ fontFamily: "\"Source Serif 4\"" }}>
            <Bil
              kr={<>차분하지만 <em className="s">정확한</em> 시스템.</>}
              en={<span style={{ fontFamily: "Poppins", fontWeight: "500" }}>FLOW · SELF-STUDY BETWEEN SESSIONS</span>} />
            
          </h1>
          <p className="sg__sub">
            <Bil
              kr="기본은 종이 모드. 어두운 모드는 부모 포털과 시각적 가족이에요. 게임화 요소(배지, 연속일수, 점수)는 어디에도 없어요."
              en="Light paper by default. The dark mode is the visual family of the parent portal. No gamification anywhere — no badges, streaks, or scores." />
            
          </p>
        </header>

        {/* TYPE */}
        <section className="sg__sec">
          <h2 className="sg__h">01 · <em className="s">Type</em></h2>
          <div className="sg__type">
            <div className="sg__type-row">
              <div className="sg__type-spec mono">
                <span>CY GROTESK WIDE</span>
                <span>Display · 300/400</span>
                <span>Hero, dashboard titles</span>
              </div>
              <div className="sg__type-sample" style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 64, lineHeight: 1, letterSpacing: '-0.03em' }}>Quiet system</div>
            </div>
            <div className="sg__type-row">
              <div className="sg__type-spec mono">
                <span>NOTO SERIF KR</span>
                <span>Serif · 500</span>
                <span>Tutor voice, kid's quotes, prompts</span>
              </div>
              <div className="sg__type-sample serif" style={{ fontSize: 32, lineHeight: 1.25, fontFamily: "\"Pretendard Variable\"" }}>"시간이 맛이다." "Time is the taste."</div>
            </div>
            <div className="sg__type-row">
              <div className="sg__type-spec mono">
                <span>PRETENDARD</span>
                <span>Sans · 400/500</span>
                <span>UI chrome, body, KR-first</span>
              </div>
              <div className="sg__type-sample" style={{ fontSize: 18, lineHeight: 1.5 }}>본문은 단정하게. Body stays calm and even-weighted.</div>
            </div>
            <div className="sg__type-row">
              <div className="sg__type-spec mono">
                <span>JETBRAINS MONO</span>
                <span>Mono · 500</span>
                <span>Labels, eyebrows, timestamps</span>
              </div>
              <div className="sg__type-sample mono" style={{ fontSize: 13, letterSpacing: '.18em' }}>STEP 03 OF 05 · 14:08</div>
            </div>
          </div>
        </section>

        {/* COLOR */}
        <section className="sg__sec">
          <h2 className="sg__h">02 · <em className="s">Color</em></h2>
          <div className="sg__swatches">
            {[
            { c: 'var(--paper)', n: 'Paper', hex: '#FAFAF8', role: 'Page · primary' },
            { c: 'var(--paper-2)', n: 'Paper-2', hex: '#F1EDE5', role: 'Surface · cards' },
            { c: 'var(--paper-3)', n: 'Paper-3', hex: '#FFFCF6', role: 'Lifted card' },
            { c: 'var(--ink)', n: 'Ink', hex: '#0B0B0F', role: 'Type · primary' },
            { c: 'var(--coral)', n: 'Coral', hex: '#FF7A6E', role: 'Tutor accents · pulls' },
            { c: 'var(--butter)', n: 'Butter', hex: '#FFE8A3', role: 'Anchor highlights' },
            { c: 'var(--mist-blue)', n: 'Mist Blue', hex: '#D9E4F5', role: 'Make · Arketype family' },
            { c: 'var(--mist-lilac)', n: 'Mist Lilac', hex: '#E8D9F5', role: 'Think · family' },
            { c: 'var(--mist-peach)', n: 'Mist Peach', hex: '#F5E4D9', role: 'Empathy · family' },
            { c: 'var(--mist-mint)', n: 'Mist Mint', hex: '#DCEBD8', role: 'Resilience · family' },
            { c: 'var(--success)', n: 'Success', hex: '#4A7A2E', role: 'Confirmation · earned' },
            { c: 'var(--amber)', n: 'Amber', hex: '#C97A1F', role: 'Unlocking · warm threshold' }].
            map((s, i) =>
            <div key={i} className="sg-swatch">
                <div className="sg-swatch__chip" style={{ background: s.c }} />
                <div>
                  <div className="sg-swatch__n">{s.n}</div>
                  <div className="sg-swatch__hex mono">{s.hex}</div>
                  <div className="sg-swatch__role">{s.role}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* AI STATES */}
        <section className="sg__sec">
          <h2 className="sg__h">03 · AI <em className="s">states</em></h2>
          <p className="sg__sub" style={{ marginTop: 0 }}>
            <Bil
              kr="잠금은 처벌이 아니에요 — 아이가 먼저 진짜 일을 했다는 표시예요. 'unlocking'은 따뜻한 호박색, 'active'는 잔잔한 초록."
              en="Locked is not punitive — it's the mark that the kid did the real work first. 'Unlocking' is warm amber. 'Active' is calm green." />
            
          </p>
          <div className="sg__states">
            <div className="sg__state-card">
              <div className="sg__state-demo sg__state-demo--locked">
                <SumiMark size={44} />
              </div>
              <h4 className="serif">Locked</h4>
              <p>Dashed hairline. Sumi mark at 45% opacity. Serif phrase: <em className="s">"Try first."</em></p>
              <code className="mono">--ai-locked-bg · dashed border</code>
            </div>
            <div className="sg__state-card">
              <div className="sg__state-demo sg__state-demo--unlocking">
                <SumiMark size={44} thinking />
              </div>
              <h4 className="serif">Unlocking</h4>
              <p>Amber halo, slow breathe (2.4s). One CTA: <em className="s">"Show the tutor."</em></p>
              <code className="mono">amber halo · breathe @ 2.4s</code>
            </div>
            <div className="sg__state-card">
              <div className="sg__state-demo sg__state-demo--active">
                <SumiMark size={44} />
              </div>
              <h4 className="serif">Active</h4>
              <p>Solid border, mint chip. Sumi appears beside every tutor message — never as an avatar.</p>
              <code className="mono">--ai-active-bg · solid 1px</code>
            </div>
          </div>
        </section>

        {/* TUTOR MARK */}
        <section className="sg__sec">
          <h2 className="sg__h">04 · <em className="s">Sumi-e</em> tutor mark</h2>
          <p className="sg__sub" style={{ marginTop: 0 }}>
            <Bil
              kr="얼굴도, 마스코트도 없어요. 살아있는 잉크 자국. '생각 중'에는 아주 천천히 호흡해요."
              en="No face. No mascot. A living ink mark. While 'thinking' it breathes very slowly." />
            
          </p>
          <div className="sg__sumi-row">
            <div className="sg__sumi-cell"><SumiMark size={28} /><span className="mono">28 · INLINE</span></div>
            <div className="sg__sumi-cell"><SumiMark size={44} thinking /><span className="mono">44 · THINKING</span></div>
            <div className="sg__sumi-cell"><SumiMark size={68} /><span className="mono">68 · CHAMBER</span></div>
            <div className="sg__sumi-cell"><SumiMark size={28} tone="violet" /><span className="mono">28 · VIOLET (DARK)</span></div>
          </div>
        </section>

        {/* ICONOGRAPHY */}
        <section className="sg__sec">
          <h2 className="sg__h">05 · <em className="s">Iconography</em></h2>
          <p className="sg__sub" style={{ marginTop: 0 }}>
            <Bil
              kr="단일 1.6px 스트로크. 시각적 무게는 사실상 모두 동일. 아이콘은 메타데이터 — 결정 단서가 아니에요."
              en="Single 1.6px stroke. Roughly even visual weight. Icons are metadata — never the decision cue." />
            
          </p>
          <div className="sg__icons">
            {["lock", "unlock", "pencil", "feather", "sparkle", "quote", "mic", "chat", "book", "target", "users", "sun", "moon", "check", "arrow", "plus"].map((n) =>
            <div key={n} className="sg-icon"><Icon name={n} size={22} /><span className="mono">{n}</span></div>
            )}
          </div>
        </section>

        {/* COPY */}
        <section className="sg__sec">
          <h2 className="sg__h">06 · <em className="s">Voice</em> &amp; copy</h2>
          <div className="sg__voice">
            <div className="voice-card voice-card--do">
              <div className="mono"><Bil kr="이렇게" en="DO" /></div>
              <ul>
                <li className="serif">"Pick one line. <em className="s">Why did you write that difference?</em>"</li>
                <li className="serif">"먼저 써보세요. <em className="s">그 다음에 이야기해요.</em>"</li>
                <li className="serif">"What grounds the word 'real' here?"</li>
              </ul>
            </div>
            <div className="voice-card voice-card--dont">
              <div className="mono"><Bil kr="이건 안 돼요" en="DON'T" /></div>
              <ul>
                <li>"Great job! 🎉 Here's your draft rewritten —"</li>
                <li>"3-day streak! You're crushing it 🔥"</li>
                <li>"Let me write that for you."</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>);

}
window.StyleGuide = StyleGuide;