pub fn function_examples() {
    println!("------ Running the functions example ------");
    greet();
    add_two_numbers(5, 10);
    println!("multiply {}", multiply(2, 10));

    let result = apply_function(square, 5);
    println!("Result is: {}", result);
}

fn greet() {
    println!("Hello, Rustacean!");
}

fn add_two_numbers(x: i32, y: i32) {
    let sum = x + y;
    println!("Sum is: {}", sum);
}

fn multiply(x: i32, y: i32) -> i32 {
    x * y // no semicolon means this is the return value
}

// Higher order functions in Rust.
fn apply_function<F>(f: F, x: i32) -> i32
where
    F: Fn(i32) -> i32,
{
    f(x)
}

fn square(x: i32) -> i32 {
    x * x
}

#[cfg(test)]
mod tests {
    // This makes everthing available in the parent scope
    // available in this mod tests scope!!
    use super::*;

    #[test]
    fn it_multiplier() {
        assert_eq!(multiply(2, 3), 6);
    }

    #[test]
    fn it_squares() {
        assert_eq!(square(3), 9);
    }

    #[test]
    fn it_applies_fn() {
        assert_eq!(apply_function(square, 3), 9);
    }
}

