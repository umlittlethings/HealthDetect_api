(() => {
  const form = document.getElementById('risk-form');
  const resultsEl = document.getElementById('results');
  const errorEl = document.getElementById('error');
  const nutritionForm = document.getElementById('nutrition-form');
  const nutritionResults = document.getElementById('nutrition-results');
  const nutritionError = document.getElementById('nutrition-error');

  function setLoading(isLoading) {
    if (isLoading) {
      resultsEl.innerHTML = `
        <div class="animate-pulse space-y-3">
          <div class="h-4 bg-teal-100 rounded"></div>
          <div class="h-4 bg-teal-100 rounded w-2/3"></div>
          <div class="h-4 bg-teal-100 rounded w-1/2"></div>
        </div>
      `;
    }
  }

  // Basic client-side validation
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

  function fmt(val) { return val ?? '-'; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
    setLoading(true);

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

      resultsEl.innerHTML = `
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
      `;
    } catch (err) {
      errorEl.textContent = err.message || 'Something went wrong';
      errorEl.classList.remove('hidden');
    }
  });

  // Nutrition handlers
  function nutritionLoading() {
    nutritionResults.innerHTML = `
      <div class="animate-pulse space-y-3 md:col-span-3">
        <div class="h-4 bg-teal-100 rounded"></div>
        <div class="h-4 bg-teal-100 rounded w-2/3"></div>
        <div class="h-4 bg-teal-100 rounded w-1/2"></div>
      </div>
    `;
  }

  function readBasicIdentity() {
    const fd = new FormData(form);
    return {
      name: fd.get('name')?.toString().trim(),
      age: Number(fd.get('age')),
      gender: fd.get('gender')
    };
  }

  if (nutritionForm) {
    nutritionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      nutritionError.classList.add('hidden');
      nutritionError.textContent = '';
      nutritionLoading();

      const base = readBasicIdentity();
      const nfd = new FormData(nutritionForm);
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

        nutritionResults.innerHTML = `
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
        `;
      } catch (err) {
        nutritionError.textContent = err.message || 'Something went wrong';
        nutritionError.classList.remove('hidden');
      }
    });
  }
})();


