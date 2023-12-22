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


