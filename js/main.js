document.addEventListener('DOMContentLoaded', function() {
    fetch('https://script.google.com/macros/s/AKfycbzSFYyY6MD10vxK_jtYSNKwDAgBWYjGOoha8gpwZZBdAE48yGja4s0T87Ad39z6ULBL/exec')
      .then(response => response.json())
      .then(data => {
        var leaderboardBody = document.getElementById('leaderboardBody');
        data.forEach(player => {
          var row = document.createElement('tr');
          row.innerHTML = `<td class="border px-4 py-2">${player.email}</td><td class="border px-4 py-2">${player.score}</td>`;
          leaderboardBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching leaderboard:', error));
  });
  