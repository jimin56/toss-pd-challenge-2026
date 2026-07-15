/* page-fx.js — 읽기 경험 인터랙션 (모두 1회 재생, prefers-reduced-motion 시 생략)
   1) 최초 진입 Slack 알림
   2) 섹션 진입 Fade Up (제목·카드 그룹, 60ms 스태거)
   3) 문제 정의 대화 순차 노출
   4) DECISION FLOW 순차 강조
   5) 내비게이션 현재 위치 + 읽기 진행률 */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Slack 메시지 시퀀스 (겹침 스택) ---------- */
  var SLACK_MSGS = [
    { sender: '백지민', channel: '#프로덕트-팀', text: '다음 주 화요일 2시 회의 괜찮으세요?' },
    { sender: '김현석', channel: '#프로덕트-팀', text: '전 그때 다른 회의가 있습니다 ㅠㅠ' },
    { sender: '백지민', channel: '#프로덕트-팀', text: '그럼 오후 4시는 어떠세요?' },
    { sender: '백지민', channel: '#프로덕트-팀', text: '@here 다른 분들도 의견 말씀해주시면 감사하겠습니다~' },
  ];
  var SLACK_TOTAL = 12800; // DOM 제거 시점(ms)

  function appendSlackMessage(element, text) {
    text.split(/(@here)/g).forEach(function (part) {
      if (part === '@here') {
        var mention = document.createElement('span');
        mention.className = 'slack-mention';
        mention.textContent = '@here';
        element.appendChild(mention);
        return;
      }
      element.appendChild(document.createTextNode(part));
    });
  }

  function slackToast() {
    var stack = document.getElementById('slack-stack');
    var tpl = document.getElementById('slack-toast-tpl');
    if (!stack || !tpl) return;
    if (reduced) { stack.remove(); return; }
    stack.setAttribute('aria-hidden', 'false');

    function show(i) {
      var msg = SLACK_MSGS[i];
      var previous = stack.querySelector('.slack-toast.is-previous');
      var current = stack.querySelector('.slack-toast.is-current');
      if (previous) {
        previous.classList.remove('is-previous');
        previous.classList.add('is-leaving');
        setTimeout(function () { previous.remove(); }, 500);
      }
      if (current) {
        current.classList.remove('is-current');
        current.classList.add('is-previous');
      }
      var node = tpl.content.firstElementChild.cloneNode(true);
      node.querySelector('.slack-toast-sender').textContent = msg.sender;
      node.querySelector('.slack-toast-channel').textContent = msg.channel + ' · 팀 워크스페이스';
      appendSlackMessage(node.querySelector('.slack-toast-message'), msg.text);
      stack.appendChild(node);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { node.classList.add('is-current'); });
      });
    }

    setTimeout(function () { show(0); }, 1000);
    setTimeout(function () { show(1); }, 4000);
    setTimeout(function () { show(2); }, 7000);
    setTimeout(function () { show(3); }, 8400);
    setTimeout(function () {
      Array.prototype.forEach.call(stack.querySelectorAll('.slack-toast'), function (t) {
        t.classList.remove('is-current', 'is-previous');
        t.classList.add('is-leaving');
      });
      stack.setAttribute('aria-hidden', 'true');
    }, 12200);
    setTimeout(function () { stack.remove(); }, SLACK_TOTAL);
  }

  /* ---------- 2. 섹션 진입 Fade Up ---------- */
  function reveal() {
    var heads = document.querySelectorAll('section > .wrap > .eyebrow, section > .wrap > .sec-title, section > .wrap > .lead, header.hero .hero-title, header.hero .hero-problem');
    heads.forEach(function (el) { el.classList.add('fx'); });
    // 카드 그룹: 그룹 내 인덱스로 60ms 스태거
    var groups = ['.problem-cards', '.card-grid.cols-3', '.check-groups', '.limits', '.compare'];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (g) {
        Array.prototype.forEach.call(g.children, function (card, i) {
          card.classList.add('fx');
          card.style.transitionDelay = (i * 60) + 'ms';
        });
      });
    });
    document.querySelectorAll('.interaction-card').forEach(function (el) { el.classList.add('fx'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('fx-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fx').forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. 대화 순차 노출 ---------- */
  function chat() {
    var flow = document.querySelector('.chat-flow');
    if (!flow) return;
    var items = Array.prototype.slice.call(flow.children);
    var thought = flow.querySelector('.chat-thought');
    items.forEach(function (el) { el.classList.add('fx-chat'); });
    if (thought) thought.classList.add('fx-chat');
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var t = 0;
      items.forEach(function (el) {
        setTimeout(function () {
          el.classList.add('fx-chat-in');
          if (el.classList.contains('chat-status')) el.classList.add('fx-blink');
        }, t);
        t += 105;
        if (thought && el.contains(thought)) {
          (function (d) { setTimeout(function () { thought.classList.add('fx-chat-in'); }, d); })(t);
          t += 105;
        }
      });
    }, { threshold: 0.3 });
    io.observe(flow);
  }

  /* ---------- 4. DECISION FLOW 순차 강조 ---------- */
  function flow2() {
    var grid = document.querySelector('.flow2-grid');
    if (!grid) return;
    var steps = grid.querySelectorAll('.flow2-step');
    var excA = grid.querySelector('.flow2-exc.exc-a');
    var excB = grid.querySelector('.flow2-exc.exc-b');
    if (excA) excA.classList.add('fx-exc');
    if (excB) excB.classList.add('fx-exc');
    steps.forEach(function (s) { s.classList.add('fx-step'); });
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      grid.classList.add('fx-rail-run');
      steps.forEach(function (s, i) {
        setTimeout(function () {
          s.classList.add('fx-step-on');
          if (i === 1 && excA) setTimeout(function () { excA.classList.add('fx-exc-in'); }, 100);
          if (i === 2 && excB) setTimeout(function () { excB.classList.add('fx-exc-in'); }, 100);
        }, 120 + i * 220);
      });
    }, { threshold: 0.3 });
    io.observe(grid);
  }

  /* ---------- 5. 내비게이션 현재 위치 (파란 선 대신 배경 면으로 표시) ---------- */
  function nav() {
    var navEl = document.querySelector('.nav');
    if (!navEl) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)'));
    var sections = links.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    });
    function onScroll() {
      var mid = window.scrollY + window.innerHeight * 0.4;
      var active = -1;
      sections.forEach(function (sec, i) {
        if (sec && sec.offsetTop <= mid) active = i;
      });
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    nav();
    if (reduced || !('IntersectionObserver' in window)) {
      slackToast();
      return;
    }
    document.documentElement.classList.add('fx-enabled');
    slackToast();
    reveal();
    chat();
    flow2();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
