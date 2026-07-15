/* interactive.jsx — 참석 요청 받기: 김현석(필수 참석자) 관점 + 탭 셸 (v5)
   일정 입력은 개설자와 공유하는 useAvailFlow를 사용하고, 입력이 실제로
   후보 상태·추가 확인·결과를 결정한다. 케이스 스터디 노트는 프레임 밖. */

const ipTDS = window.TossDesignSystemTDS_edd598;
const { Button: IpButton, Badge: IpBadge } = ipTDS;

const IP_NOTES = {
  intro: { step: '회의 요청 수신', intent: '참석자가 질문에 반복해서 답하는 대신, 자신의 일정과 선호를 한 번 입력하는 흐름으로 시작합니다. 요청자의 이름만 보이고, 다른 참석자의 응답은 보이지 않습니다.' },
  sent: { step: '응답 전송 완료', intent: '한 번 제출한 일정과 선호 시간대를 서비스가 조율 과정 전체에 활용해, 같은 질문에 반복해서 답하지 않아도 됩니다. 프로토타입에서는 응답이 모이는 시간을 짧게 압축해, 후보 확인까지 이어서 경험할 수 있습니다.' },
  collected: { step: '후보 검토 결과', intent: '추가 확인을 요청하기 전에, 서비스가 어떤 후보를 검토했고 왜 다시 묻는지를 먼저 보여줍니다. 개별 참석자의 이름과 일정은 공개하지 않습니다.' },
  ask: { step: '추가 가능 여부 확인', intent: '다른 후보가 없을 때만 해당 참석자에게 확인해, 전체 참석자를 대상으로 한 반복 질문을 줄입니다.' },
  askAccepted: { step: '추가 응답 반영', intent: '피하고 싶은 시간과 겹치는 후보를 허용한 경우에만 응답 반영 상태를 보여줍니다. 추가 확인이 없었던 참석자는 이 단계를 거치지 않습니다.' },
  excludedAck: { step: '응답 반영', intent: '거절은 여기서 안전하게 끝나고, 이후 조율은 서비스가 이어갑니다. 조건 조정은 참석자의 몫이 아닙니다.' },
  noFitAck: { step: '재조율 안내', intent: '가능한 후보가 없어도 임의로 정하지 않고, 회의 조건을 조정해 새로운 시간을 찾습니다. 참석자가 따로 할 일이 없다는 것까지 한 화면에서 안내합니다.' },
  confirmed: { step: '일정 확정', intent: '추가 확인이 필요하지 않다면 후보 확인 후 바로 결과를 안내합니다. 확정된 시간과 결정에 사용한 기준은 모든 참석자에게 동일하게 보여줍니다.' },
  recoord: { step: '다시 조율 요청', intent: '확정 이후에도 사정이 바뀔 수 있어, 이유를 선택해 다시 조율을 요청할 수 있습니다. 선택한 이유는 다른 참석자에게 공개되지 않습니다.' },
  recoordSent: { step: '조율 요청 완료', intent: '요청이 반영되면 이미 받은 일정과 조건으로 새로운 후보를 다시 확인합니다. 참석자에게 같은 입력을 반복해서 요구하지 않습니다.' },
};

/* ---------- main ---------- */
function InteractivePrototype() {
  const [step, setStep] = React.useState('intro');   // intro | flow | sent | collected | ask | askAccepted | excludedAck | noFitAck | confirmed | recoord | recoordSent
  const [friExcluded, setFriExcluded] = React.useState(false); // 개인 확인에서 제외 응답
  const [allIn, setAllIn] = React.useState(false);             // 응답 수집 완료(시간 경과 압축)
  const [recoordReason, setRecoordReason] = React.useState(null);

  const flow = useAvailFlow({
    email: 'hyunseok.kim@company.com',
    roleLabel: null,
    onExitBack: () => setStep('intro'),
    onSubmit: () => setStep('sent'),
  });

  /* derived — user input actually decides the outcome */
  const friViable = !flow.friBusyHit && !friExcluded;
  const needAsk = friViable && flow.friPrefHit;

  const reset = () => {
    setStep('intro'); setFriExcluded(false); flow.reset(); setAllIn(false); setRecoordReason(null);
  };

  /* 다른 상황 보기 — 일관된 상태로 점프 */
  const jump = (target) => {
    flow.reset(); setFriExcluded(false); setAllIn(false); setRecoordReason(null);
    if (target === 'input') { setStep('flow'); flow.setStage('prefs'); }
    else { flow.presetPrefs(['lunch']); setStep(target); }
  };

  /* 응답 대기 시간을 프로토타입 안에서 압축 */
  React.useEffect(() => {
    if (step !== 'sent') return undefined;
    setAllIn(false);
    const t = setTimeout(() => setAllIn(true), 1500);
    return () => clearTimeout(t);
  }, [step]);

  let screen = null; let cta = null; let nav = null;

  if (step === 'intro') {
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'백지민 님이 7월 13일(월)–17일(금) 중\n60분 회의를 요청했어요.'}>프로젝트 킥오프 일정을{'\n'}함께 정해주세요.</ScreenTitle>
        <InfoRows rows={[
          ['요청한 사람', '백지민'],
          ['기간', '7월 13일(월)–17일(금)'],
          ['길이', '60분'],
          ['필수 참석자', '5명'],
          ['참석 권장자', '1명'],
        ]} />
      </React.Fragment>
    );
    cta = <IpButton variant="primary" onClick={() => { flow.reset(); setStep('flow'); }}>내 일정 확인하기</IpButton>;
  }

  /* ── 공통 일정 입력 플로우 (개설자와 동일 컴포넌트) ── */
  if (step === 'flow') {
    screen = flow.screen; cta = flow.cta; nav = flow.nav;
  }

  if (step === 'sent') {
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'다른 참석자의 응답이 모이면 가능한 시간을\n확인해 알려드릴게요. 지금 화면을 닫아도 괜찮아요.'}>내 응답을 보냈어요.</ScreenTitle>
        <div style={{ display: 'grid', gap: 12 }}>
          {allIn ? (
            <React.Fragment>
              <ProgressCard done={6} total={6} sub="필수 참석자 5/5 · 참석 권장자 1/1" />
              <StatusList items={[
                ['내 응답 반영 완료', 'done'],
                ['모든 참석자 응답 완료', 'done'],
                ['후보 확인 중', 'active'],
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
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
    cta = allIn ? <IpButton variant="primary" onClick={() => setStep('collected')}>후보 확인하기</IpButton> : null;
  }

  if (step === 'collected') {
    const candRow = (time, note, tone, badge) => (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, padding: '13px 0', borderBottom: '1px solid var(--grey-100)' }}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tone === 'muted' ? 'var(--grey-400)' : 'var(--grey-900)', textDecoration: tone === 'muted' ? 'line-through' : 'none' }}>{time}</span>
          <span style={{ display: 'block', marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: 'var(--grey-500)', wordBreak: 'keep-all' }}>{note}</span>
        </span>
        <span style={{ flexShrink: 0, marginTop: 1 }}>{badge}</span>
      </div>
    );
    if (!friViable) {
      screen = (
        <React.Fragment>
          <div style={{ margin: '4px 0 12px' }}><IpBadge tone="blue" variant="weak">모든 응답 도착</IpBadge></div>
          <ScreenTitle sub={'후보 3개를 확인했지만,\n모두 참석자의 일정과 겹쳤어요.'}>응답을 모아{'\n'}후보를 확인했어요.</ScreenTitle>
          <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '2px 16px' }}>
            {candRow('월요일 17:00–18:00', '참석자의 추가 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
            {candRow('수요일 14:00–15:00', '필수 참석자의 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
            {candRow('금요일 13:00–14:00', flow.friBusyHit ? '추가한 일정과 겹쳐 제외' : '참석자의 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
          </div>
        </React.Fragment>
      );
      cta = <IpButton variant="primary" onClick={() => setStep('noFitAck')}>확인했어요</IpButton>;
    } else if (needAsk) {
      screen = (
        <React.Fragment>
          <div style={{ margin: '4px 0 12px' }}><IpBadge tone="blue" variant="weak">모든 응답 도착</IpBadge></div>
          <ScreenTitle sub={'금요일 1시는 참석할 수 있지만,\n피하고 싶은 시간대와 겹쳐\n한 번 더 확인이 필요해요.'}>응답을 모아{'\n'}후보를 확인했어요.</ScreenTitle>
          <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '2px 16px' }}>
            {candRow('월요일 17:00–18:00', '참석자의 추가 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
            {candRow('수요일 14:00–15:00', '필수 참석자의 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
            {candRow('금요일 13:00–14:00', '내 선호 시간대와 겹쳐 추가 확인 필요', 'strong', <IpBadge tone="blue" variant="weak">확인 필요</IpBadge>)}
          </div>
        </React.Fragment>
      );
      cta = <IpButton variant="primary" onClick={() => setStep('ask')}>금요일 1시 응답하기</IpButton>;
    } else {
      screen = (
        <React.Fragment>
          <div style={{ margin: '4px 0 12px' }}><IpBadge tone="blue" variant="weak">모든 응답 도착</IpBadge></div>
          <ScreenTitle sub={'다른 후보 2개는 일정과 겹쳐 제외됐고,\n금요일 1시는 필수 참석자 모두 가능해요.'}>응답을 모아{'\n'}후보를 확인했어요.</ScreenTitle>
          <div style={{ borderRadius: 14, background: 'var(--grey-50)', padding: '2px 16px' }}>
            {candRow('월요일 17:00–18:00', '참석자의 추가 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
            {candRow('수요일 14:00–15:00', '필수 참석자의 일정과 겹쳐 제외', 'muted', <IpBadge tone="grey" variant="weak">제외</IpBadge>)}
            {candRow('금요일 13:00–14:00', '캘린더·추가 일정과 충돌 없음', 'strong', <IpBadge tone="green" variant="weak">가능</IpBadge>)}
          </div>
        </React.Fragment>
      );
      cta = <IpButton variant="primary" onClick={() => setStep('confirmed')}>확정된 일정 보기</IpButton>;
    }
  }

  if (step === 'ask') {
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'참석할 수는 있지만 피하고 싶은 시간대와 겹치는\n시간이에요. 다른 후보가 없어 한 번만 더 확인할게요.'}>금요일 1시를{'\n'}후보에 포함해도 될까요?</ScreenTitle>
        <PrivacyNote>선택한 결과와 개인적인 이유는 다른 참석자에게 공개되지 않아요.</PrivacyNote>
      </React.Fragment>
    );
    cta = (
      <div style={{ display: 'grid', gap: 8 }}>
        <IpButton variant="primary" onClick={() => setStep('askAccepted')}>후보에 포함해도 돼요</IpButton>
        <IpButton variant="secondary" onClick={() => { setFriExcluded(true); setStep('excludedAck'); }}>후보에서 제외해주세요</IpButton>
      </div>
    );
  }

  if (step === 'askAccepted') {
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'금요일 1시를 후보에 포함했어요.\n모든 조건을 다시 확인한 뒤 결과를 알려드릴게요.'}>내 응답을 반영했어요.</ScreenTitle>
        <StatusList items={[
          ['추가 응답 반영 완료', 'done'],
          ['전체 조건 확인 완료', 'done'],
          ['최종 시간 정리 중', 'active'],
        ]} />
      </React.Fragment>
    );
    cta = <IpButton variant="primary" onClick={() => setStep('confirmed')}>조율 결과 보기</IpButton>;
  }

  if (step === 'excludedAck') {
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'다른 후보가 없으면 회의 조건을 조정해\n새로운 시간을 찾아요.'}>금요일 1시는{'\n'}후보에서 제외했어요.</ScreenTitle>
      </React.Fragment>
    );
    cta = <IpButton variant="primary" onClick={() => setStep('noFitAck')}>확인했어요</IpButton>;
  }

  if (step === 'noFitAck') {
    nav = { onBack: null, title: '조율 진행' };
    screen = (
      <React.Fragment>
        <ScreenTitle sub={'기간이나 회의 길이를 조정해\n새로운 시간을 찾고 있어요.'}>현재 조건으로는{'\n'}가능한 시간이 없어요.</ScreenTitle>
        <StatusList items={[
          ['내 응답 반영 완료', 'done'],
          ['가능한 시간 확인 완료', 'done'],
          ['회의 조건 조정 중', 'active'],
          ['새로운 시간 확인', 'idle'],
        ]} />
        <div style={{ marginTop: 14, borderRadius: 12, background: 'var(--grey-50)', padding: '12px 14px', fontSize: 12.5, lineHeight: '18px', color: 'var(--grey-500)', wordBreak: 'keep-all' }}>
          지금은 따로 할 일이 없어요. 새로운 시간이 생기면 알려드릴게요.
        </div>
      </React.Fragment>
    );
    cta = null;
  }

  if (step === 'confirmed') {
    const criteria = needAsk
      ? [CONFIRM_CRITERIA[0], '피하고 싶은 시간과 겹쳤지만, 내가 포함해도 된다고 응답했어요.', CONFIRM_CRITERIA[2], CONFIRM_CRITERIA[3]]
      : CONFIRM_CRITERIA;
    nav = { onBack: null, title: '일정 확정' };
    screen = (
      <React.Fragment>
        <ConfirmBadge />
        <ScreenTitle center sub={'6명의 일정과 응답을 모두 반영해\n시간을 정했어요.'}>금요일 오후 1시로{'\n'}회의가 정해졌어요.</ScreenTitle>
        <ConfirmedMeeting
          meeting="프로젝트 킥오프"
          date="7월 17일 금요일"
          time="오후 1:00–2:00"
          criteria={criteria}
        />
        <CalToast />
      </React.Fragment>
    );
    cta = (
      <div style={{ display: 'grid', gap: 8 }}>
        <IpButton variant="primary" onClick={() => {}}>확인했어요</IpButton>
        <IpButton variant="secondary" onClick={() => { setRecoordReason(null); setStep('recoord'); }}>다시 조율 요청하기</IpButton>
      </div>
    );
  }

  /* ── 다시 조율 요청 ── */
  if (step === 'recoord') {
    nav = { onBack: () => setStep('confirmed'), title: '다시 조율 요청' };
    screen = <RecoordRequestScreen selected={recoordReason} onSelect={setRecoordReason} />;
    cta = <IpButton variant="primary" disabled={!recoordReason} onClick={() => setStep('recoordSent')}>다시 조율 요청 보내기</IpButton>;
  }

  if (step === 'recoordSent') {
    nav = { onBack: null, title: '요청 완료' };
    screen = <RecoordSentScreen />;
    cta = <IpButton variant="primary" onClick={() => {}}>처음으로 돌아가기</IpButton>;
  }

  const note = step === 'flow' ? FLOW_NOTES[flow.stage] : (IP_NOTES[step] || IP_NOTES.intro);

  /* ---------- shell: phone + case-study panel ---------- */
  return (
    <div className="proto-card" style={{ borderRadius: 28, background: 'var(--grey-50)', border: '1px solid var(--grey-100)' }}>
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: '100%', maxWidth: 350, flexShrink: 1 }}>
          <PhoneFrame screenLabel={'참석 요청 받기 · ' + note.step} cta={cta} nav={nav}>
            {screen}
          </PhoneFrame>
        </div>

        {/* case-study panel — outside the product frame */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScenarioCard role="필수 참석자" pref="점심 직후는 되도록 피하고 싶음" />
          <IntentCard step={note.step} intent={note.intent} />
          <SceneJumpCard
            scenes={[
              ['피하고 싶은 시간과 겹치는 경우', 'ask'],
              ['가능한 후보가 없는 경우', 'noFitAck'],
            ]}
            onJump={jump}
          />
          <ResetButton onClick={reset} />
        </div>
      </div>
    </div>
  );
}

/* ---------- role-switch shell: 회의 만들기 / 참석 요청 받기 ---------- */
function PrototypeShell() {
  const { SegmentedControl: IpSeg } = window.TossDesignSystemTDS_edd598;
  const [role, setRole] = React.useState('host');
  return (
    <div>
      <div style={{ maxWidth: 420, margin: '0 auto 28px' }}>
        <IpSeg
          items={[{ value: 'host', label: '회의 만들기' }, { value: 'attendee', label: '참석 요청 받기' }]}
          value={role}
          onChange={setRole}
        />
      </div>
      {role === 'host' ? <HostPrototype /> : <InteractivePrototype />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('interactive-root')).render(<PrototypeShell />);
