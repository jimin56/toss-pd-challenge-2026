/* avail-flow.jsx — 공통 일정 입력 플로우 (참석자·개설자가 같은 컴포넌트를 사용)
   캘린더 연결 → 일정 확인 → 캘린더 밖 일정 추가 → 피하고 싶은 시간 → 입력 확인.
   useAvailFlow 훅이 화면·CTA·nav·입력 상태를 돌려주고, 역할 표시(roleLabel)만 다르다. */

const afTDS = window.TossDesignSystemTDS_edd598;
const { Button: AfButton, Loader: AfLoader } = afTDS;

/* ---------- data ---------- */
const IP_DAYS = [
  { d: '월', date: '13' }, { d: '화', date: '14' }, { d: '수', date: '15' },
  { d: '목', date: '16' }, { d: '금', date: '17' },
];
const IP_DAYNAME = { 월: '월요일', 화: '화요일', 수: '수요일', 목: '목요일', 금: '금요일' };
const IP_TIMES = (() => {
  const t = [];
  for (let h = 9; h <= 18; h++) { t.push(String(h).padStart(2, '0') + ':00'); if (h < 18) t.push(String(h).padStart(2, '0') + ':30'); }
  return t;
})();
const ipMin = (s) => parseInt(s.slice(0, 2), 10) * 60 + parseInt(s.slice(3), 10);
const ipOv = (a, b) => a.day === b.day && ipMin(a.start) < ipMin(b.end) && ipMin(a.end) > ipMin(b.start);

/* 캘린더 일정 7개 (자동 반영) */
const IP_EVENTS = [
  { day: '월', start: '09:00', end: '10:00' }, { day: '월', start: '14:00', end: '15:00' },
  { day: '화', start: '10:00', end: '12:00' }, { day: '수', start: '09:30', end: '10:30' },
  { day: '수', start: '15:00', end: '16:00' }, { day: '목', start: '13:00', end: '15:00' },
  { day: '금', start: '15:00', end: '16:30' },
];

const IP_FRI = { day: '금', start: '13:00', end: '14:00' };

const IP_PREFS = [
  { id: 'morning', label: '매일 오전 10시 이전', range: { day: null, start: '09:00', end: '10:00' } },
  { id: 'lunch', label: '매일 점심 직후 12:00–14:00', range: { day: null, start: '12:00', end: '14:00' } },
  { id: 'evening', label: '매일 퇴근 직전 17:00 이후', range: { day: null, start: '17:00', end: '18:00' } },
];

/* 공통 입력 단계의 설계 노트 (양쪽 탭 공용) */
const FLOW_NOTES = {
  connect: { step: '캘린더 연결', intent: '연결된 캘린더 일정은 자동으로 확인하고, 캘린더 밖 일정과 선호 시간대는 이후 단계에서 추가로 입력받습니다. 짧은 확인 과정은 별도 화면 대신 버튼의 로딩 상태로 보여줍니다. 개설자와 참석자가 같은 입력 흐름을 사용합니다.' },
  synced: { step: '캘린더 반영 완료', intent: '캘린더에 등록된 시간을 자동으로 제외해, 이미 있는 일정을 다시 입력하지 않게 합니다.' },
  extra: { step: '추가 일정 입력', intent: '캘린더에 등록하지 않은 일정도 직접 추가해, 다른 참석자에게 이유를 설명하지 않고 조율에 반영합니다.' },
  prefs: { step: '피하고 싶은 시간 입력', intent: '가능하지만 피하고 싶은 시간을 다른 참석자에게 설명하지 않고 입력합니다. 단순한 가능 여부보다 선호 시간대를 구체적으로 반영합니다.' },
  summary: { step: '입력 확인', intent: '제출 전에 입력한 내용을 확인하고, 이후 후보 계산과 응답 취합은 서비스가 이어갑니다.' },
};

/* ---------- mini week calendar ---------- */
function IpWeekCal({ extra = [], highlight = null }) {
  const H0 = 9, H1 = 18, colH = 148;
  const y = (t) => ((ipMin(t) - H0 * 60) / ((H1 - H0) * 60)) * colH;
  const block = (b, color, key) => (
    <div key={key} style={{
      position: 'absolute', left: 2, right: 2, borderRadius: 4,
      top: y(b.start), height: Math.max(6, y(b.end) - y(b.start)),
      background: color,
    }}></div>
  );
  return (
    <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '12px 12px 10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        {IP_DAYS.map((d) => (
          <div key={d.d}>
            <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--grey-500)', marginBottom: 4 }}>
              {d.d} <span style={{ fontVariantNumeric: 'tabular-nums' }}>{d.date}</span>
            </div>
            <div style={{ position: 'relative', height: colH, background: '#fff', borderRadius: 6, border: '1px solid var(--grey-100)' }}>
              {IP_EVENTS.filter((e) => e.day === d.d).map((e, i) => block(e, 'var(--grey-200)', 'e' + i))}
              {extra.filter((e) => e.day === d.d).map((e, i) => block(e, 'var(--grey-400)', 'x' + i))}
              {highlight && highlight.day === d.d && block(highlight, 'var(--blue-400)', 'h')}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
        <span style={{ fontSize: 10.5, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--grey-200)' }}></span>캘린더 일정</span>
        {extra.length > 0 && <span style={{ fontSize: 10.5, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--grey-400)' }}></span>추가한 시간</span>}
        {highlight && <span style={{ fontSize: 10.5, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--blue-400)' }}></span>확정된 회의</span>}
      </div>
    </div>
  );
}

function IpEntryRow({ text, helper, onRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 14px', borderRadius: 12, background: 'var(--grey-50)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600, color: 'var(--grey-800)', fontVariantNumeric: 'tabular-nums' }}>{text}</div>
        {helper && (
          <div style={{ marginTop: 3, fontSize: 12.5, lineHeight: '18px', color: 'var(--grey-400)', wordBreak: 'keep-all' }}>{helper}</div>
        )}
      </div>
      {onRemove && (
        <button type="button" className="opt-btn" onClick={onRemove} style={{
          flexShrink: 0, border: 'none', background: 'transparent', padding: '2px 0 2px 8px',
          color: 'var(--grey-400)', fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>삭제</button>
      )}
    </div>
  );
}

function IpTimePicker({ day, setDay, start, setStart, end, setEnd, onAdd }) {
  const selStyle = {
    flex: 1, height: 44, borderRadius: 12, border: '1.5px solid var(--grey-200)', backgroundColor: '#fff',
    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--grey-800)',
    appearance: 'none', WebkitAppearance: 'none', padding: '0 38px 0 12px',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 14 14%22 fill=%22none%22%3E%3Cpath d=%22M4 5.5L7 8.5L10 5.5%22 stroke=%22%238B95A1%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '14px 14px',
  };
  return (
    <div style={{ display: 'grid', gap: 8, padding: 12, borderRadius: 14, background: 'var(--grey-50)' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {IP_DAYS.map((x) => (
          <button key={x.d} type="button" className="opt-btn" aria-pressed={day === x.d} onClick={() => setDay(x.d)} style={{
            flex: 1, padding: '6px 0', borderRadius: 10, textAlign: 'center', fontFamily: 'var(--font-sans)', cursor: 'pointer',
            border: day === x.d ? '1.5px solid var(--blue-300)' : '1.5px solid transparent',
            background: day === x.d ? 'var(--blue-50)' : '#fff', minHeight: 44,
          }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: day === x.d ? 'var(--blue-600)' : 'var(--grey-500)' }}>{x.d}</span>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: day === x.d ? 'var(--blue-700)' : 'var(--grey-700)', fontVariantNumeric: 'tabular-nums' }}>{x.date}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select aria-label="시작 시간" value={start} onChange={(e) => setStart(e.target.value)} style={selStyle}>
          {IP_TIMES.slice(0, -1).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{ color: 'var(--grey-400)', fontSize: 13 }}>–</span>
        <select aria-label="종료 시간" value={end} onChange={(e) => setEnd(e.target.value)} style={selStyle}>
          {IP_TIMES.filter((t) => ipMin(t) > ipMin(start)).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <AfButton variant="weak" size="medium" onClick={onAdd}>추가</AfButton>
    </div>
  );
}

/* ---------- 공통 입력 플로우 훅 ---------- */
function useAvailFlow({ email, roleLabel, onExitBack, onSubmit, submitLabel = '이대로 응답 보내기' }) {
  const [stage, setStage] = React.useState('connect');
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [busy, setBusy] = React.useState([]);
  const [prefs, setPrefs] = React.useState([]);
  const [prefCustom, setPrefCustom] = React.useState([]);
  const [showPicker, setShowPicker] = React.useState(false);
  const [showCalSheet, setShowCalSheet] = React.useState(false);
  const [showPrefPicker, setShowPrefPicker] = React.useState(false);
  const [pDay, setPDay] = React.useState('월'); const [pStart, setPStart] = React.useState('17:00'); const [pEnd, setPEnd] = React.useState('18:00');
  const [sDay, setSDay] = React.useState('금'); const [sStart, setSStart] = React.useState('13:00'); const [sEnd, setSEnd] = React.useState('14:00');

  const friBusyHit = busy.some((b) => ipOv(b, IP_FRI));
  const friPrefHit = prefs.includes('lunch') || prefCustom.some((b) => ipOv(b, IP_FRI));

  const reset = () => {
    setStage('connect'); setBusy([]); setPrefs([]); setPrefCustom([]); setIsConnecting(false);
    setShowPicker(false); setShowCalSheet(false); setShowPrefPicker(false);
  };

  React.useEffect(() => {
    if (stage !== 'connect') setShowCalSheet(false);
  }, [stage]);

  const chip = roleLabel ? <RoleChip>{roleLabel}</RoleChip> : null;

  let screen = null; let cta = null; let nav = null;

  if (stage === 'connect') {
    nav = { onBack: onExitBack, title: '일정 조율', progress: 1 };
    screen = (
      <React.Fragment>
        {chip}
        <ScreenTitle sub={'연결된 일정에서 회의 가능한 시간만 확인해요.'}>캘린더에서{'\n'}가능한 시간을 확인할까요?</ScreenTitle>
        <div style={{ borderRadius: 16, background: 'var(--grey-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid var(--grey-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4" width="15" height="13" rx="2.5" stroke="var(--grey-600)" strokeWidth="1.6"></rect><path d="M2.5 8H17.5" stroke="var(--grey-600)" strokeWidth="1.6"></path><path d="M6.5 2.5V5.5M13.5 2.5V5.5" stroke="var(--grey-600)" strokeWidth="1.6" strokeLinecap="round"></path></svg>
            </span>
            <span>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--grey-800)' }}>Google Calendar</span>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--grey-400)', marginTop: 2 }}>{email}</span>
            </span>
          </div>
          <button type="button" className="opt-btn" onClick={() => setShowCalSheet(true)} style={{
            width: '100%', minHeight: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
            border: 'none', borderTop: '1px solid var(--grey-100)', background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', borderRadius: '0 0 16px 16px',
            transition: 'background 150ms ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}><rect x="2.5" y="4" width="15" height="13" rx="2.5" stroke="var(--grey-500)" strokeWidth="1.6"></rect><path d="M2.5 8H17.5" stroke="var(--grey-500)" strokeWidth="1.6"></path><path d="M10 10.5V14.5M8 12.5H12" stroke="var(--grey-500)" strokeWidth="1.6" strokeLinecap="round"></path></svg>
            <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--grey-700)' }}>캘린더 추가 연결</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M6 3.5L10.5 8L6 12.5" stroke="var(--grey-400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginTop: 14, padding: '0 4px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
            <rect x="2.5" y="6" width="9" height="6" rx="1.8" stroke="#8b95a1" strokeWidth="1.5"></rect>
            <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#8b95a1" strokeWidth="1.5"></path>
          </svg>
          <span style={{ fontSize: 12.5, lineHeight: '18px', color: 'var(--grey-500)', wordBreak: 'keep-all' }}>일정 제목과 내용은 다른 사람에게 공개되지 않아요.</span>
        </div>
        {showCalSheet && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, borderRadius: 44, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <button type="button" aria-label="닫기" onClick={() => setShowCalSheet(false)} style={{ position: 'absolute', inset: 0, border: 'none', background: 'rgba(0,0,0,0.36)', cursor: 'pointer' }}></button>
            <div style={{ position: 'relative', background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 24px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--grey-900)', marginBottom: 4 }}>캘린더 추가 연결</div>
              <div style={{ fontSize: 13.5, lineHeight: '19px', color: 'var(--grey-500)', marginBottom: 16, wordBreak: 'keep-all' }}>여러 캘린더를 쓴다면 함께 연결해서 반영할 수 있어요.</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {['다른 Google 계정', 'Apple Calendar', 'Outlook', '기기 캘린더'].map((name) => (
                  <OptionButton key={name} label={name} small onClick={() => setShowCalSheet(false)} />
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <AfButton variant="secondary" onClick={() => setShowCalSheet(false)}>닫기</AfButton>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
    cta = (
      <AfButton variant="primary" disabled={isConnecting} onClick={() => {
        setIsConnecting(true);
        window.setTimeout(() => { setIsConnecting(false); setStage('synced'); }, 900);
      }}>
        {isConnecting ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <AfLoader size={16} />
            일정 확인 중
          </span>
        ) : '캘린더 연결하기'}
      </AfButton>
    );
  }

  if (stage === 'synced') {
    nav = { onBack: () => setStage('connect'), title: '일정 조율', progress: 1 };
    screen = (
      <React.Fragment>
        {chip}
        <ScreenTitle sub={'7월 13일–17일 일정 7개를 확인했어요.\n캘린더에 등록된 시간은 회의 후보에서 제외돼요.'}>캘린더 일정을{'\n'}반영했어요.</ScreenTitle>
        <div style={{ display: 'grid', gap: 12 }}>
          <InfoRows rows={[
            ['Google Calendar', '연결됨'],
            ['반영한 일정', '7개'],
            ['확인한 기간', '7월 13일–17일'],
          ]} />
          <IpWeekCal />
        </div>
      </React.Fragment>
    );
    cta = <AfButton variant="primary" onClick={() => setStage('extra')}>추가 일정 확인하기</AfButton>;
  }

  if (stage === 'extra') {
    nav = { onBack: () => setStage('synced'), title: '일정 조율', progress: 2 };
    screen = (
      <React.Fragment>
        {chip}
        <ScreenTitle sub={'추가한 시간은 회의 후보에서 빼고,\n다른 참석자에게는 공개하지 않아요.'}>캘린더에 없는{'\n'}일정이 더 있나요?</ScreenTitle>
        <div style={{ display: 'grid', gap: 12 }}>
          <IpWeekCal extra={busy} />
          {busy.length === 0 && !showPicker && (
            <div style={{ borderRadius: 14, border: '1.5px dashed var(--grey-200)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey-500)' }}>아직 추가한 시간이 없어요.</div>
              <div style={{ marginTop: 4, fontSize: 12.5, lineHeight: '18px', color: 'var(--grey-400)' }}>캘린더에 없는 개인 일정이 없다면<br />바로 다음으로 넘어가도 돼요.</div>
            </div>
          )}
          {busy.map((b, i) => (
            <IpEntryRow key={i} text={IP_DAYNAME[b.day] + ' ' + b.start + '–' + b.end} helper="이 시간은 회의 후보에서 제외할게요."
              onRemove={() => setBusy(busy.filter((_, j) => j !== i))} />
          ))}
          {showPicker
            ? <IpTimePicker day={pDay} setDay={setPDay} start={pStart} setStart={setPStart} end={pEnd} setEnd={setPEnd}
                onAdd={() => { setBusy([...busy, { day: pDay, start: pStart, end: pEnd }]); setShowPicker(false); }} />
            : (
              <button type="button" className="opt-btn" onClick={() => setShowPicker(true)} style={{
                width: '100%', minHeight: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
                background: '#fff', border: '1px solid var(--grey-200)', borderRadius: 14, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'background 150ms ease, border-color 150ms ease',
              }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--grey-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="var(--grey-600)" strokeWidth="1.6" strokeLinecap="round"></path></svg>
                </span>
                <span style={{ textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--grey-700)' }}>{busy.length === 0 ? '캘린더에 없는 일정 추가' : '일정 추가'}</span>
              </button>
            )}
        </div>
      </React.Fragment>
    );
    cta = <AfButton variant="primary" onClick={() => setStage('prefs')}>{busy.length === 0 ? '추가 일정 없이 다음' : '다음'}</AfButton>;
  }

  if (stage === 'prefs') {
    const hasPref = prefs.length > 0 || prefCustom.length > 0;
    nav = { onBack: () => setStage('extra'), title: '일정 조율', progress: 3 };
    screen = (
      <React.Fragment>
        {chip}
        <ScreenTitle sub={'가능한 다른 시간을 먼저 찾고,\n다른 후보가 없을 때만 다시 확인할게요.'}>되도록 피하고 싶은{'\n'}시간이 있나요?</ScreenTitle>
        <div style={{ display: 'grid', gap: 8 }}>
          {IP_PREFS.map((p) => (
            <OptionButton key={p.id} label={p.label}
              selected={prefs.includes(p.id)}
              onClick={() => setPrefs(prefs.includes(p.id) ? prefs.filter((x) => x !== p.id) : [...prefs, p.id])} />
          ))}
          <OptionButton label="특정 시간 직접 선택" selected={showPrefPicker} onClick={() => setShowPrefPicker(!showPrefPicker)} />
          {showPrefPicker && (
            <IpTimePicker day={sDay} setDay={setSDay} start={sStart} setStart={setSStart} end={sEnd} setEnd={setSEnd}
              onAdd={() => { setPrefCustom([...prefCustom, { day: sDay, start: sStart, end: sEnd }]); setShowPrefPicker(false); }} />
          )}
          {prefCustom.map((b, i) => (
            <IpEntryRow key={i} text={IP_DAYNAME[b.day] + ' ' + b.start + '–' + b.end} helper="가능한 다른 시간을 먼저 찾아요."
              onRemove={() => setPrefCustom(prefCustom.filter((_, j) => j !== i))} />
          ))}
        </div>
        <PrivacyNote inline>선택한 시간대는 다른 참석자에게 공개되지 않아요.</PrivacyNote>
      </React.Fragment>
    );
    cta = <AfButton variant="primary" onClick={() => setStage('summary')}>{hasPref ? '선택 완료' : '피하고 싶은 시간 없이 계속'}</AfButton>;
  }

  if (stage === 'summary') {
    nav = { onBack: () => setStage('prefs'), title: '입력 확인' };
    screen = (
      <React.Fragment>
        {chip}
        <ScreenTitle>입력한 내용을{'\n'}확인해주세요.</ScreenTitle>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--grey-400)', marginBottom: 6 }}>캘린더에서 반영한 일정</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-800)' }}>일정 7개 · 회의 후보에서 자동 제외</div>
          </div>
          <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--grey-400)', marginBottom: 6 }}>추가 일정</div>
            {busy.length === 0
              ? <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-400)' }}>추가한 시간 없음</div>
              : <React.Fragment>
                  {busy.map((b, i) => <div key={i} style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-800)', fontVariantNumeric: 'tabular-nums', padding: '2px 0' }}>{IP_DAYNAME[b.day] + ' ' + b.start + '–' + b.end}</div>)}
                  <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--grey-400)' }}>회의 후보에서 제외</div>
                </React.Fragment>}
          </div>
          <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--grey-400)', marginBottom: 6 }}>되도록 피하고 싶은 시간</div>
            {(prefs.length === 0 && prefCustom.length === 0)
              ? <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-400)' }}>선택한 시간 없음</div>
              : <React.Fragment>
                  {prefs.map((id) => <div key={id} style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-800)', padding: '2px 0' }}>{IP_PREFS.find((x) => x.id === id).label}</div>)}
                  {prefCustom.map((b, i) => <div key={'c' + i} style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-800)', fontVariantNumeric: 'tabular-nums', padding: '2px 0' }}>{IP_DAYNAME[b.day] + ' ' + b.start + '–' + b.end}</div>)}
                  <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--grey-400)' }}>가능한 다른 시간을 먼저 찾아요.</div>
                </React.Fragment>}
          </div>
        </div>
        <PrivacyNote>일정과 선호는 다른 참석자에게 공개되지 않아요.</PrivacyNote>
      </React.Fragment>
    );
    cta = <AfButton variant="primary" onClick={onSubmit}>{submitLabel}</AfButton>;
  }

  return {
    stage, setStage, screen, cta, nav,
    busy, prefs, prefCustom, friBusyHit, friPrefHit,
    reset, presetPrefs: setPrefs,
  };
}

Object.assign(window, {
  IP_DAYS, IP_DAYNAME, IP_TIMES, ipMin, ipOv, IP_EVENTS, IP_FRI, IP_PREFS,
  IpWeekCal, IpEntryRow, IpTimePicker, FLOW_NOTES, useAvailFlow,
});
