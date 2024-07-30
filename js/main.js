document.addEventListener('DOMContentLoaded', function() {
    // Extract email from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (!email) {
      document.getElementById('userInfo').innerHTML = '<p class="text-red-500">Error: No email provided.</p>';
      return;
    }
    
    // Display user info
    document.getElementById('userInfo').innerHTML = `<p class="text-lg">Welcome, ${email}! Please enter your predictions below:</p>`;
  
    // Fetch fixtures and render form
    fetchFixtures(email);
  });
  
  // Fetch fixtures from Google Apps Script web app
  function fetchFixtures(email) {
    fetch('https://script.google.com/macros/s/AKfycbzSFYyY6MD10vxK_jtYSNKwDAgBWYjGOoha8gpwZZBdAE48yGja4s0T87Ad39z6ULBL/exec?action=getFixtures') // Replace with your actual web app URL and endpoint
      .then(response => response.json())
      .then(data => {
        const fixturesContainer = document.getElementById('fixturesContainer');
        fixturesContainer.innerHTML = '';
  
        // Create input fields for each fixture
        data.forEach(fixture => {
          const fixtureElement = document.createElement('div');
          fixtureElement.className = 'mb-4';
          fixtureElement.innerHTML = `
            <label class="block mb-2">${fixture.HomeTeam} vs ${fixture.AwayTeam}</label>
            <input type="text" name="${fixture.id}_home" placeholder="${fixture.HomeTeam} score" class="border border-gray-300 p-2 rounded mr-2" required>
            <input type="text" name="${fixture.id}_away" placeholder="${fixture.AwayTeam} score" class="border border-gray-300 p-2 rounded" required>
          `;
          fixturesContainer.appendChild(fixtureElement);
        });
  
        // Handle form submission
        const form = document.getElementById('predictionForm');
        form.addEventListener('submit', function(event) {
          event.preventDefault();
          savePredictions(email, new FormData(form));
        });
      })
      .catch(error => console.error('Error fetching fixtures:', error));
  }
  
  // Save predictions to Google Apps Script web app
  function savePredictions(email, formData) {
    const predictions = {};
    formData.forEach((value, key) => {
      predictions[key] = value;
    });
  
    fetch('https://script.google.com/macros/s/AKfycbzSFYyY6MD10vxK_jtYSNKwDAgBWYjGOoha8gpwZZBdAE48yGja4s0T87Ad39z6ULBL/exec?action=savePredictions', { // Replace with your actual web app URL and endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, predictions }),
    })
    .then(response => response.json())
    .then(result => {
      alert('Your predictions have been saved!');
      window.location.href = 'leaderboard.html'; // Redirect to the leaderboard or another page
    })
    .catch(error => console.error('Error saving predictions:', error));
  }
  