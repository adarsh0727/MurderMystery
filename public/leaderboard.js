document.addEventListener('DOMContentLoaded', () => {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardBody = document.getElementById('leaderboard-body');
            leaderboardBody.innerHTML = ''; 

            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.ranking}</td>
                    <td>${entry.team_name}</td>
                    <td>${entry.score}</td>
                    <td>${entry.time}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching leaderboard data:', error));
});
