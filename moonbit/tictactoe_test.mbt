///|
test "a new round starts with X and an empty board" {
  let game = @moonbit.new_game()
  assert_eq(game.current_player(), 1)
  assert_eq(game.outcome(), 0)
  for index in 0..<9 {
    assert_eq(game.cell(index), 0)
    assert_false(game.is_winning_cell(index))
  }
}

///|
test "moves alternate and occupied cells reject moves" {
  let game = @moonbit.new_game()
  assert_true(game.play(4))
  assert_eq(game.cell(4), 1)
  assert_eq(game.current_player(), 2)
  assert_false(game.play(4))
  assert_eq(game.current_player(), 2)
  assert_true(game.play(0))
  assert_eq(game.cell(0), 2)
  assert_eq(game.current_player(), 1)
}

///|
test "out of range moves do not change the game" {
  let game = @moonbit.new_game()
  assert_false(game.play(-1))
  assert_false(game.play(9))
  assert_eq(game.cell(-1), 0)
  assert_eq(game.cell(9), 0)
  assert_false(game.is_winning_cell(-1))
  assert_eq(game.current_player(), 1)
  assert_eq(game.outcome(), 0)
}

///|
test "all eight winning lines are recognized" {
  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for line in lines {
    let game = @moonbit.new_game()
    let other = [0, 1, 2, 3, 4, 5, 6, 7, 8]
      .iter()
      .filter(fn(i) { !line.contains(i) })
      .collect()
    assert_true(game.play(line[0]))
    assert_true(game.play(other[0]))
    assert_true(game.play(line[1]))
    assert_true(game.play(other[1]))
    assert_true(game.play(line[2]))
    assert_eq(game.outcome(), 1)
    for index in 0..<9 {
      assert_eq(game.is_winning_cell(index), line.contains(index))
    }
    assert_false(game.play(other[2]))
    assert_eq(game.cell(other[2]), 0)
  }
}

///|
test "O can win too" {
  let game = @moonbit.new_game()
  for index in [0, 3, 1, 4, 8, 5] {
    assert_true(game.play(index))
  }
  assert_eq(game.outcome(), 2)
  assert_true(game.is_winning_cell(3))
  assert_true(game.is_winning_cell(4))
  assert_true(game.is_winning_cell(5))
  assert_false(game.play(2))
}

///|
test "a full board without a winner is a draw" {
  let game = @moonbit.new_game()
  for index in [0, 1, 2, 4, 3, 5, 7, 6, 8] {
    assert_true(game.play(index))
  }
  assert_eq(game.outcome(), 3)
  assert_false(game.play(0))
  for index in 0..<9 {
    assert_false(game.is_winning_cell(index))
  }
}

///|
test "a win on the final move is not a draw" {
  let game = @moonbit.new_game()
  for index in [0, 1, 4, 2, 3, 5, 7, 6, 8] {
    assert_true(game.play(index))
  }
  assert_eq(game.outcome(), 1)
}

///|
test "reset clears a finished round" {
  let game = @moonbit.new_game()
  for index in [0, 3, 1, 4, 2] {
    assert_true(game.play(index))
  }
  game.reset()
  assert_eq(game.outcome(), 0)
  assert_eq(game.current_player(), 1)
  for index in 0..<9 {
    assert_eq(game.cell(index), 0)
    assert_false(game.is_winning_cell(index))
  }
  assert_true(game.play(4))
}

///|
test "rounds have separate boards" {
  let first = @moonbit.new_game()
  let second = @moonbit.new_game()
  assert_true(first.play(0))
  assert_eq(second.cell(0), 0)
}
