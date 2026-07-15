/* proto-ui.jsx — 참석자·개설자 공용 phone-frame UI primitives + 공통 컴포넌트 (v5)
   v5: 커스텀 스크롤 인디케이터 삭제(네이티브 스크롤바 숨김만 유지),
   SVG 기반 ConfirmBadge, 공통 StatusList / ProgressCard / ConfirmedMeeting /
   SceneJumpCard / ScenarioCard / IntentCard / ResetButton. */

const protoTDS = window.TossDesignSystemTDS_edd598;
const { Loader: PuLoader } = protoTDS;

function PhoneFrame({ children, cta, screenLabel, nav }) {
  const progressTotal = (nav && nav.progressTotal) || 3;

  return (
    <div data-screen-label={screenLabel} className="phone-frame" style={{
      width: '100%', maxWidth: 350, height: 758, flexShrink: 1, background: '#fff', borderRadius: 44,
      border: '1px solid var(--grey-200)',
      boxShadow: '0 2px 8px rgba(0,23,51,0.06), 0 20px 48px rgba(0,23,51,0.10)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {/* status bar — 시스템 정보만 */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 28px 0', fontSize: 14, fontWeight: 600, color: 'var(--grey-900)',
        fontVariantNumeric: 'tabular-nums', flexShrink: 0,
      }}>
        <span>9:41</span>
        <svg width="46" height="12" viewBox="0 0 46 12" fill="none" aria-hidden="true">
          <rect x="0" y="3" width="3" height="9" rx="1" fill="#191f28"></rect>
          <rect x="5" y="1.5" width="3" height="10.5" rx="1" fill="#191f28"></rect>
          <rect x="10" y="0" width="3" height="12" rx="1" fill="#191f28"></rect>
          <rect x="20" y="1" width="20" height="10" rx="3" stroke="#191f28" strokeWidth="1.4"></rect>
          <rect x="22" y="3" width="13" height="6" rx="1.5" fill="#191f28"></rect>
          <rect x="41.5" y="4" width="2" height="4" rx="1" fill="#191f28"></rect>
        </svg>
      </div>

      {/* top navigation zone — 항상 확보해 헤드라인이 상태바에 붙지 않게 */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
          <span style={{ width: 64, display: 'flex' }}>
            {nav && nav.onBack && (
              <button type="button" className="opt-btn" onClick={nav.onBack} aria-label="뒤로 가기" style={{
                width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 4L6.5 10L12.5 16" stroke="#333d4b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
            )}
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-900)' }}>{nav ? nav.title : ''}</span>
          <span style={{ width: 64, textAlign: 'right', paddingRight: 10, fontSize: 12.5, fontWeight: 600, color: 'var(--grey-400)', fontVariantNumeric: 'tabular-nums' }}>{nav && nav.progress ? nav.progress + '/' + progressTotal : ''}</span>
        </div>
        {nav && nav.progress && (
          <div style={{ display: 'flex', gap: 4, padding: '0 20px 6px' }} aria-label={'진행 단계 ' + nav.progress + ' / ' + progressTotal}>
            {Array.from({ length: progressTotal }, (_, i) => i + 1).map((i) => (
              <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= nav.progress ? 'var(--blue-500)' : 'var(--grey-100)' }}></span>
            ))}
          </div>
        )}
      </div>

      {/* scrollable content — 실제 앱처럼 별도 인디케이터 없이 일반 세로 스크롤만 */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div className="phone-scroll" style={{
          padding: nav && nav.progress ? '18px 20px 20px' : '12px 20px 20px', height: '100%',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}>
          {children}
        </div>
      </div>

      {cta && (
        <div style={{ padding: '12px 20px 20px', flexShrink: 0, background: '#fff', borderTop: '1px solid var(--grey-100)' }}>
          {cta}
        </div>
      )}
    </div>
  );
}

function ScreenTitle({ children, sub, center, label }) {
  return (
    <div style={{ margin: '8px 0 20px', textAlign: center ? 'center' : 'left' }}>
      {label && <div style={{ fontSize: 13, lineHeight: '18px', fontWeight: 700, color: 'var(--blue-500)', marginBottom: 8 }}>{label}</div>}
      <div style={{ fontSize: 24, lineHeight: '32px', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--grey-900)', whiteSpace: 'pre-line', wordBreak: 'keep-all' }}>{children}</div>
      {sub && <div style={{ marginTop: 10, fontSize: 15, lineHeight: '22px', color: 'var(--grey-500)', whiteSpace: 'pre-line', wordBreak: 'keep-all' }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--grey-500)', marginBottom: 8 }}>{children}</div>;
}

function RoleChip({ children }) {
  return (
    <div style={{ margin: '4px 0 2px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--blue-600)', background: 'var(--blue-50)', borderRadius: 8, padding: '5px 10px' }}>{children}</span>
    </div>
  );
}

function PrivacyNote({ children, inline }) {
  return (
    <div style={{
      display: 'flex', gap: inline ? 7 : 8, alignItems: 'flex-start', marginTop: 14,
      padding: inline ? '0 4px' : '12px 14px', borderRadius: inline ? 0 : 12,
      background: inline ? 'transparent' : 'var(--grey-50)',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
        <rect x="2.5" y="6" width="9" height="6" rx="1.8" stroke="#8b95a1" strokeWidth="1.5"></rect>
        <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#8b95a1" strokeWidth="1.5"></path>
      </svg>
      <span style={{ fontSize: 12.5, lineHeight: '18px', color: 'var(--grey-500)', wordBreak: 'keep-all' }}>{children}</span>
    </div>
  );
}

/* accessible tappable option (real <button>) */
function OptionButton({ label, sub, selected, onClick, disabled, small }) {
  return (
    <button
      type="button"
      className="opt-btn"
      aria-pressed={!!selected}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', fontFamily: 'var(--font-sans)',
        padding: small ? '10px 14px' : '13px 16px', borderRadius: 12, minHeight: small ? 40 : 48,
        fontSize: small ? 14 : 15, fontWeight: selected ? 600 : 500,
        background: selected ? 'var(--blue-50)' : 'var(--grey-50)',
        color: disabled ? 'var(--grey-300)' : selected ? 'var(--blue-600)' : 'var(--grey-700)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        border: selected ? '1.5px solid var(--blue-300)' : '1.5px solid transparent',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
      }}
    >
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block' }}>{label}</span>
        {sub && <span style={{ display: 'block', marginTop: 2, fontSize: 12, fontWeight: 500, color: selected ? 'var(--blue-400)' : 'var(--grey-400)' }}>{sub}</span>}
      </span>
      {selected && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )}
    </button>
  );
}

/* fixed-scenario answer display — NOT a button */
function StatusCard({ label, value, note }) {
  return (
    <div style={{ borderRadius: 14, background: 'var(--blue-50)', padding: '14px 18px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--blue-400)' }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: 'var(--blue-800)', wordBreak: 'keep-all' }}>{value}</div>
      {note && <div style={{ marginTop: 6, fontSize: 12.5, lineHeight: '18px', color: 'var(--blue-700)', opacity: 0.85, wordBreak: 'keep-all' }}>{note}</div>}
    </div>
  );
}

function InfoRows({ rows }) {
  return (
    <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '4px 18px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0',
          borderBottom: i < rows.length - 1 ? '1px solid var(--grey-100)' : 'none',
        }}>
          <span style={{ fontSize: 14, color: 'var(--grey-500)', flexShrink: 0 }}>{r[0]}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey-800)', textAlign: 'right', wordBreak: 'keep-all' }}>{r[1]}</span>
        </div>
      ))}
    </div>
  );
}

function Spacer() { return <div style={{ flex: 1, minHeight: 16 }}></div>; }

/* confirmation check badge — 원과 체크를 하나의 SVG로 (flex 축소에도 찌그러지지 않음) */
function ConfirmBadge() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      aria-hidden="true"
      style={{ display: 'block', flex: '0 0 auto', margin: '12px auto 20px' }}
    >
      <circle cx="28" cy="28" r="28" fill="var(--blue-500)"></circle>
      <path d="M16 29L24 37L40 19" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}

/* 공통 진행 상태 리스트 (참석자·개설자 동일 컴포넌트) */
function StatusList({ items }) {
  return (
    <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '4px 16px' }}>
      {items.map(([txt, state], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: i < items.length - 1 ? '1px solid var(--grey-100)' : 'none' }}>
          {state === 'done' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden="true"><circle cx="8" cy="8" r="8" fill="var(--blue-500)"></circle><path d="M4.8 8.3L7 10.5L11.2 5.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          ) : state === 'active' ? (
            <span style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PuLoader size={14} /></span>
          ) : (
            <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: '50%', border: '2px solid var(--grey-200)' }}></span>
          )}
          <span style={{ fontSize: 14, color: state === 'idle' ? 'var(--grey-400)' : 'var(--grey-700)', fontWeight: state === 'active' ? 600 : 500 }}>{txt}</span>
        </div>
      ))}
    </div>
  );
}

/* 공통 응답 현황 카드 */
function ProgressCard({ done, total, sub }) {
  return (
    <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--grey-400)' }}>응답 현황</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--grey-900)', fontVariantNumeric: 'tabular-nums' }}>{done} / {total}</span>
      </div>
      <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: 'var(--grey-100)', overflow: 'hidden' }} aria-hidden="true">
        <div style={{ width: (done / total * 100).toFixed(1) + '%', height: '100%', borderRadius: 3, background: 'var(--blue-500)' }}></div>
      </div>
      {sub && <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--grey-500)' }}>{sub}</div>}
    </div>
  );
}

/* 공통 아바타 */
const PAVATAR_BG = ['var(--blue-100)', 'var(--green-100, #dcf5e7)', 'var(--grey-200)', 'var(--orange-100, #ffefd6)', 'var(--purple-100, #ece7fe)', 'var(--teal-100, #d4f4f1)'];
const PAVATAR_FG = ['var(--blue-600)', 'var(--green-700, #147a4a)', 'var(--grey-600)', 'var(--orange-700, #b25c00)', 'var(--purple-600, #6b4fe0)', 'var(--teal-700, #0a7d74)'];

function PAvatar({ name, i, size }) {
  const s = size || 32;
  return (
    <span aria-hidden="true" style={{
      width: s, height: s, borderRadius: '50%', flexShrink: 0,
      background: PAVATAR_BG[i % 6], color: PAVATAR_FG[i % 6],
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: s * 0.4, fontWeight: 700,
    }}>{name.charAt(0)}</span>
  );
}

/* 공통 확정 결과 (모든 참석자에게 같은 결과와 선정 기준) */
function ConfirmedMeeting({ meeting, date, time, criteria }) {
  return (
    <React.Fragment>
      <div style={{ borderRadius: 16, background: 'var(--blue-50)', padding: '18px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-500)', marginBottom: 6 }}>{meeting}</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--blue-800)', fontVariantNumeric: 'tabular-nums' }}>{date}</div>
        <div style={{ marginTop: 2, fontSize: 15, fontWeight: 600, color: 'var(--blue-700)', fontVariantNumeric: 'tabular-nums' }}>{time}</div>
      </div>
      <div style={{ marginTop: 16 }}>
        <SectionLabel>이 시간으로 정해진 이유</SectionLabel>
        <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '6px 16px' }}>
          {criteria.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < criteria.length - 1 ? '1px solid var(--grey-100)' : 'none' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }} aria-hidden="true"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="var(--blue-500)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              <span style={{ fontSize: 13.5, lineHeight: '20px', color: 'var(--grey-700)', wordBreak: 'keep-all' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="opt-btn" style={{
        marginTop: 14, width: '100%', fontFamily: 'var(--font-sans)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
        padding: '8px 4px', minHeight: 36, background: 'transparent', border: 'none', borderRadius: 8,
        fontSize: 13.5, fontWeight: 600, color: 'var(--grey-500)',
      }}>
        Google Calendar에서 보기
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M6 3.5L10.5 8L6 12.5" stroke="var(--grey-400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
      </button>
    </React.Fragment>
  );
}

/* 확정 기준 — 모든 역할에 동일하게 안내 */
const CONFIRM_CRITERIA = [
  '필수 참석자 모두가 가능했어요.',
  '피하고 싶은 시간대와 겹치지 않았어요.',
  '참석 권장자를 포함해 가장 많은 사람이 참석할 수 있어요.',
  '동일한 조건의 후보 중 가장 빠른 시간이었어요.',
];

/* ---------- 오른쪽 포트폴리오 패널 공통 컴포넌트 ---------- */
function ScenarioCard({ role, pref }) {
  const rows = [['회의', '프로젝트 킥오프'], ['기간', '7월 13일–17일'], ['길이', '60분'], ['참석자', '필수 5명 · 권장 1명'], ['체험 관점', role]];
  if (pref) rows.push(['선호', pref]);
  return (
    <div style={{ borderRadius: 16, background: '#fff', padding: 20, boxShadow: '0 1px 3px rgba(0,23,51,0.05)' }}>
      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, fontSize: 13.5, lineHeight: '19px' }}>
            <span style={{ flexShrink: 0, width: 64, color: 'var(--grey-400)', fontWeight: 600 }}>{r[0]}</span>
            <span style={{ color: 'var(--grey-700)', fontWeight: 500, wordBreak: 'keep-all' }}>{r[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntentCard({ step, intent }) {
  return (
    <div style={{ borderRadius: 16, border: '1.5px dashed var(--grey-300)', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--blue-500)', background: 'var(--blue-50)', borderRadius: 6, padding: '3px 8px' }}>현재 단계</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--grey-800)' }}>{step}</span>
      </div>
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--grey-100)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--grey-400)', marginBottom: 5 }}>설계 의도</div>
        <div style={{ fontSize: 13.5, lineHeight: '20px', color: 'var(--grey-600)', wordBreak: 'keep-all' }}>{intent}</div>
      </div>
    </div>
  );
}

function SceneJumpCard({ scenes, onJump }) {
  return (
    <div style={{ borderRadius: 16, background: '#fff', padding: 20, boxShadow: '0 1px 3px rgba(0,23,51,0.05)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--grey-400)', marginBottom: 12 }}>다른 상황 보기</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {scenes.map(([label, target]) => (
          <button key={target} type="button" className="opt-btn" onClick={() => onJump(target)} style={{
            textAlign: 'left', border: '1.5px solid var(--grey-200)', background: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--grey-700)',
            padding: '11px 14px', borderRadius: 12, minHeight: 44,
            transition: 'background 150ms ease, border-color 150ms ease',
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

/* 캘린더 등록 토스트 — 결과 화면 진입 시 잠시 표시 */
function CalToast() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t0 = setTimeout(() => setShow(true), 250);
    const t1 = setTimeout(() => setShow(false), 2750);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, []);
  return (
    <div aria-live="polite" style={{
      position: 'absolute', left: 20, right: 20, bottom: 28, zIndex: 8,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--grey-800, #333d4b)', color: '#fff', borderRadius: 12,
        padding: '11px 16px', fontSize: 13, fontWeight: 600,
        boxShadow: '0 6px 20px rgba(0,23,51,0.22)', whiteSpace: 'nowrap',
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        Google Calendar에 일정을 추가했어요.
      </span>
    </div>
  );
}

/* 다시 조율 요청 — 개설자·참석자 공용 화면 */
function RecoordRequestScreen({ selected, onSelect, isHost }) {
  const opts = [
    '새 일정이 생겼어요',
    '이 시간에는 참석하기 어려워요',
    ...(isHost ? ['회의 조건이 달라졌어요'] : []),
    '그 밖의 이유가 있어요',
  ];
  return (
    <React.Fragment>
      <ScreenTitle sub={'지금 일정에 참석하기 어려운 이유를 선택해주세요.'}>다시 조율이{'\n'}필요한가요?</ScreenTitle>
      <div style={{ display: 'grid', gap: 8 }}>
        {opts.map((o) => (
          <OptionButton key={o} label={o} selected={selected === o} onClick={() => onSelect(selected === o ? null : o)} />
        ))}
      </div>
      <PrivacyNote inline>선택한 이유는 다른 참석자에게 공개되지 않아요.</PrivacyNote>
    </React.Fragment>
  );
}

function RecoordSentScreen() {
  return (
    <React.Fragment>
      <ScreenTitle sub={'새로운 시간이 필요하면 다시 알려드릴게요.'}>다시 조율 요청을{'\n'}보냈어요.</ScreenTitle>
      <StatusList items={[
        ['요청 반영 완료', 'done'],
        ['새로운 후보 확인 중', 'active'],
      ]} />
    </React.Fragment>
  );
}

function ResetButton({ onClick }) {
  return (
    <div>
      <button type="button" className="opt-btn proto-reset" onClick={onClick} style={{
        border: '1px solid var(--grey-300)', background: '#fff', boxShadow: '0 1px 2px rgba(0,23,51,0.06)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--grey-800)',
        padding: '11px 18px', borderRadius: 12, minHeight: 44,
        transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
      }}>↻ 처음부터 보기</button>
    </div>
  );
}

Object.assign(window, {
  PhoneFrame, ScreenTitle, SectionLabel, RoleChip, PrivacyNote, OptionButton, StatusCard, InfoRows, Spacer,
  ConfirmBadge, StatusList, ProgressCard, PAvatar, ConfirmedMeeting, CONFIRM_CRITERIA,
  ScenarioCard, IntentCard, SceneJumpCard, ResetButton,
  CalToast, RecoordRequestScreen, RecoordSentScreen,
});
