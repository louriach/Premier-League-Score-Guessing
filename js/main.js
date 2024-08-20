document.addEventListener("DOMContentLoaded", function() {
  const email = new URLSearchParams(window.location.search).get('email');

  if (!email) {
    console.error("Error: No email provided in URL");
    alert("Error: No email provided. Please make sure you accessed this page via the correct link in the email.");
    return;
  }

  console.log("Email captured:", email);

  fetch('https://script.google.com/macros/s/AKfycbx64fsoUnHN6bQv5_PmIqd8_BBAbS4mCdo08LTo6Og9fQnF_j5V5DKhFxhDDT8Vs61G/exec?action=getFixtures')
    .then(response => response.json())
    .then(data => {
      console.log("Fixtures data fetched:", data);
      const fixturesContainer = document.getElementById("fixtures-container");

      if (!data || data.length === 0) {
        fixturesContainer.innerHTML = "<p>No fixtures available for this week.</p>";
      } else {
        data.forEach(fixture => {
          const fixtureElement = document.createElement("div");
          fixtureElement.classList.add("fixture");
          fixtureElement.innerHTML = `
            <p>${fixture.HomeTeam} vs ${fixture.AwayTeam} on ${new Date(fixture.Date).toDateString()}</p>
            <input type="number" id="${fixture.ID}_home" placeholder="Home Score" class="score-input">
            <input type="number" id="${fixture.ID}_away" placeholder="Away Score" class="score-input">
          `;
          fixturesContainer.appendChild(fixtureElement);
        });
      }
    })
    .catch(error => {
      console.error("Error fetching fixtures:", error);
      alert("Failed to load fixtures. Please try again later.");
    });

  document.getElementById("save-predictions").addEventListener("click", function() {
    const predictions = {};

    document.querySelectorAll(".fixture").forEach(fixtureElement => {
      const homeScore = fixtureElement.querySelector("input[id*='_home']").value;
      const awayScore = fixtureElement.querySelector("input[id*='_away']").value;
      const fixtureId = fixtureElement.querySelector("input[id*='_home']").id.split('_')[0];

      predictions[`${fixtureId}_home`] = homeScore;
      predictions[`${fixtureId}_away`] = awayScore;
    });

    console.log("Saving predictions for email:", email);
    console.log("Predictions:", predictions);

    fetch('https://script.google.com/macros/s/AKfycbx64fsoUnHN6bQv5_PmIqd8_BBAbS4mCdo08LTo6Og9fQnF_j5V5DKhFxhDDT8Vs61G/exec?action=savePredictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, predictions: predictions }),
    })
    .then(response => response.json())
    .then(result => {
      alert(result.success || result.error);
    })
    .catch(error => {
      console.error("Error saving predictions:", error);
      alert("Failed to save predictions. Please try again later.");
    });
  });
});