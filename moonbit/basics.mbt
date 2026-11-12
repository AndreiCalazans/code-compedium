///|
/// Collect values with an iterator and a closure.
pub fn doubled_evens(values : Array[Int32]) -> Array[Int32] {
  values
  .iter()
  .filter(fn(value) { value % 2 == 0 })
  .map(fn(value) { value * 2 })
  .collect()
}

///|
/// Use Option to handle an empty collection without a special number.
pub fn largest(values : Array[Int32]) -> Int32? {
  let mut best : Int32? = None
  for value in values {
    best = match best {
      None => Some(value)
      Some(previous) => Some(if value > previous { value } else { previous })
    }
  }
  best
}
