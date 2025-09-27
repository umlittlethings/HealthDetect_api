import { qs, setHTML, fmt, loadingSkeleton, showError, hideError } from './utils.js';
import { readIdentityFromRiskForm } from './risk.js';

export function initNutrition() {
  const form = qs('#nutrition-form');
  const resultsEl = qs('#nutrition-results');
  const errorEl = qs('#nutrition-error');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(errorEl);
    setHTML(resultsEl, `<div class="md:col-span-3">${loadingSkeleton(3)}</div>`);

    const base = readIdentityFromRiskForm();
    const nfd = new FormData(form);
    const payload = {
      ...base,
      weight: Number(nfd.get('weight')),
      height: Number(nfd.get('height')),
      activityLevel: nfd.get('activityLevel'),
      stressLevel: nfd.get('stressLevel')
    };

    try {
      if (!base.name || !Number.isFinite(base.age) || !['male','female'].includes(base.gender)) {
        throw new Error('Fill name, age, and gender in the first form');
      }
      const req = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!req.ok) {
        const err = await req.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${req.status}`);
      }
      const data = await req.json();
      const user = data.user || {};
      const result = data.result || {};

      setHTML(resultsEl, `
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold text-teal-700 mb-2">User</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-gray-500">Name:</span> ${fmt(user.name)}</div>
            <div><span class="text-gray-500">Age:</span> ${fmt(user.age)}</div>
            <div><span class="text-gray-500">Gender:</span> ${fmt(user.gender)}</div>
          </div>
        </div>
        <div class="rounded-lg border p-4 md:col-span-2">
          <h3 class="font-semibold text-teal-700 mb-2">Nutrition Summary</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div><span class="text-gray-500">BMI:</span> ${fmt(result.bmi)}</div>
            <div><span class="text-gray-500">BMI Category:</span> ${fmt(result.bmiCategory)}</div>
            <div><span class="text-gray-500">Ideal Weight (kg):</span> ${fmt(result.idealWeight)}</div>
            <div><span class="text-gray-500">BMR (kcal):</span> ${fmt(result.bmr)}</div>
            <div><span class="text-gray-500">TEE (kcal):</span> ${fmt(result.tee)}</div>
          </div>
        </div>
        <div class="rounded-lg border p-4 md:col-span-3">
          <h3 class="font-semibold text-teal-700 mb-2">Macros</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div><span class="text-gray-500">Protein:</span> ${fmt(result.proteinGram)} g (${fmt(result.proteinPercent)}%)</div>
            <div><span class="text-gray-500">Fat:</span> ${fmt(result.fatGram)} g (${fmt(result.fatPercent)}%)</div>
            <div><span class="text-gray-500">Carbs:</span> ${fmt(result.carbGram)} g (${fmt(result.carbPercent)}%)</div>
          </div>
        </div>
      `);
    } catch (err) {
      showError(errorEl, err.message || 'Something went wrong');
    }
  });
}


