/* brand.js — يبني لوجو «اسمع دين · esma3 Deen» مكان النص القديم (سبلاتش + الهيدر) */
(function () {
  'use strict';
  if (window.__brand) return;
  window.__brand = 1;
  let n = 0;
  const WAVES = [['M40.94 24.92A5 5 0 0 1 40.94 31.08', '#b0c078'], ['M44.88 21.84A10 10 0 0 1 44.88 34.16', '#88c783'], ['M48.82 18.77A15 15 0 0 1 48.82 37.23', '#5fcf8f']];
  function mark() {
    const i = ++n;
    return '<svg class="bmk" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="bg' + i + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#d9b86c"/><stop offset="1" stop-color="#fff3c4"/></linearGradient>' +
      '<mask id="bk' + i + '"><rect width="64" height="64" fill="#fff"/><circle cx="37" cy="28" r="17.5" fill="#000"/></mask></defs>' +
      '<g transform="translate(3 0)"><circle class="bc" cx="27" cy="33" r="21" fill="url(#bg' + i + ')" mask="url(#bk' + i + ')"/>' +
      '<g fill="none" stroke-width="3" stroke-linecap="round">' +
      WAVES.map((w, k) => '<path class="bw bw' + (k + 1) + '" pathLength="1" d="' + w[0] + '" stroke="' + w[1] + '"/>').join('') +
      '</g></g></svg>';
  }
  function build(el) {
    el.classList.add('bl');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'اسمع دين');
    el.innerHTML = mark() + '<span class="bt"><b>اسمع دين</b><small>esma3 Deen</small></span>';
  }
  function scan() {
    const L = document.querySelectorAll('.logo:not(.bl)');
    for (let i = 0; i < L.length; i++) if (L[i].textContent.trim() === 'اسمع دين') build(L[i]);
  }
  /* بيشتغل من أول ما العنصر يتعمل (السبلاتش) ومع كل إعادة رسم للهيدر */
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
  document.addEventListener('DOMContentLoaded', scan);
})();
