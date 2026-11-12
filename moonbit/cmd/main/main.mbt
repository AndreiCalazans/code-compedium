///|
fn main {
  println("MoonBit playground")
  let doubled = @playground.doubled_evens([1, 2, 3, 4, 5, 6])
  println("Doubled even values: \{@debug.to_string(doubled)}")
  match @playground.largest([-7, -2, -9]) {
    Some(value) => println("Largest value: \{value}")
    None => println("The array is empty")
  }
  match @playground.calculate(Add(20, 22)) {
    Ok(value) => println("20 + 22 = \{value}")
    Err(message) => println(message)
  }
  match @playground.calculate(Divide(42, 0)) {
    Ok(value) => println("42 / 0 = \{value}")
    Err(message) => println("Expected error: \{message}")
  }
}
