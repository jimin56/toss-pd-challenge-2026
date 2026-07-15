/* host.jsx — 회의 만들기 (v5)
   흐름: 회의 정보 설정 → 참석자 설정 → 참석 요청 전송 →
        (개설자도 참석) 공통 일정 입력 플로우 → 조율 진행 → 서비스가 최종 시간 확정
   예외: 가능한 후보 없음 → 회의 조건 조정 → 후보 다시 탐색
   핵심: 개설자는 회의 조건과 참석자만 설정하고, 이후에는 다른 참석자와 같은 방식으로
        일정과 선호를 입력한다. 응답 수집·재알림·후보 비교·최종 확정은 서비스가 수행한다. */

const hostTDS = window.TossDesignSystemTDS_edd598;
const { Button: HButton } = hostTDS;

/* ---------- data ---------- */
const HOST_PEOPLE = [
  { name: '백지민', role: 'required', isMe: true },
  { name: '김민준', role: 'required' },
  { name: '이서연', role: 'required' },
  { name: '박현우', role: 'recommended' },
  { name: '최유진', role: 'required' },
  { name: '정도윤', role: 'required' },
];

const HOST_MEETING = {
  name: '프로젝트 킥오프',
  period: '7월 13일(월)–17일(금)',
  length: '60분',
  window: '평일 오전 10시–오후 6시',
  date: '7월 17일 금요일',
  time: '오후 1:00–2:00',
};

const HOST_STEP_META = {
  setup: { n: null, title: '회의 만들기' },
  roles: { n: null, title: '참석자 설정' },
  requested: { n: null, title: '참석 요청 완료' },
  progress: { n: null, title: '조율 진행' },
  confirmed: { n: null, title: '일정 확정' },
  nofit: { n: null, title: '조건 조정' },
  rescan: { n: null, title: '후보 다시 찾기' },
  recoord: { n: null, title: '다시 조율 요청' },
  recoordSent: { n: null, title: '요청 완료' },
};

const HOST_NOTES = {
  setup: { step: '회의 정보 설정', intent: '회의 개설자는 회의 조건과 참석자만 설정합니다. 개설자도 참석한다면 이후에는 다른 참석자와 같은 방식으로 일정과 선호를 입력하고, 응답 수집부터 최종 시간 확정까지 서비스가 이어갑니다.' },
  roles: { step: '참석자 설정', intent: '모두 가능한 시간이 없을 때 필수 참석자를 기준으로 후보를 찾도록 역할을 정합니다. 참석자 추가와 편집도 이 화면에서 이어집니다. 개설자도 참석하므로 요청을 보내기 전에 자신의 일정과 선호를 먼저 입력합니다.' },
  requested: { step: '참석 요청 전송', intent: '개설자의 일정 입력이 끝난 뒤 참석 요청을 보냅니다. 응답 수집과 미응답자 재알림은 서비스가 이어갑니다.' },
  progress: { step: '조율 진행', intent: '실제로는 참석자의 응답을 기다리는 단계입니다. 프로토타입에서는 시간 경과를 압축해 확정 결과까지 이어서 보여줍니다.' },
  confirmed: { step: '일정 확정', intent: '조건이 같은 후보는 요청 기간 안에서 더 빠른 시간으로 서비스가 확정해, 마지막 선택의 부담을 개인에게 남기지 않습니다. 결정 기준은 모든 참석자에게 같게 안내합니다.' },
  nofit: { step: '가능한 후보 없음 (예외)', intent: '가능한 후보가 없을 때만 개설자의 판단이 필요합니다. 사람을 선택하는 대신 기간·길이·참석 권장 조건 같은 회의 조건만 조정합니다.' },
  rescan: { step: '후보 다시 탐색', intent: '이미 받은 일정과 선호를 다시 사용해 새로운 후보를 계산합니다. 참석자에게 같은 입력을 반복해서 요구하지 않습니다.' },
  recoord: { step: '다시 조율 요청', intent: '확정 이후에도 사정이 바뀔 수 있어, 이유를 선택해 다시 조율을 요청할 수 있습니다. 선택한 이유는 다른 참석자에게 공개되지 않습니다.' },
  recoordSent: { step: '조율 요청 완료', intent: '요청이 반영되면 이미 받은 일정과 조건으로 새로운 후보를 다시 확인합니다. 참석자에게 같은 입력을 반복해서 요구하지 않습니다.' },
};

/* ---------- small parts ---------- */
/* 필수/권장 세그먼트 */
function HostRoleSeg({ value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--grey-100)', borderRadius: 10, padding: 2, gap: 2, flexShrink: 0 }}>
      {[['required', '필수 참석'], ['recommended', '참석 권장']].map(([v, l]) => (
        <button key={v} type="button" className="opt-btn" aria-pressed={value === v} onClick={() => onChange(v)} style={{
          border: 'none', cursor: 'pointer', borderRadius: 8, padding: '9px 11px', fontFamily: 'var(--font-sans)',
          fontSize: 12.5, fontWeight: 600, minHeight: 36,
          background: value === v ? '#fff' : 'transparent',
          color: value === v ? 'var(--grey-900)' : 'var(--grey-500)',
          boxShadow: value === v ? '0 1px 2px rgba(0,23,51,0.10)' : 'none',
          transition: 'background 150ms ease, color 150ms ease',
        }}>{l}</button>
      ))}
    </div>
  );
}

function HostAdjustCard({ title, current, proposal, btn, onGo }) {
  return (
    <div style={{ borderRadius: 16, background: 'var(--grey-50)', padding: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--grey-900)', marginBottom: 10, wordBreak: 'keep-all' }}>{title}</div>
      <div style={{ display: 'grid', gap: 5, marginBottom: 12 }}>
        {current && (
          <div style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: '19px' }}>
            <span style={{ flexShrink: 0, width: 30, color: 'var(--grey-400)', fontWeight: 600 }}>현재</span>
            <span style={{ color: 'var(--grey-600)', fontVariantNumeric: 'tabular-nums' }}>{current}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: '19px' }}>
          <span style={{ flexShrink: 0, width: 30, color: 'var(--blue-500)', fontWeight: 700 }}>제안</span>
          <span style={{ color: 'var(--grey-800)', fontWeight: 600, wordBreak: 'keep-all' }}>{proposal}</span>
        </div>
      </div>
      <HButton variant="weak" size="medium" onClick={onGo}>{btn}</HButton>
    </div>
  );
}

/* ---------- main ---------- */
function HostPrototype() {
  const [step, setStep] = React.useState('setup');   // setup | roles | requested | flow | progress | confirmed | nofit | rescan | recoord | recoordSent
  const [people, setPeople] = React.useState(HOST_PEOPLE);
  const [allIn, setAllIn] = React.useState(false);           // 조율 진행 — 응답 수집 완료(시간 경과 압축)
  const [recoordReason, setRecoordReason] = React.useState(null);

  const flow = useAvailFlow({
    email: 'jimin.baek@company.com',
    roleLabel: null,
    onExitBack: () => setStep('roles'),
    submitLabel: '참석 요청 보내기',
    onSubmit: () => setStep('requested'),
  });

  const requiredCount = people.filter((p) => p.role === 'required').length;
  const recommendedCount = people.length - requiredCount;

  const reset = () => {
    setStep('setup'); setPeople(HOST_PEOPLE); flow.reset(); setAllIn(false); setRecoordReason(null);
  };

  /* 다른 상황 보기 */
  const jump = (target) => {
    flow.reset(); setAllIn(false); setRecoordReason(null);
    if (target === 'flow') { setStep('flow'); }
    else setStep(target);
  };

  /* 조율 진행 — 응답이 모이는 시간을 압축해 상태 변경 */
  React.useEffect(() => {
    if (step !== 'progress') return undefined;
    setAllIn(false);
    const t = setTimeout(() => setAllIn(true), 1500);
    return () => clearTimeout(t);
  }, [step]);

  /* 조건 조정 후 서비스가 자동으로 재탐색 → 확정 */
  React.useEffect(() => {
    if (step !== 'rescan') return undefined;
    const t = setTimeout(() => setStep('confirmed'), 1400);
    return () => clearTimeout(t);
  }, [step]);

  let screen = null; let cta = null; let nav = null;
  const meta = HOST_STEP_META[step];

  /* ── 1. 회의 정보 설정 ── */
  if (step === 'setup') {
    nav = { onBack: null, title: meta.title };
    screen = (
      <React.Fragment>
        <ScreenTitle>어떤 회의를{'\n'}만들까요?</ScreenTitle>
        <div>
          <SectionLabel>회의 정보</SectionLabel>
          <InfoRows rows={[
            ['회의명', HOST_MEETING.name],
            ['기간', HOST_MEETING.period],
            ['회의 길이', HOST_MEETING.length],
            ['회의 가능 시간', HOST_MEETING.window],
          ]} />
        </div>
        <div style={{ marginTop: 24 }}>
          <SectionLabel>참석자</SectionLabel>
          <div style={{ width: '100%', borderRadius: 14, background: 'var(--grey-50)', padding: '16px 18px' }}>
            <div style={{ display: 'flex' }}>
              {people.slice(0, 5).map((p, i) => (
                <span key={p.name} style={{ marginLeft: i === 0 ? 0 : -6, border: '2px solid var(--grey-50)', borderRadius: '50%', display: 'inline-flex' }}>
                  <PAvatar name={p.name} i={i} size={30} />
                </span>
              ))}
              <span style={{
                marginLeft: -6, width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                border: '2px solid var(--grey-50)', background: 'var(--grey-200)', color: 'var(--grey-600)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700,
              }} aria-hidden="true">+1</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: 'var(--grey-900)', fontVariantNumeric: 'tabular-nums' }}>{people.length}명</div>
            <div style={{ marginTop: 2, fontSize: 13, color: 'var(--grey-500)', fontVariantNumeric: 'tabular-nums' }}>필수 {requiredCount}명 · 권장 {recommendedCount}명</div>
          </div>
        </div>
      </React.Fragment>
    );
    cta = <HButton variant="primary" onClick={() => setStep('roles')}>참석자 설정하기</HButton>;
  }

  /* ── 2. 참석자 설정 ── */
  if (step === 'roles') {
    nav = { onBack: () => setStep('setup'), title: meta.title };
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'필수 참석자는 모두 참석할 수 있는 시간만 찾아요.'}>누가 꼭{'\n'}참석해야 하나요?</ScreenTitle>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--grey-500)', fontVariantNumeric: 'tabular-nums' }}>참석자 {people.length}명</span>
          <button type="button" className="opt-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700,
            color: 'var(--blue-600)', padding: '6px 8px', borderRadius: 8, minHeight: 32,
            transition: 'background 150ms ease',
          }}>
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 1V9M1 5H9" stroke="var(--blue-500)" strokeWidth="1.8" strokeLinecap="round"></path></svg>
            추가
          </button>
        </div>
        <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '4px 14px' }}>
          {people.map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < people.length - 1 ? '1px solid var(--grey-100)' : 'none' }}>
              <PAvatar name={p.name} i={i} size={32} />
              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--grey-800)', flex: 1, minWidth: 0 }}>
                {p.name}
                {p.isMe && <span style={{ marginLeft: 4, fontSize: 12, fontWeight: 600, color: 'var(--grey-400)' }}>(나)</span>}
              </span>
              <HostRoleSeg value={p.role} onChange={(role) => setPeople(people.map((x) => x.name === p.name ? { ...x, role } : x))} />
            </div>
          ))}
        </div>
        <PrivacyNote>참석자의 일정과 응답 내용은 회의 개설자에게도 공개되지 않아요.</PrivacyNote>
      </React.Fragment>
    );
    cta = <HButton variant="primary" onClick={() => { flow.reset(); setStep('flow'); }}>내 일정 입력하기</HButton>;
  }

  /* ── 3. 참석 요청 완료 ── */
  if (step === 'requested') {
    nav = { onBack: null, title: meta.title };
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'응답이 모이면 가능한 시간을\n확인해 알려드릴게요.'}>참석 요청을{'\n'}보냈어요.</ScreenTitle>
        <div style={{ display: 'grid', gap: 12 }}>
          <StatusCard label="참석 요청" value={people.length + '명에게 전송 완료'} />
          <InfoRows rows={[
            ['응답 마감', '오늘 오후 6시'],
          ]} />
        </div>
      </React.Fragment>
    );
    cta = <HButton variant="primary" onClick={() => setStep('progress')}>조율 현황 보기</HButton>;
  }

  /* ── 4. 공통 일정 입력 플로우 (참석자와 동일 컴포넌트) ── */
  if (step === 'flow') {
    screen = flow.screen; cta = flow.cta; nav = flow.nav;
  }

  /* ── 5. 조율 진행 ── */
  if (step === 'progress') {
    nav = { onBack: null, title: meta.title };
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'아직 응답하지 않은 참석자에게 다시 알리고 있어요.\n결과가 정해지면 알려드릴게요.'}>일정을{'\n'}조율하고 있어요.</ScreenTitle>
        <div style={{ display: 'grid', gap: 12 }}>
          {allIn ? (
            <React.Fragment>
              <ProgressCard done={6} total={6} sub="필수 참석자 5/5 · 참석 권장자 1/1" />
              <StatusList items={[
                ['내 응답 반영 완료', 'done'],
                ['모든 참석자 응답 완료', 'done'],
                ['후보 비교 완료', 'done'],
                ['회의 시간 확정 완료', 'done'],
              ]} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ProgressCard done={4} total={6} sub="필수 참석자 4/5 · 참석 권장자 0/1" />
              <StatusList items={[
                ['내 응답 반영 완료', 'done'],
                ['다른 참석자 응답 확인 중', 'active'],
                ['필요한 경우 추가 확인', 'idle'],
                ['회의 시간 확정', 'idle'],
              ]} />
              <div style={{ borderRadius: 12, background: 'var(--grey-50)', padding: '12px 14px', fontSize: 12.5, lineHeight: '18px', color: 'var(--grey-500)', wordBreak: 'keep-all' }}>
                화면을 닫아도 조율은 계속 진행돼요. 결과가 나오면 바로 알려드릴게요.
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
    cta = allIn ? <HButton variant="primary" onClick={() => setStep('confirmed')}>확정된 일정 보기</HButton> : null;
  }

  /* ── 6. 일정 확정 — 서비스가 최종 시간 결정 ── */
  if (step === 'confirmed') {
    nav = { onBack: null, title: meta.title };
    screen = (
      <React.Fragment>
        <ConfirmBadge />
        <ScreenTitle center sub={'6명의 일정과 응답을 모두 반영해\n시간을 정했어요.'}>금요일 오후 1시로{'\n'}회의가 정해졌어요.</ScreenTitle>
        <ConfirmedMeeting
          meeting={HOST_MEETING.name}
          date={HOST_MEETING.date}
          time={HOST_MEETING.time}
          criteria={CONFIRM_CRITERIA}
        />
        <CalToast />
      </React.Fragment>
    );
    cta = (
      <div style={{ display: 'grid', gap: 8 }}>
        <HButton variant="primary" onClick={() => {}}>확인했어요</HButton>
        <HButton variant="secondary" onClick={() => { setRecoordReason(null); setStep('recoord'); }}>다시 조율 요청하기</HButton>
      </div>
    );
  }

  /* ── 예외: 가능한 후보 없음 → 회의 조건 조정 ── */
  if (step === 'nofit') {
    nav = { onBack: null, title: meta.title };
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'기간이나 회의 길이를 조정하면\n새로운 시간을 찾을 수 있어요.'}>현재 조건으로는{'\n'}가능한 시간이 없어요.</ScreenTitle>
        <div style={{ display: 'grid', gap: 10 }}>
          <HostAdjustCard title="기간 넓히기" current="7월 13일(월)–17일(금)" proposal="7월 20일(월)까지 후보 찾기" btn="기간 넓히기" onGo={() => setStep('rescan')} />
          <HostAdjustCard title="회의 길이 줄이기" current="60분" proposal="30분 후보도 함께 찾기" btn="30분으로 찾기" onGo={() => setStep('rescan')} />
          <HostAdjustCard title="참석 권장 조건 조정" proposal="참석 권장자를 제외하면 가능한 시간이 2개 있어요." btn="후보 확인하기" onGo={() => setStep('rescan')} />
        </div>
      </React.Fragment>
    );
    cta = <HButton variant="secondary" onClick={() => setStep('setup')}>직접 조건 수정하기</HButton>;
  }

  /* ── 예외: 조정한 조건으로 다시 탐색 ── */
  if (step === 'rescan') {
    nav = { onBack: null, title: meta.title };
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'입력된 일정은 그대로 두고,\n바뀜 조건으로 다시 찾고 있어요.'}>조정한 조건으로{'\n'}후보를 다시 찾고 있어요.</ScreenTitle>
        <StatusList items={[
          ['조정한 조건 반영 완료', 'done'],
          ['새로운 후보 탐색 중', 'active'],
          ['최종 시간 결정', 'idle'],
        ]} />
      </React.Fragment>
    );
    cta = null;
  }

  /* ── 다시 조율 요청 ── */
  if (step === 'recoord') {
    nav = { onBack: () => setStep('confirmed'), title: meta.title };
    screen = <RecoordRequestScreen isHost selected={recoordReason} onSelect={setRecoordReason} />;
    cta = <HButton variant="primary" disabled={!recoordReason} onClick={() => setStep('recoordSent')}>다시 조율 요청 보내기</HButton>;
  }

  if (step === 'recoordSent') {
    nav = { onBack: null, title: meta.title };
    screen = <RecoordSentScreen />;
    cta = <HButton variant="primary" onClick={() => {}}>처음으로 돌아가기</HButton>;
  }

  const note = step === 'flow' ? FLOW_NOTES[flow.stage] : HOST_NOTES[step];

  return (
    <div className="proto-card" style={{ borderRadius: 28, background: 'var(--grey-50)', border: '1px solid var(--grey-100)' }}>
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: '100%', maxWidth: 350, flexShrink: 1 }}>
          <PhoneFrame screenLabel={'회의 만들기 · ' + note.step} cta={cta} nav={nav}>
            {screen}
          </PhoneFrame>
        </div>

        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScenarioCard role="회의를 만든 사람" />
          <IntentCard step={note.step} intent={note.intent} />
          <SceneJumpCard
            scenes={[
              ['가능한 후보가 없는 경우', 'nofit'],
            ]}
            onJump={jump}
          />
          <ResetButton onClick={reset} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HostPrototype });
