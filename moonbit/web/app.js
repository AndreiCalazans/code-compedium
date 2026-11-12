const cells = [...document.querySelectorAll(".cell")];
const board = document.querySelector("#board");
const status = document.querySelector("#status");
const detail = document.querySelector("#status-detail");
const symbol = document.querySelector("#status-symbol");
const tag = document.querySelector("#turn-tag");
const nextRound = document.querySelector("#next-round");
const restart = document.querySelector("#restart");
const resetScores = document.querySelector("#reset-scores");
const scores = { 1: 0, 2: 0, 3: 0 };
let round = 1;

const marks = {
  1: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m14 14 36 36m0-36L14 50" fill="none" stroke="#d55a39" stroke-width="8" stroke-linecap="round" /></svg>',
  2: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="21" fill="none" stroke="#307a70" stroke-width="7" /></svg>',
};

try {
  const game = await import("./generated/game.mjs");

  function render() {
    const result = game.outcome();
    const player = game.currentPlayer();
    const mark = player === 1 ? "X" : "O";
    for (const [index, cell] of cells.entries()) {
      const value = game.cell(index);
      // Only replace changed marks so existing marks do not animate again.
      if (cell.dataset.mark !== String(value)) {
        cell.innerHTML = marks[value] ?? "";
        cell.dataset.mark = String(value);
      }
      cell.classList.toggle("winner", game.isWinningCell(index));
      cell.classList.toggle("preview-x", player === 1);
      cell.classList.toggle("preview-o", player === 2);
      cell.disabled = result !== 0 || value !== 0;
      const label = value === 0 ? "empty" : value === 1 ? "X" : "O";
      cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}, ${label}`);
    }

    status.textContent = result === 3 ? "An even match." : result ? `Player ${result === 1 ? "X" : "O"} wins!` : `Player ${mark}, your move.`;
    detail.textContent = result === 3 ? "Great minds think alike. One more?" : result ? "Three in a row. Nicely played." : "Find your spot. Make it count.";
    symbol.textContent = result === 3 ? "=" : player === 1 ? "×" : "○";
    symbol.className = `status-symbol ${result === 3 ? "" : player === 1 ? "mark-x" : "mark-o"}`;
    tag.textContent = result ? "ROUND COMPLETE" : "YOUR TURN";
    board.setAttribute("aria-label", result ? "Game board. Round complete." : `Game board. Player ${mark} to move.`);
    board.setAttribute("aria-busy", "false");
    document.querySelector("#round-label").textContent = `ROUND ${String(round).padStart(2, "0")}`;
    document.querySelector("#x-score").textContent = scores[1];
    document.querySelector("#o-score").textContent = scores[2];
    document.querySelector("#draw-score").textContent = scores[3];
    document.querySelector("#x-card").classList.toggle("active", result === 1 || (!result && player === 1));
    document.querySelector("#o-card").classList.toggle("active", result === 2 || (!result && player === 2));
    nextRound.innerHTML = `${result ? "Play another round" : "Start a fresh round"} <span aria-hidden="true">↗</span>`;
    nextRound.disabled = false;
    restart.disabled = false;
    resetScores.disabled = false;
  }

  function focusEmpty(start = 0, step = 1) {
    for (let offset = 0; offset < 9; offset++) {
      const index = ((start + offset * step) % 9 + 9) % 9;
      if (!cells[index].disabled) {
        cells[index].focus();
        return;
      }
    }
  }

  for (const [index, cell] of cells.entries()) {
    cell.addEventListener("click", (event) => {
      if (!game.play(index)) return;
      const result = game.outcome();
      if (result) scores[result] += 1;
      render();
      if (result) nextRound.focus();
      else if (event.detail === 0) focusEmpty(index + 1);
    });
    cell.addEventListener("keydown", (event) => {
      const steps = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 };
      if (event.key in steps) {
        event.preventDefault();
        focusEmpty(index + steps[event.key], steps[event.key]);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        focusEmpty(event.key === "Home" ? 0 : 8, event.key === "Home" ? 1 : -1);
      }
    });
  }

  function startRound(advance) {
    if (advance) round += 1;
    game.reset();
    render();
    focusEmpty();
  }
  nextRound.addEventListener("click", () => startRound(true));
  restart.addEventListener("click", () => startRound(game.outcome() !== 0));
  resetScores.addEventListener("click", () => {
    scores[1] = scores[2] = scores[3] = 0;
    round = 1;
    startRound(false);
  });
  render();
} catch (error) {
  console.error("Cannot load the MoonBit game:", error);
  status.textContent = "The game could not load.";
  detail.textContent = "Run npm run build, then open this page through the local server.";
  board.setAttribute("aria-busy", "false");
}
