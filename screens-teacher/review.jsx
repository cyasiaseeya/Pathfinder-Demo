// screens-teacher/review.jsx — Artifact Review
// Mentor reviews student's final artifact + the tutor conversation that
// produced it, then leaves ONE question that will unlock the Defend step.

const { MentorTopbar, StageChip, Bil, Icon, SumiMark } = window;

function ArtifactReview() {
  return (
    <div className="frame">
      <MentorTopbar tab="desk" crumb={{ kr: "작업 검토", en: "Artifact review" }} />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div className="review__shell">

          {/* LEFT — the artifact */}
          <section className="review__left">
            <div className="copilot-crumb" style={{ marginBottom: 18 }}>
              <div className="copilot-crumb__who">
                <div className="copilot-crumb__av">도</div>
                <div>
                  <div className="copilot-crumb__name">
                    <Bil kr="박도윤" en="Doyoon Park" />
                  </div>
                  <div className="copilot-crumb__sub">
                    <Bil kr="초6 · 점심 낭비 · 단계 04 → 05 게이트" en="G6 · LUNCH WASTE · STEP 04 → 05 GATE" />
                  </div>
                </div>
              </div>
              <StageChip stage="defend" />
            </div>

            <div className="review-art">
              <div className="review-art__thumb">
                <span className="review-art__dur">02:47</span>
                <button className="review-art__play"><Icon name="play" size={20} /></button>
                <div className="review-art__caption">
                  <Bil
                    kr="2분 47초 영상 · 우리 학교 급식실에서 1주일 동안 버려진 음식 추적"
                    en="2:47 video · tracking what got thrown away at our school cafeteria for a week"
                  />
                </div>
              </div>

              <h3 className="review-art__claim">
                <Bil
                  kr={<><em className="s">"버려지는 음식이 가장 비싸다."</em></>}
                  en={<><em className="s">"The food we waste costs the most."</em></>}
                />
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4, marginBottom: 14, lineHeight: 1.5 }}>
                <Bil
                  kr="도윤이 일주일 동안 급식실에서 본 것을 추적했어요. 영상은 양적 발견에서 시작해 — '비싸다'의 두 가지 의미로 끝나요."
                  en="Doyoon tracked what he saw in the cafeteria for a week. The video opens with a quantitative finding and ends on two senses of 'expensive.'"
                />
              </p>

              <div className="review-art__meta">
                <span><Bil kr="영상 길이 2:47" en="LENGTH 2:47" /></span>
                <span><Bil kr="단어 211" en="211 WORDS" /></span>
                <span><Bil kr="튜터 질문 7" en="7 TUTOR QS" /></span>
                <span><Bil kr="고친 줄 9" en="9 EDITS" /></span>
              </div>

              {/* Scrub line showing key moments + tutor turns + mentor input */}
              <div className="scrub-line">
                <div className="scrub-line__head">
                  <span><Bil kr="구간 분석" en="STRUCTURE" /></span>
                  <span><Bil kr="00:00 · 02:47" en="00:00 · 02:47" /></span>
                </div>
                <div className="scrub-line__bar">
                  <div className="scrub-line__seg" style={{ left: "12%", width: "16%" }}>
                    <span className="scrub-line__moment" style={{ left: 0 }}>
                      <Bil kr="발견" en="FINDING" />
                    </span>
                  </div>
                  <div className="scrub-line__seg" style={{ left: "36%", width: "22%" }}>
                    <span className="scrub-line__moment" style={{ left: 0 }}>
                      <Bil kr="비유 도입" en="METAPHOR" />
                    </span>
                  </div>
                  <div className="scrub-line__seg scrub-line__seg--coral" style={{ left: "66%", width: "18%" }}>
                    <span className="scrub-line__moment" style={{ left: 0 }}>
                      <Bil kr="핵심 단언" en="CLAIM" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Tutor convo digest */}
              <div style={{ marginTop: 10 }}>
                <h4 style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--muted)", fontWeight: 600, margin: "0 0 12px", textTransform: "uppercase" }}>
                  <Bil kr="튜터와 나눈 대화 — 요약" en="What the tutor asked — digest" />
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <DigestRow
                    nKr="01" nEn="01"
                    kr={<>"가장 비싸다"는 어떤 가격을 말해요? <em className="s">돈만 가격인가요?</em></>}
                    en={<>"Most expensive" — what price? <em className="s">Is money the only price?</em></>}
                    ans={{ kr: "사람이 만든 시간도 비싸요.", en: "The time it took to make is expensive too." }}
                  />
                  <DigestRow
                    nKr="02" nEn="02"
                    kr={<>다섯 살 아이가 본다면, 처음 30초에 무엇이 들려야 해요?</>}
                    en={<>If a 5-year-old watches, what should they hear in the first 30 seconds?</>}
                    ans={{ kr: "수가 큰 것 — 일주일에 38명분이 버려졌어요.", en: "The big number — 38 servings tossed in one week." }}
                  />
                  <DigestRow
                    nKr="03" nEn="03"
                    kr={<>이 영상은 누구를 위해 만들었어요? 그 사람이 무엇을 하길 바라요?</>}
                    en={<>Who is this video for? What do you want them to do?</>}
                    ans={{ kr: "급식실 아주머니. 음식 좀 줄여달라고.", en: "The lunch lady. To make smaller portions." }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT — mentor question */}
          <section className="review__right">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              <span className="dot" />
              <Bil kr="멘토의 한 가지 질문" en="YOUR ONE QUESTION" />
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "-0.025em", margin: "0 0 8px", lineHeight: 1.25 }}>
              <Bil
                kr={<>도윤이가 발표에서 <em className="s">정확히 한 번</em> 답할 질문을 남겨주세요.</>}
                en={<>Leave Doyoon <em className="s">one question</em> to answer at Defend.</>}
              />
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.55, margin: "0 0 18px" }}>
              <Bil
                kr="발표 단계는 멘토 질문 없이는 열리지 않아요. 짧고, 빠져나갈 수 없는 질문이 가장 좋아요."
                en="The Defend step won't open without it. Best questions are short and inescapable."
              />
            </p>

            <div className="compose-q">
              <div className="compose-q__head">
                <SumiMark size={22} tone="violet" />
                <span className="compose-q__label">
                  <Bil kr="멘토의 질문" en="Mentor's question" />
                </span>
              </div>
              <textarea
                defaultValue={"급식실 아주머니가 영상을 보고도 양을 안 줄이면 — 너의 영상은 실패한 거야, 아니면 다른 무언가야?"}
              />
              <div className="compose-q__hint">
                <Icon name="sparkle" size={12} />
                <Bil
                  kr={<>발표 게이트 — <em className="s">"청중이 바뀌지 않으면 작업은 무엇인가?"</em></>}
                  en={<>Defend gate — <em className="s">"If the audience doesn't change, what was the work?"</em></>}
                />
              </div>
              <div className="compose-q__actions">
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em" }}>
                  <Bil kr="42자 · 빠져나가기 어려움" en="42 CHARS · HARD TO ESCAPE" />
                </span>
                <button className="btn btn--primary">
                  <Bil kr="질문 남기고 발표 열기" en="Send & open Defend" />
                  <Icon name="arrow" size={14} />
                </button>
              </div>
            </div>

            <div className="suggested">
              <h5><Bil kr="이전 도윤이의 패턴에서 — 제안" en="Suggested from Doyoon's pattern" /></h5>
              <div className="suggested-q">
                <span className="key">↑</span>
                <Bil
                  kr={<>네가 처음에 쓴 '38명분' — 이 영상에서 그 숫자가 <em className="s">어디에서</em> 가장 무겁게 떨어져?</>}
                  en={<>The "38 servings" you opened with — where in the video does that number land <em className="s">hardest</em>?</>}
                />
              </div>
              <div className="suggested-q">
                <span className="key">↓</span>
                <Bil
                  kr={<>"비싸다"의 두 가지 의미 중, 영상을 본 뒤 사람들은 어느 쪽을 기억할까?</>}
                  en={<>Of the two senses of "expensive" — which one will viewers walk away with?</>}
                />
              </div>
              <div className="suggested-q">
                <span className="key">⌥</span>
                <Bil
                  kr={<>아주머니가 너에게 "음식이 부족하면 어떡해?"라고 물으면 너는 뭐라고 답해?</>}
                  en={<>If the lunch lady asks "what if kids leave hungry?" — what's your answer?</>}
                />
              </div>
            </div>

            <div style={{ marginTop: 22, padding: 16, borderRadius: "var(--r-md)", background: "var(--paper)", border: "1px solid var(--line)" }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                <Bil kr="짝꿍 질문은 이미 도착" en="PEER QUESTION ALREADY IN" />
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 14, letterSpacing: "-0.01em", lineHeight: 1.5, margin: 0, color: "var(--ink-2)" }}>
                <Bil
                  kr={<>"네가 일주일 동안 본 게 우연일 수도 있어. 어떻게 알아?" — <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".08em", color: "var(--muted)" }}>김연수 · 짝꿍</span></>}
                  en={<>"What you saw could be a fluke week. How do you know?" — <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".08em", color: "var(--muted)" }}>Yeonsoo · Peer</span></>}
                />
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function DigestRow({ nKr, nEn, kr, en, ans }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, padding: "10px 0", borderBottom: "1px dashed var(--line)" }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: ".12em", paddingTop: 2 }}>{nKr}</span>
      <div>
        <p style={{ fontFamily: "var(--serif)", fontSize: 14, letterSpacing: "-0.01em", lineHeight: 1.5, margin: 0, color: "var(--ink)" }}>
          <Bil kr={kr} en={en} />
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: "6px 0 0", paddingLeft: 12, borderLeft: "2px solid var(--line)" }}>
          <Bil kr={`→ ${ans.kr}`} en={`→ ${ans.en}`} />
        </p>
      </div>
    </div>
  );
}

window.ArtifactReview = ArtifactReview;
