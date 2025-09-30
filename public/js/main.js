import { initRisk } from './risk.js';
import { initNutrition } from './nutrition.js';

document.addEventListener('DOMContentLoaded', () => {
  initRisk();
  initNutrition();
});

// Add search input handler
const searchInput = document.getElementById('user-search');
const searchResults = document.getElementById('search-results');

let searchTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  const query = e.target.value.trim();
  
  if (query.length < 2) {
    searchResults.innerHTML = '';
    return;
  }

  // Debounce search requests
  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
      const users = await res.json();
      
      if (users.length === 0) {
        searchResults.innerHTML = '<p class="text-gray-500">No users found</p>';
        return;
      }

      searchResults.innerHTML = users.map(user => `
        <div class="border rounded p-4 mb-2">
          <h3 class="font-semibold">${user.name}</h3>
          <div class="text-sm text-gray-600">
            <p>Age: ${user.age}</p>
            <p>Gender: ${user.gender}</p>
            ${user.riskAssessments?.[0] ? `
              <p>Latest Risk Score: ${user.riskAssessments[0].framinghamScore}</p>
            ` : ''}
            ${user.nutritionData?.[0]?.result ? `
              <p>BMI: ${user.nutritionData[0].result.bmi}</p>
            ` : ''}
          </div>
        </div>
      `).join('');
      
    } catch (err) {
      console.error('Search failed:', err);
      searchResults.innerHTML = '<p class="text-red-500">Search failed</p>';
    }
  }, 300); // 300ms debounce
});


