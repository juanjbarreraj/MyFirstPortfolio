/* Which scan files the 3D viewer loads (phones get the lighter set). Verbatim from the original page. */
window.__MODEL__ = "scan/globe.wasm";
window.__SPLAT_LITE__ = location.hash === "#lite" || (location.hash !== "#full" && (matchMedia("(pointer: coarse)").matches || Math.min(screen.width, screen.height) < 820));
window.__SPLAT__ = window.__SPLAT_LITE__ ? ["scan/final-m1.wasm", "scan/final-m2.wasm"] : ["scan/final-1.wasm", "scan/final-2.wasm", "scan/final-3.wasm"];
window.__SPLAT_BYTES__ = window.__SPLAT_LITE__ ? 20400240 : 35700244;
window.__HYBRID__ = /^#solid[1-4]$/.test(location.hash);
(function(){ var m = /^#solid(\d)$/.exec(location.hash); var lv = m ? +m[1] : 3; window.__HYB_BIAS__ = [0.015, -0.01, -0.03, -0.08][Math.min(3, lv)]; window.__SOLID_LEVEL__ = lv; })();
window.__MODEL_FIT__ = {"camZ":3.45,"ctrY":0.30,"homeX":-0.25,"homeY":5.6};
