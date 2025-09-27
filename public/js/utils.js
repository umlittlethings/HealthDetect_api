export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function fmt(value) {
  return value ?? '-';
}

export function setHTML(el, html) {
  if (el) el.innerHTML = html;
}

export function showError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}

export function hideError(el) {
  if (!el) return;
  el.textContent = '';
  el.classList.add('hidden');
}

export function loadingSkeleton(lines = 3) {
  const items = Array.from({ length: lines }, (_, i) => {
    const w = i === 0 ? 'w-full' : i === 1 ? 'w-2/3' : 'w-1/2';
    return `<div class="h-4 bg-teal-100 rounded ${w}"></div>`;
  }).join('');
  return `<div class="animate-pulse space-y-3">${items}</div>`;
}



