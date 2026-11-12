///|
/// An enum can hold data as well as identify a case.
#derive(Eq, Debug)
pub(all) enum Operation {
  Add(Int32, Int32)
  Multiply(Int32, Int32)
  Divide(Int32, Int32)
}

///|
pub extend Operation with Eq::{not_equal, equal}

///|
pub extend Operation with Debug::{to_repr}

///|
/// Match every case. Return an explicit error for division by zero.
/// Integer arithmetic uses Int32, not arbitrary-precision integers.
pub fn calculate(operation : Operation) -> Result[Int32, String] {
  match operation {
    Add(left, right) => Ok(left + right)
    Multiply(left, right) => Ok(left * right)
    Divide(_, 0) => Err("Cannot divide by zero")
    Divide(left, right) => Ok(left / right)
  }
}
