// screens-teacher/unlock.jsx — Unlock Approval (ceremony release)
// A child has hit a threshold (draft target, Reactor signal, etc.). The mentor
// reviews the evidence and releases the unlock moment WITH a personal note.

const { MentorTopbar, Bil, Icon, SumiMark } = window;

function UnlockApproval() {
  return (
    <div className="frame">
      <MentorTopbar tab="desk" crumb={{ kr: "잠금 해제 · 검토", en: "Unlock · review" }} />
      <div className="scroll-y">
        <div className="unlock__shell">
          <div className="unlock__hero">
            <div className="eyebrow">
              <span className="dot" />
              <Bil kr="문턱을 넘었어요 · 멘토 승인 대기" en="THRESHOLD CROSSED · AWAITING MENTOR" />
            </div>
            <h1>
              <Bil
                kr={<>민준이 <em className="s">충분히 써봤어요</em>. 같이 생각해도 돼요.</>}
                en={<>Minjun has <em className="s">drafted enough</em>. The tutor can step in.</>}
              />
            </h1>
            <p>
              <Bil
                kr={<>잠금 해제는 의식입니다. 도구가 열린다는 사실보다 <em className="s">선생님의 한 줄</em>이 더 중요해요. 짧게 한 문장이면 충분합니다.</>}
                en={<>The unlock is a ceremony. The tool opening is less important than <em className="s">your one line</em>. One sentence is enough.</>}
              />
            </p>
          </div>

          <div className="unlock__split">
            {/* Evidence */}
            <div className="unlock-card">
              <h3><Bil kr="문턱 증거 · Reactor가 본 것" en="Evidence · what Reactor saw" /></h3>
              <div className="unlock-evidence">
                <div className="unlock-evidence__row">
                  <span className="num">01</span>
                  <span>
                    <Bil
                      kr={<>초안 길이 <em className="s">142단어</em> · 목표 60. 두 번 다시 읽고, 세 줄을 직접 지웠음.</>}
                      en={<>Draft length <em className="s">142 words</em> · target 60. Re-read twice, deleted three lines on his own.</>}
                    />
                  </span>
                </div>
                <div className="unlock-evidence__row">
                  <span className="num">02</span>
                  <span>
                    <Bil
                      kr={<>3번째 줄에 비유 도입 — <em className="s">"엄마는 빨리, 할머니는 천천히"</em>. 자기 손으로 밑줄.</>}
                      en={<>Metaphor introduced in line 3 — <em className="s">"Mom fast, Grandma slow"</em>. He underlined it himself.</>}
                    />
                  </span>
                </div>
                <div className="unlock-evidence__row">
                  <span className="num">03</span>
                  <span>
                    <Bil
                      kr={<>마지막 12분간 키 입력 — 점진적 감소. <em className="s">막힘이 아니라 멈춤</em>으로 읽힘.</>}
                      en={<>Keystroke trace over last 12 min — gradual taper. Reads as <em className="s">pause, not stuck</em>.</>}
                    />
                  </span>
                </div>
                <div className="unlock-evidence__row">
                  <span className="num">04</span>
                  <span>
                    <Bil
                      kr={<>이전 두 프로젝트에서 — 같은 패턴(쓰기 → 자기 비유 → 멈춤). 그 다음 단계에서 가장 잘 자람.</>}
                      en={<>In his last two projects — same pattern (draft → own metaphor → pause). Strongest growth always came after this point.</>}
                    />
                  </span>
                </div>
                <div className="unlock-evidence__row">
                  <span className="num">05</span>
                  <span>
                    <Bil
                      kr={<>마지막 멘토 메모 (4월 22일): <em className="s">"세 번째 질문에서 한 번 흔들어주면, 자기 말로 다시 잡는다."</em></>}
                      en={<>Your note from Apr 22: <em className="s">"One nudge at the third question and he re-grounds in his own words."</em></>}
                    />
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--paper)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
                <SumiMark size={26} tone="ink" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 2 }}>
                    <Bil kr="튜터 준비됨" en="TUTOR READY" />
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 13, letterSpacing: "-0.01em", color: "var(--ink-2)", lineHeight: 1.4 }}>
                    <Bil
                      kr={"차분한 말투 · 인지 참여 모드 · 첫 질문 \"3번째 줄 — 엄마는 빨리, 할머니는 천천히. 왜 그 차이를 적었어요?\""}
                      en={"Gentle voice · cognitive engagement mode · opening Q: \"Line 3 — Mom fast, Grandma slow. Why did you write that difference?\""}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor note */}
            <div className="unlock-card unlock-note">
              <h3><Bil kr="멘토의 한 줄 · 민준에게" en="Your one line · to Minjun" /></h3>
              <textarea defaultValue={"민준 — 142단어. 김치 얘기에서 시간 얘기로 옮겨가는 게 보여요. 이제 튜터랑 같이 한 번 더 들여다봐요. 답을 주지 않을 거예요. 질문만 할 거예요."} />
              <div className="unlock-note__byline">
                <Bil kr="박서윤 · 멘토 · 2026년 4월 29일 14:32" en="Seoyun Park · Mentor · APR 29, 2026 · 14:32" />
              </div>

              <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: "var(--r-sm)", background: "var(--paper)", border: "1px dashed var(--line-2)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>
                  <Bil kr="이 메모가 보이는 곳" en="WHERE THIS LANDS" />
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 }}>
                  <li><Bil kr="민준이 다음 세션 시작 시 — 튜터 화면 위에 가장 먼저." en="On top of Minjun's tutor screen at next session." /></li>
                  <li><Bil kr="부모 진행 노트 — 4월 30일 오후 5시 자동 발송." en="Parent progress note — auto-sends Apr 30, 5 PM." /></li>
                  <li><Bil kr="민준이 6개월 뒤 다시 읽을 수 있는 '저널' 페이지에 보관." en="Archived to Minjun's Journal — readable in six months." /></li>
                </ul>
              </div>

              <div className="unlock__cta">
                <button className="btn"><Bil kr="나중에 보내기" en="Schedule" /></button>
                <button className="btn btn--primary">
                  <Icon name="unlock" size={14} />
                  <Bil kr="잠금 해제하고 발송" en="Release & send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.UnlockApproval = UnlockApproval;
