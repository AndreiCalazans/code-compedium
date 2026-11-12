///|
test "filter and map values" {
  assert_eq(@moonbit.doubled_evens([1, 2, 3, 4, 5, 6]), [4, 8, 12])
}

///|
test "filter empty and odd-only arrays" {
  assert_eq(@moonbit.doubled_evens([]), [])
  assert_eq(@moonbit.doubled_evens([1, 3, 5]), [])
}

///|
test "filter negative and zero values" {
  assert_eq(@moonbit.doubled_evens([-4, -3, -2, 0]), [-8, -4, 0])
}

///|
test "find the largest value" {
  assert_eq(@moonbit.largest([3, 9, 2]), Some(9))
  assert_eq(@moonbit.largest([-7, -2, -9]), Some(-2))
  assert_eq(@moonbit.largest([5]), Some(5))
}

///|
test "an empty array has no largest value" {
  assert_eq(@moonbit.largest([]), None)
}

///|
test "calculate with enum cases" {
  assert_eq(@moonbit.calculate(Add(20, 22)), Ok(42))
  assert_eq(@moonbit.calculate(Multiply(6, 7)), Ok(42))
  assert_eq(@moonbit.calculate(Divide(84, 2)), Ok(42))
}

///|
test "division uses integer arithmetic" {
  assert_eq(@moonbit.calculate(Divide(7, 2)), Ok(3))
  assert_eq(@moonbit.calculate(Divide(-7, 2)), Ok(-3))
}

///|
test "division by zero is an error" {
  assert_eq(@moonbit.calculate(Divide(42, 0)), Err("Cannot divide by zero"))
}
