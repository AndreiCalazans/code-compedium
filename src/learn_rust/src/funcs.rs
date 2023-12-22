pub fn function_examples() {
    println!("------ Running the functions example ------");
    greet();
    add_two_numbers(5, 10);
    println!("multiply {}", multiply(2, 10));
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

