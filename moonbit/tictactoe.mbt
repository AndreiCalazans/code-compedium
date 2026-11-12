///|
/// A round owns its board. Marks: 0 = empty, 1 = X, 2 = O.
/// Outcomes: 0 = playing, 1 = X wins, 2 = O wins, 3 = draw.
pub struct Game {
  priv board : Array[Int32]
  priv mut turn : Int32
  priv mut result : Int32
}

///|
pub fn new_game() -> Game {
  { board: Array::make(9, 0), turn: 1, result: 0, }
}

///|
pub fn Game::reset(self : Game) -> Unit {
  for index in 0..<9 {
    self.board[index] = 0
  }
  self.turn = 1
  self.result = 0
}

///|
pub fn Game::cell(self : Game, index : Int32) -> Int32 {
  if index < 0 || index >= 9 {
    return 0
  }
  self.board[index]
}

///|
pub fn Game::current_player(self : Game) -> Int32 {
  self.turn
}

///|
pub fn Game::outcome(self : Game) -> Int32 {
  self.result
}

///|
fn winning_lines() -> Array[Array[Int32]] {
  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
}

///|
pub fn Game::is_winning_cell(self : Game, index : Int32) -> Bool {
  if self.result != 1 && self.result != 2 {
    return false
  }
  for line in winning_lines() {
    if line.contains(index) &&
      line.iter().all(fn(i) { self.board[i] == self.result }) {
      return true
    }
  }
  false
}

///|
/// Invalid moves leave the whole state unchanged.
pub fn Game::play(self : Game, index : Int32) -> Bool {
  if index < 0 || index >= 9 || self.result != 0 {
    return false
  }
  if self.board[index] != 0 {
    return false
  }
  self.board[index] = self.turn
  for line in winning_lines() {
    if line.iter().all(fn(i) { self.board[i] == self.turn }) {
      self.result = self.turn
      return true
    }
  }
  if self.board.iter().all(fn(mark) { mark != 0 }) {
    self.result = 3
  } else {
    self.turn = if self.turn == 1 { 2 } else { 1 }
  }
  true
}
