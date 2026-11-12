///|
let game : @game.Game = @game.new_game()

///|
#export_name("play")
pub fn play(index : Int32) -> Bool {
  game.play(index)
}

///|
#export_name("reset")
pub fn reset() -> Unit {
  game.reset()
}

///|
#export_name("cell")
pub fn cell(index : Int32) -> Int32 {
  game.cell(index)
}

///|
#export_name("currentPlayer")
pub fn current_player() -> Int32 {
  game.current_player()
}

///|
#export_name("outcome")
pub fn outcome() -> Int32 {
  game.outcome()
}

///|
#export_name("isWinningCell")
pub fn is_winning_cell(index : Int32) -> Bool {
  game.is_winning_cell(index)
}
