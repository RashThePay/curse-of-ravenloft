/* Copy @dicer_dnd_bot <roll> and open the campaign Telegram chat. */
(function (global) {
  const CAMPAIGN_CHAT = 'https://t.me/c/2414301175/7466';
  const BOT = '@dicer_dnd_bot';

  function d20(mod, label) {
    const n = Number(mod) || 0;
    const expr = n === 0 ? '1d20' : n > 0 ? '1d20+' + n : '1d20' + n;
    return label ? expr + ' ' + label : expr;
  }

  function copyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    if (!ok && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  function openChat() {
    const a = document.createElement('a');
    a.href = CAMPAIGN_CHAT;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function sendRoll(expr) {
    const text = (BOT + ' ' + String(expr || '').trim()).trim();
    copyText(text)
      .then(function () { toast('Copied. Paste in the campaign chat.'); })
      .catch(function () { toast(text); });
    openChat();
  }

  function fromClick(e) {
    if (e.target.closest && e.target.closest('button, input, textarea, select, a')) return;
    const el = e.target.closest && e.target.closest('[data-roll]');
    if (!el) return;
    e.preventDefault();
    sendRoll(el.getAttribute('data-roll'));
  }

  document.addEventListener('click', fromClick);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest && e.target.closest('[data-roll]');
    if (!el) return;
    e.preventDefault();
    sendRoll(el.getAttribute('data-roll'));
  });

  const style = document.createElement('style');
  style.textContent =
    '[data-roll]{cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '[data-roll]:hover{background:rgba(0,0,0,.055)}' +
    '[data-roll]:active{background:rgba(0,0,0,.1)}' +
    '[data-roll]:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '@media print{[data-roll]{cursor:default}[data-roll]:hover{background:transparent}}';
  document.head.appendChild(style);

  global.sendRoll = sendRoll;
  global.d20 = d20;
})(window);
