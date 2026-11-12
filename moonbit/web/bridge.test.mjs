import { test } from "node:test";
import assert from "node:assert/strict";
import * as game from "./generated/game.mjs";

// Test the actual compiled module used by the browser, not a JS replacement.
test("the browser module exports the game API", () => {
  for (const name of ["play", "reset", "cell", "currentPlayer", "outcome", "isWinningCell"]) {
    assert.equal(typeof game[name], "function", name);
  }
});

test("all 5,478 reachable boards match an independent rules model", () => {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const visited = new Set();
  function visit(moves, board, player) {
    const key = board.join("");
    if (visited.has(key)) return;
    visited.add(key);
    game.reset();
    for (const index of moves) assert.equal(game.play(index), true);
    const wins = lines.filter(([a, b, c]) => board[a] !== 0 && board[a] === board[b] && board[b] === board[c]);
    const result = wins.length ? board[wins[0][0]] : board.every(Boolean) ? 3 : 0;
    assert.equal(game.outcome(), result, key);
    for (let i = 0; i < 9; i++) {
      assert.equal(game.cell(i), board[i], key);
      assert.equal(game.isWinningCell(i), wins.some((line) => line.includes(i)), key);
      if (board[i] || result) assert.equal(game.play(i), false, key);
    }
    assert.equal(game.play(-1), false);
    assert.equal(game.play(9), false);
    if (result) return;
    assert.equal(game.currentPlayer(), player, key);
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const next = [...board];
        next[i] = player;
        visit([...moves, i], next, player === 1 ? 2 : 1);
      }
    }
  }
  visit([], Array(9).fill(0), 1);
  assert.equal(visited.size, 5478);
  game.reset();
});
