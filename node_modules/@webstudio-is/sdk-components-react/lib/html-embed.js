import { jsx as s } from "react/jsx-runtime";
import { forwardRef as b, useContext as x, useState as E, useSyncExternalStore as k, useRef as f, useMemo as T, useEffect as g } from "react";
import { mergeRefs as L } from "@react-aria/utils";
import { ReactSdkContext as _ } from "@webstudio-is/react-sdk/runtime";
import { patchDomEvents as C, executeDomEvents as w } from "./html-embed-patchers.js";
const M = {
  scriptTestIdPrefix: "client-"
}, O = (e) => new Promise((t, n) => {
  const r = document.createElement("script"), i = e.hasAttribute("src"), a = e.type === "module";
  for (const { name: c, value: o } of e.attributes)
    r.setAttribute(c, o);
  if (r.dataset.testid !== void 0 && (r.dataset.testid = `${M.scriptTestIdPrefix}${r.dataset.testid}`), i)
    r.addEventListener("load", () => {
      t();
    }), r.addEventListener("error", n);
  else {
    if (a) {
      const c = new Blob([e.innerText], {
        type: "text/javascript"
      }), o = URL.createObjectURL(c);
      import(
        /* @vite-ignore */
        o
      ).then(t).catch(n).finally(() => {
        URL.revokeObjectURL(o);
      });
      return;
    }
    r.textContent = e.innerText;
  }
  e.replaceWith(r), i === !1 && t();
}), d = [];
let u = !1;
const H = async (e) => {
  if (d.push(...e), await Promise.resolve(), !u) {
    for (C(), u = !0; d.length > 0; )
      await d.shift()();
    w(), u = !1;
  }
}, I = (e) => {
  const t = e.querySelectorAll("script"), n = [], r = [];
  t.forEach((i) => {
    (i.hasAttribute("async") ? r : n).push(() => O(i));
  });
  for (const i of r)
    i();
  H(n);
}, P = (e) => {
  const { code: t, innerRef: n, ...r } = e;
  return /* @__PURE__ */ s("div", { ref: n, ...r, style: { display: "block", padding: 20 }, children: 'Open the "Settings" panel to insert HTML code.' });
}, p = () => k(
  () => () => {
  },
  () => !1,
  () => !0
), l = (e) => {
  if (!p())
    return e.children;
}, m = (e) => {
  const { code: t, innerRef: n, ...r } = e, i = f(null), a = f(!0), c = T(
    () => ({
      __html: t ?? ""
    }),
    [t]
  );
  return g(() => {
    const o = i.current;
    o && a.current && (a.current = !1, I(o));
  }, []), /* @__PURE__ */ s(
    "div",
    {
      ...r,
      ref: L(n, i),
      dangerouslySetInnerHTML: c
    }
  );
}, v = (e) => {
  const { code: t, innerRef: n, ...r } = e;
  return /* @__PURE__ */ s(
    "div",
    {
      ...r,
      ref: n,
      dangerouslySetInnerHTML: { __html: t ?? "" }
    }
  );
}, h = v, A = b(
  (e, t) => {
    const { code: n, executeScriptOnCanvas: r, clientOnly: i, children: a, ...c } = e, { renderer: o, isSafeMode: y } = x(_), R = p(), [S] = E(R);
    return n === void 0 || String(n).trim().length === 0 ? /* @__PURE__ */ s(P, { innerRef: t, ...c }) : S ? i !== !0 ? /* @__PURE__ */ s(v, { innerRef: t, code: n, ...c }) : /* @__PURE__ */ s(l, { children: /* @__PURE__ */ s(m, { innerRef: t, code: n, ...c }) }) : y ? /* @__PURE__ */ s(l, { children: /* @__PURE__ */ s(
      h,
      {
        innerRef: t,
        code: n,
        ...c
      }
    ) }) : o === "canvas" && r !== !0 ? /* @__PURE__ */ s(l, { children: /* @__PURE__ */ s(
      h,
      {
        innerRef: t,
        code: n,
        ...c
      }
    ) }) : /* @__PURE__ */ s(l, { children: /* @__PURE__ */ s(
      m,
      {
        innerRef: t,
        code: n,
        ...c
      },
      n
    ) });
  }
);
A.displayName = "HtmlEmbed";
export {
  A as HtmlEmbed,
  M as __testing__
};
