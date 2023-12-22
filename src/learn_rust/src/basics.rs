pub fn the_basic() {
    // Hello World
    println!("------ Running the basics example ------");

    let x = 5; // immutable
    let x = x + 1; // Shadowing the previous value of x
    println!("The value of x is: {}", x);

    let mut y = 5; // mutable
    println!("The value of y is: {}", y);
    y = 12;
    let result = sum(y, 10);
    println!("The value of y is: {}", y);
    println!("The value of result is: {}", result);

    let int_num: i32 = 100;
    let float_num: f64 = 10.5;
    let is_true: bool = true;
    let char_val: char = 'A';

    println!(
        "Integer: {}, Float: {}, Boolean: {}, Char: {}",
        int_num, float_num, is_true, char_val
    );

    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (a, b, c) = tup; // Destructuring

    let arr = [1, 2, 3, 4, 5]; // Array

    println!(
        "Tuple: ({}, {}, {}), Array first element: {}",
        a, b, c, arr[0]
    );

    let mut someString = String::from("Hello"); // Creating a String
    someString.push_str(", world!"); // Appending to a String
    println!("{}", someString);

    let mut untrimmed_strings = String::from("   Rust is fun!   ");
    println!("UnTrimmed String: '{}'", untrimmed_strings);
    untrimmed_strings = untrimmed_strings.trim().to_string(); // Trimming whitespace
    println!("Trimmed String: '{}'", untrimmed_strings);
    // slices are &str is an immutable sequence of UTF-8 characters.
    let slice = &untrimmed_strings[0..5]; // Taking a slice of the String
    println!("Slice: {}", slice);
}

fn sum(a: i32, b: i32) -> i32 {
    a + b // no semicolon implies this is the return value
}

