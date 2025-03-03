<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Score Tracker</title>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            loadScores();
            if (document.querySelectorAll(".round-row").length === 0) {
                addRound();
                addRound();
                addRound();
                addRound();
            }
        });

        function saveScores() {
            let scores = [];
            document.querySelectorAll(".round-row").forEach(row => {
                let round = row.querySelector(".round-name").textContent;
                let scoresArray = Array.from(row.querySelectorAll(".player-score"), input => input.value || 0);
                scores.push({ round, scores: scoresArray });
            });
            let playerNames = Array.from(document.querySelectorAll(".player-name"), input => input.value || "");
            document.cookie = "scores=" + JSON.stringify({ scores, playerNames }) + "; path=/";
        }

        function loadScores() {
            let cookie = document.cookie.split('; ').find(row => row.startsWith("scores="));
            if (!cookie) return;
            let data = JSON.parse(cookie.split('=')[1]);
            if (data.playerNames) {
                document.querySelectorAll(".player-name").forEach((input, i) => input.value = data.playerNames[i] || "");
            }
            data.scores.forEach(({ round, scores }) => addRound(round, scores));
        }

        function addRound(round = `Round ${document.querySelectorAll(".round-row").length + 1}`, scores = []) {
            if (document.querySelectorAll(".round-row").length >= 4) return;
            let row = document.createElement("tr");
            row.classList.add("round-row");
            row.innerHTML = `
                <td class="round-name">${round}</td>
                ${[...Array(8)].map((_, i) => `<td><input type="number" class="player-score" value="${scores[i] || ''}" oninput="saveScores(); updateTotals();" onkeydown="moveColumn(event, this)"></td>`).join("")}
            `;
            document.querySelector("#scoreTable tbody").appendChild(row);
            updateTotals();
        }

        function updateTotals() {
            let totals = new Array(8).fill(0);
            document.querySelectorAll(".round-row").forEach(row => {
                row.querySelectorAll(".player-score").forEach((input, index) => {
                    totals[index] += parseInt(input.value) || 0;
                });
            });
            document.querySelectorAll(".total-score").forEach((cell, index) => {
                cell.textContent = totals[index];
            });
        }

        function moveColumn(event, input) {
            if (event.key === "Enter" || (event.key === "Enter" && event.shiftKey)) {
                event.preventDefault();
                let rows = Array.from(document.querySelectorAll(".round-row"));
                let colIndex = Array.from(input.parentElement.parentElement.children).indexOf(input.parentElement);
                let rowIndex = rows.findIndex(row => row.contains(input));
                let targetRow = event.shiftKey ? rows[rowIndex - 1] : rows[rowIndex + 1];
                if (targetRow) {
                    let targetInput = targetRow.children[colIndex]?.querySelector("input");
                    if (targetInput) targetInput.focus();
                }
            }
        }
    </script>
</head>
<body>
    <h1>Game Score Tracker</h1>
    <table id="scoreTable" border="1">
        <thead>
        </thead>
        <tbody></tbody>
        <tfoot>
            <tr>
                <td>Total</td>
                ${[...Array(8)].map(() => `<td class="total-score">0</td>`).join("")}
            </tr>
        </tfoot>
    </table>
</body>
</html>
