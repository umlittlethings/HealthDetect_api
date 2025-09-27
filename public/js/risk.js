import { qs, setHTML, fmt, loadingSkeleton, showError, hideError } from './utils.js';

export function initRisk() {
  const form = qs('#risk-form');
  const resultsEl = qs('#results');
  const errorEl = qs('#error');

  if (!form) return;

  function validate(payload) {
    if (!payload.name || payload.name.length < 2) return 'Name is required (min 2 chars)';
    if (!Number.isFinite(payload.age) || payload.age < 18) return 'Age must be 18+';
    if (!['male', 'female'].includes(payload.gender)) return 'Gender invalid';
    const nums = ['totalCholesterol','hdlCholesterol','systolicBP'];
    for (const k of nums) {
      if (!Number.isFinite(payload[k])) return `${k} must be a number`;
    }
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(errorEl);
    setHTML(resultsEl, loadingSkeleton(3));

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name')?.toString().trim(),
      age: Number(formData.get('age')),
      gender: formData.get('gender'),
      race: formData.get('race')?.toString().trim() || undefined,
      totalCholesterol: Number(formData.get('totalCholesterol')),
      hdlCholesterol: Number(formData.get('hdlCholesterol')),
      systolicBP: Number(formData.get('systolicBP')),
      isSmoker: formData.get('isSmoker') === 'on',
      isDiabetic: formData.get('isDiabetic') === 'on',
      restingHeartRates: formData.get('restingHeartRates')
        ? formData.get('restingHeartRates').toString().split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n))
        : []
    };

    try {
      const validationError = validate(payload);
      if (validationError) throw new Error(validationError);

      const res = await fetch('/api/framingham', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      const user = data.user || {};
      const framingham = data.framingham || {};
      const ascvd = data.ascvd || {};

      setHTML(resultsEl, `
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold text-teal-700 mb-2">User</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-gray-500">Name:</span> ${fmt(user.name)}</div>
            <div><span class="text-gray-500">Age:</span> ${fmt(user.age)}</div>
            <div><span class="text-gray-500">Gender:</span> ${fmt(user.gender)}</div>
            <div><span class="text-gray-500">Race:</span> ${fmt(user.race)}</div>
          </div>
        </div>

        <div class="rounded-lg border p-4">
          <h3 class="font-semibold text-teal-700 mb-2">Framingham</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-gray-500">Score:</span> ${fmt(framingham.riskScore ?? framingham.score)}</div>
            <div><span class="text-gray-500">Level:</span> ${fmt(framingham.riskLevel ?? framingham.level)}</div>
            <div><span class="text-gray-500">Percentage:</span> ${fmt(framingham.riskPercentage ?? framingham.percentage)}</div>
            <div><span class="text-gray-500">Avg HR:</span> ${fmt(framingham.avgHeartRate)}</div>
            <div class="col-span-2 text-gray-700">${fmt(framingham.message)}</div>
            <div class="col-span-2 text-xs text-gray-500">Assessment: ${fmt(framingham.assessmentDate)}</div>
          </div>
        </div>

        <div class="rounded-lg border p-4">
          <h3 class="font-semibold text-teal-700 mb-2">ASCVD</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-gray-500">Score:</span> ${fmt(ascvd.ascvdScore ?? ascvd.score)}</div>
            <div><span class="text-gray-500">Level:</span> ${fmt(ascvd.ascvdLevel ?? ascvd.level)}</div>
            <div class="col-span-2 text-gray-700">${fmt(ascvd.ascvdMessage ?? ascvd.message)}</div>
            <div class="col-span-2 text-xs text-gray-500">Assessment: ${fmt(ascvd.assessmentDate)}</div>
          </div>
        </div>
      `);
    } catch (err) {
      showError(errorEl, err.message || 'Something went wrong');
    }
  });
}

export function readIdentityFromRiskForm() {
  const form = qs('#risk-form');
  if (!form) return { name: undefined, age: undefined, gender: undefined };
  const fd = new FormData(form);
  return {
    name: fd.get('name')?.toString().trim(),
    age: Number(fd.get('age')),
    gender: fd.get('gender')
  };
}


