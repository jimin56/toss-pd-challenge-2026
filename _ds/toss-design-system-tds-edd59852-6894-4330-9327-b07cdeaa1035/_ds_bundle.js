/* @ds-bundle: {"format":4,"namespace":"TossDesignSystemTDS_edd598","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"TextButton","sourcePath":"components/actions/TextButton.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"ListRow","sourcePath":"components/data/ListRow.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Loader","sourcePath":"components/feedback/Loader.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"SegmentedControl","sourcePath":"components/navigation/SegmentedControl.jsx"},{"name":"Tab","sourcePath":"components/navigation/Tab.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"38e91e5f371f","components/actions/IconButton.jsx":"e0586e704d7a","components/actions/TextButton.jsx":"c62dcf1f9bb1","components/data/Badge.jsx":"fa6ceedfcadf","components/data/ListRow.jsx":"9ce429675c90","components/feedback/Dialog.jsx":"d5ac248a745b","components/feedback/Loader.jsx":"f60cf2fbe8e4","components/feedback/ProgressBar.jsx":"a4c13ebcdce5","components/feedback/Toast.jsx":"1a43f272d2ff","components/forms/Checkbox.jsx":"30c801d53b1a","components/forms/Radio.jsx":"67018379a9cf","components/forms/Switch.jsx":"2ed8603c8fb3","components/forms/TextField.jsx":"b7ff3f93f30b","components/navigation/SegmentedControl.jsx":"4e75c36be791","components/navigation/Tab.jsx":"4caf289f95b7","ui_kits/toss-app/app.jsx":"8f70c7c19895"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TossDesignSystemTDS_edd598 = window.TossDesignSystemTDS_edd598 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TDS Button — the primary tap target. Big, rounded (16px), high-contrast.
 * variant: primary (blue) · secondary (grey fill) · weak (tinted blue).
 */
function Button({
  variant = 'primary',
  size = 'large',
  display = 'block',
  disabled = false,
  loading = false,
  children,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const sizes = {
    large: {
      height: 56,
      fontSize: 17,
      radius: 16,
      padX: 22
    },
    medium: {
      height: 48,
      fontSize: 15,
      radius: 14,
      padX: 18
    },
    small: {
      height: 40,
      fontSize: 14,
      radius: 12,
      padX: 16
    },
    tiny: {
      height: 32,
      fontSize: 13,
      radius: 10,
      padX: 12
    }
  }[size];
  const variants = {
    primary: {
      bg: 'var(--blue-500)',
      bgPressed: 'var(--blue-600)',
      fg: '#fff'
    },
    secondary: {
      bg: 'var(--grey-100)',
      bgPressed: 'var(--grey-200)',
      fg: 'var(--grey-800)'
    },
    weak: {
      bg: 'var(--blue-50)',
      bgPressed: 'var(--blue-100)',
      fg: 'var(--blue-600)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      display: display === 'block' ? 'flex' : 'inline-flex',
      width: display === 'block' ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: sizes.height,
      padding: `0 ${sizes.padX}px`,
      border: 'none',
      borderRadius: sizes.radius,
      fontFamily: 'var(--font-sans)',
      fontSize: sizes.fontSize,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: disabled ? 'var(--grey-400)' : variants.fg,
      background: disabled ? 'var(--grey-100)' : pressed ? variants.bgPressed : variants.bg,
      cursor: disabled ? 'default' : 'pointer',
      transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
      transition: 'transform 150ms cubic-bezier(0.22,1,0.36,1), background 150ms ease',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement(Spinner, {
    color: variants.fg
  }) : children);
}
function Spinner({
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      border: `2.5px solid ${color === '#fff' ? 'rgba(255,255,255,0.35)' : 'var(--grey-300)'}`,
      borderTopColor: color,
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'tds-spin 0.7s linear infinite'
    }
  });
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS IconButton — a tappable square/circular icon target (navbar back, close, more). */
function IconButton({
  children,
  onClick,
  size = 44,
  shape = 'square',
  'aria-label': ariaLabel,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      borderRadius: shape === 'circle' ? '50%' : 12,
      background: pressed ? 'var(--grey-opacity-100)' : 'transparent',
      color: 'var(--grey-800)',
      transition: 'background 150ms ease',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/TextButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS TextButton — a borderless inline text action (e.g. "전체보기", "더보기"). */
function TextButton({
  children,
  onClick,
  size = 'medium',
  tone = 'neutral',
  withArrow = false,
  style,
  ...rest
}) {
  const fs = {
    large: 17,
    medium: 15,
    small: 13
  }[size];
  const color = tone === 'primary' ? 'var(--blue-500)' : 'var(--grey-500)';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      border: 'none',
      background: 'transparent',
      padding: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 600,
      color,
      cursor: 'pointer',
      letterSpacing: '-0.01em',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, rest), children, withArrow && /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 3.5L10.5 8L6 12.5",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(__ds_scope, { TextButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/TextButton.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS Badge — small status/label pill. */
function Badge({
  children,
  tone = 'blue',
  variant = 'weak',
  style,
  ...rest
}) {
  const tones = {
    blue: {
      strong: 'var(--blue-500)',
      weak: 'var(--blue-50)',
      weakFg: 'var(--blue-600)'
    },
    grey: {
      strong: 'var(--grey-500)',
      weak: 'var(--grey-100)',
      weakFg: 'var(--grey-700)'
    },
    red: {
      strong: 'var(--red-500)',
      weak: 'var(--red-50)',
      weakFg: 'var(--red-600)'
    },
    green: {
      strong: 'var(--green-500)',
      weak: 'var(--green-50)',
      weakFg: 'var(--green-600)'
    },
    orange: {
      strong: 'var(--orange-500)',
      weak: 'var(--orange-50)',
      weakFg: 'var(--orange-600)'
    }
  }[tone];
  const solid = variant === 'strong';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 6,
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.3,
      color: solid ? '#fff' : tones.weakFg,
      background: solid ? tones.strong : tones.weak,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TDS ListRow — the workhorse of Toss screens. Left slot (icon/avatar) + title/description,
 * right slot (value/chevron/switch). Toss builds most "cards" out of ListRows, not boxes.
 */
function ListRow({
  left,
  title,
  description,
  right,
  withArrow = false,
  onClick,
  padding = 'normal',
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const padY = {
    narrow: 10,
    normal: 14,
    wide: 18,
    xwide: 22
  }[padding];
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onPointerDown: () => clickable && setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: `${padY}px 0`,
      background: pressed ? 'var(--grey-opacity-50)' : 'transparent',
      cursor: clickable ? 'pointer' : 'default',
      transition: 'background 120ms ease',
      ...style
    }
  }, rest), left && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center'
    }
  }, left), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      fontWeight: 600,
      color: 'var(--grey-900)',
      letterSpacing: '-0.01em'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--grey-500)',
      marginTop: 2
    }
  }, description)), right && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--grey-700)'
    }
  }, right), withArrow && /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    style: {
      flexShrink: 0
    },
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.75 4L11.25 9L6.75 14",
    stroke: "var(--grey-400)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/** TDS Dialog — centered modal with scrim, title, body, and 1–2 stacked/side buttons. */
function Dialog({
  open = true,
  title,
  description,
  confirmText = '확인',
  cancelText,
  onConfirm,
  onCancel
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 320,
      background: '#fff',
      borderRadius: 20,
      padding: '28px 24px 20px',
      boxShadow: 'var(--shadow-3)'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      fontWeight: 700,
      color: 'var(--grey-900)',
      textAlign: 'center',
      letterSpacing: '-0.01em'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--grey-600)',
      textAlign: 'center',
      marginTop: 8
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 24
    }
  }, cancelText && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "medium",
    onClick: onCancel
  }, cancelText), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "medium",
    onClick: onConfirm
  }, confirmText))));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Loader.jsx
try { (() => {
/** TDS Loader — circular spinner. Toss uses a calm, single-colour ring. */
function Loader({
  size = 32,
  tone = 'blue',
  style
}) {
  const color = {
    blue: 'var(--blue-500)',
    grey: 'var(--grey-400)',
    white: '#fff'
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    role: "status",
    "aria-label": "\uB85C\uB529 \uC911",
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      border: `${Math.max(2, size * 0.11)}px solid var(--grey-200)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'tds-spin 0.7s linear infinite',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Loader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Loader.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/** TDS ProgressBar — thin rounded track, blue fill. */
function ProgressBar({
  value = 0,
  tone = 'blue',
  height = 6,
  style
}) {
  const fill = {
    blue: 'var(--blue-500)',
    green: 'var(--green-500)',
    grey: 'var(--grey-500)'
  }[tone];
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height,
      borderRadius: 999,
      background: 'var(--grey-100)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 999,
      background: fill,
      transition: 'width 300ms cubic-bezier(0.22,1,0.36,1)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/** TDS Toast — dark floating pill near the bottom, auto-hides. */
function Toast({
  message,
  icon,
  visible = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: visible ? 'flex' : 'none',
      alignItems: 'center',
      gap: 8,
      maxWidth: 340,
      padding: '14px 18px',
      borderRadius: 14,
      background: 'var(--grey-900)',
      color: '#fff',
      boxShadow: 'var(--shadow-3)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: '-0.01em',
      ...style
    }
  }, icon, /*#__PURE__*/React.createElement("span", null, message));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS Checkbox — rounded check, blue when selected. */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'default' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 24,
      height: 24,
      borderRadius: 8,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--blue-500)' : 'var(--grey-200)',
      transition: 'background 150ms ease'
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7.8L6 10.5L12 4.5",
    stroke: checked ? '#fff' : 'var(--grey-400)',
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--grey-800)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS Radio — single-select circle. */
function Radio({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'default' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    onClick: () => !disabled && onChange && onChange(true),
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: checked ? '7px solid var(--blue-500)' : '2px solid var(--grey-300)',
      background: '#fff',
      boxSizing: 'border-box',
      transition: 'border-color 150ms ease, border-width 100ms ease'
    }
  }, rest)), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--grey-800)'
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS Switch — pill toggle, green when on (Toss uses green for 'on'/positive). */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 52,
      height: 32,
      borderRadius: 16,
      border: 'none',
      padding: 3,
      background: checked ? 'var(--green-500)' : 'var(--grey-300)',
      cursor: disabled ? 'default' : 'pointer',
      position: 'relative',
      transition: 'background 200ms ease',
      opacity: disabled ? 0.4 : 1,
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,19,43,0.2)',
      transform: checked ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TDS TextField — Toss's label-above, borderless-underline text input. */
function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  suffix,
  type = 'text',
  disabled = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const underline = error ? 'var(--red-500)' : focused ? 'var(--blue-500)' : 'var(--grey-200)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--grey-600)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: `2px solid ${underline}`,
      transition: 'border-color 150ms ease',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      fontWeight: 500,
      color: 'var(--grey-900)',
      padding: 0
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--grey-500)',
      marginLeft: 8
    }
  }, suffix)), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--red-500)'
    }
  }, error));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedControl.jsx
try { (() => {
/** TDS SegmentedControl — pill segmented switch with a sliding white thumb. */
function SegmentedControl({
  items = [],
  value,
  onChange,
  style
}) {
  const idx = Math.max(0, items.findIndex(it => (typeof it === 'string' ? it : it.value) === value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      padding: 4,
      background: 'var(--grey-100)',
      borderRadius: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      left: 4,
      width: `calc((100% - 8px) / ${items.length})`,
      transform: `translateX(${idx * 100}%)`,
      background: '#fff',
      borderRadius: 9,
      boxShadow: 'var(--shadow-1)',
      transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)'
    }
  }), items.map(it => {
    const key = typeof it === 'string' ? it : it.value;
    const label = typeof it === 'string' ? it : it.label;
    const active = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      onClick: () => onChange && onChange(key),
      style: {
        flex: 1,
        zIndex: 1,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '8px 4px',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--grey-900)' : 'var(--grey-500)',
        transition: 'color 150ms ease',
        WebkitTapHighlightColor: 'transparent'
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tab.jsx
try { (() => {
/** TDS Tab — underline tab bar for switching sections. */
function Tab({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '1px solid var(--grey-200)',
      ...style
    }
  }, items.map(it => {
    const key = typeof it === 'string' ? it : it.value;
    const label = typeof it === 'string' ? it : it.label;
    const active = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      onClick: () => onChange && onChange(key),
      style: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '14px 4px 12px',
        position: 'relative',
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--grey-900)' : 'var(--grey-400)',
        WebkitTapHighlightColor: 'transparent'
      }
    }, label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        background: active ? 'var(--grey-900)' : 'transparent',
        borderRadius: 2,
        transition: 'background 150ms ease'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toss-app/app.jsx
try { (() => {
const {
  Button,
  TextButton,
  IconButton,
  ListRow,
  Badge,
  SegmentedControl,
  TextField,
  Dialog,
  Toast,
  Tab
} = window.TossDesignSystemTDS_edd598;

// ---- tiny inline icons (generic geometric; brand icons are proprietary) ----
const Ic = {
  bell: /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 8.5a6 6 0 10-12 0c0 6-2.5 7-2.5 7h17S18 14.5 18 8.5zM10 20a2 2 0 004 0",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  search: /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "6.5",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.6-3.6",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  })),
  back: /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 5l-7 7 7 7",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  home: a => /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: a ? 'currentColor' : 'none'
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinejoin: "round"
  })),
  gift: a => /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: a ? 'currentColor' : 'none'
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 11h16v8a1 1 0 01-1 1H5a1 1 0 01-1-1zM3 7h18v4H3zM12 7V4m0 3c-3 0-4-3-2-3s2 3 2 3zm0 0c3 0 4-3 2-3s-2 3-2 3zM12 7v13",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  })),
  grid: a => /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: a ? 'currentColor' : 'none'
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "6.5",
    height: "6.5",
    rx: "2",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13.5",
    y: "4",
    width: "6.5",
    height: "6.5",
    rx: "2",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "13.5",
    width: "6.5",
    height: "6.5",
    rx: "2",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13.5",
    y: "13.5",
    width: "6.5",
    height: "6.5",
    rx: "2",
    stroke: "currentColor",
    strokeWidth: "1.7"
  })),
  plus: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }))
};
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--grey-900)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "12",
    viewBox: "0 0 18 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "6",
    width: "3",
    height: "6",
    rx: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "3.5",
    width: "3",
    height: "8.5",
    rx: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "1",
    width: "3",
    height: "11",
    rx: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "0",
    width: "3",
    height: "12",
    rx: "1",
    fill: "currentColor",
    opacity: "0.35"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "12",
    viewBox: "0 0 24 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "20",
    height: "10",
    rx: "3",
    stroke: "currentColor",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "15",
    height: "6",
    rx: "1.5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "4",
    width: "1.5",
    height: "4",
    rx: "1",
    fill: "currentColor"
  }))));
}
function Bank({
  c,
  t
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: c,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 17,
      flexShrink: 0
    }
  }, t);
}
function TabBar({
  tab,
  setTab
}) {
  const items = [['home', '홈', Ic.home], ['gift', '혜택', Ic.gift], ['grid', '전체', Ic.grid]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 62,
      borderTop: '1px solid var(--grey-100)',
      display: 'flex',
      background: '#fff'
    }
  }, items.map(([k, l, ic]) => {
    const a = tab === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => setTab(k),
      style: {
        flex: 1,
        border: 'none',
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        cursor: 'pointer',
        color: a ? 'var(--grey-900)' : 'var(--grey-400)',
        WebkitTapHighlightColor: 'transparent'
      }
    }, ic(a), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: a ? 700 : 500
      }
    }, l));
  }));
}
function HomeScreen({
  go
}) {
  const [range, setRange] = React.useState('월');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      background: 'var(--grey-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 12px 6px 22px',
      background: 'var(--grey-50)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: 'var(--blue-500)',
      letterSpacing: '-.04em'
    }
  }, "toss"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      color: 'var(--grey-800)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\uAC80\uC0C9"
  }, Ic.search), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\uC54C\uB9BC"
  }, Ic.bell))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '6px 16px 0',
      background: '#fff',
      borderRadius: 20,
      padding: '22px 20px',
      boxShadow: 'var(--shadow-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--grey-600)'
    }
  }, "\uB0B4 \uC790\uC0B0"), /*#__PURE__*/React.createElement(TextButton, {
    withArrow: true
  }, "\uC804\uCCB4")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: '-.03em',
      marginTop: 6,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "2,060,500", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, "\uC6D0")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "green",
    variant: "weak"
  }, "\uC774\uBC88 \uB2EC +128,000\uC6D0")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    items: ['주', '월', '년'],
    value: range,
    onChange: setRange
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '12px 16px 0',
      background: '#fff',
      borderRadius: 20,
      padding: '6px 18px',
      boxShadow: 'var(--shadow-1)'
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    left: /*#__PURE__*/React.createElement(Bank, {
      c: "var(--blue-500)",
      t: "T"
    }),
    title: "\uD1A0\uC2A4\uBC45\uD06C \uD1B5\uC7A5",
    description: "\uC785\uCD9C\uAE08",
    right: "1,240,500\uC6D0",
    withArrow: true,
    onClick: () => go('send')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--grey-100)'
    }
  }), /*#__PURE__*/React.createElement(ListRow, {
    left: /*#__PURE__*/React.createElement(Bank, {
      c: "var(--grey-700)",
      t: "K"
    }),
    title: "\uAD6D\uBBFC\uC740\uD589",
    description: "\uC8FC\uAC70\uB798\uC6B0\uB300",
    right: "620,000\uC6D0",
    withArrow: true,
    onClick: () => go('send')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--grey-100)'
    }
  }), /*#__PURE__*/React.createElement(ListRow, {
    left: /*#__PURE__*/React.createElement(Bank, {
      c: "var(--red-500)",
      t: "\uC99D"
    }),
    title: "\uD1A0\uC2A4\uC99D\uAD8C",
    description: "\uD22C\uC790",
    right: "200,000\uC6D0",
    withArrow: true,
    onClick: () => go('send')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 16px 28px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => go('send')
  }, "\uC1A1\uAE08\uD558\uAE30")));
}
function SendScreen({
  back
}) {
  const [amt, setAmt] = React.useState('');
  const [showDialog, setShow] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const disabled = !amt || Number(amt.replace(/,/g, '')) <= 0;
  const fmt = v => {
    const n = v.replace(/[^0-9]/g, '');
    return n ? Number(n).toLocaleString('en-US') : '';
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 52,
      padding: '0 8px',
      color: 'var(--grey-800)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\uB4A4\uB85C",
    onClick: back
  }, Ic.back)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 24px 0',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-.02em',
      lineHeight: 1.35
    }
  }, "\uD1A0\uC2A4\uBC45\uD06C \uCD5C\uC9C0\uC6C5\uB2D8\uAED8", /*#__PURE__*/React.createElement("br", null), "\uC5BC\uB9C8\uB97C \uBCF4\uB0BC\uAE4C\uC694?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "\uBCF4\uB0BC \uAE08\uC561",
    placeholder: "0",
    suffix: "\uC6D0",
    value: amt,
    onChange: e => setAmt(fmt(e.target.value)),
    type: "tel"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 16,
      flexWrap: 'wrap'
    }
  }, ['+1만', '+5만', '+10만', '전액'].map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => {
      const base = Number((amt || '0').replace(/,/g, ''));
      const add = {
        '+1만': 10000,
        '+5만': 50000,
        '+10만': 100000
      }[q];
      setAmt(fmt(String(q === '전액' ? 1240500 : base + add)));
    },
    style: {
      border: 'none',
      background: 'var(--grey-100)',
      color: 'var(--grey-700)',
      fontWeight: 600,
      fontSize: 14,
      padding: '8px 14px',
      borderRadius: 10,
      cursor: 'pointer'
    }
  }, q)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 24px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: disabled,
    onClick: () => setShow(true)
  }, disabled ? '보내기' : amt + '원 보내기')), /*#__PURE__*/React.createElement(Dialog, {
    open: showDialog,
    title: "\uC1A1\uAE08\uD560\uAE4C\uC694?",
    description: `토스뱅크 최지웅님께 ${amt}원을 보내요.`,
    cancelText: "\uCDE8\uC18C",
    confirmText: "\uBCF4\uB0B4\uAE30",
    onCancel: () => setShow(false),
    onConfirm: () => {
      setShow(false);
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    }
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 92,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    message: amt + '원을 보냈어요'
  })));
}
function App() {
  const [tab, setTab] = React.useState('home');
  const [screen, setScreen] = React.useState('home'); // home | send
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(StatusBar, null), screen === 'send' ? /*#__PURE__*/React.createElement(SendScreen, {
    back: () => setScreen('home')
  }) : /*#__PURE__*/React.createElement(HomeScreen, {
    go: setScreen
  }), screen !== 'send' && /*#__PURE__*/React.createElement(TabBar, {
    tab: tab,
    setTab: setTab
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toss-app/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.TextButton = __ds_scope.TextButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Loader = __ds_scope.Loader;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Tab = __ds_scope.Tab;

})();
