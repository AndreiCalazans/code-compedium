use core::num::ParseIntError;
use std::io;
use std::io::Read;

fn divide(numerator: f64, denominator: f64) -> Result<f64, &'static str> {
    if denominator == 0.0 {
        Err("Cannot divide by zero")
    } else {
        Ok(numerator / denominator)
    }
}

pub fn error_handling_example() {
    println!("------ Running the error handling example ------");
    match divide(10.0, 0.0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }

    match get_number(String::from("ad")) {
        Ok(result) => println!("Parsed number: {}", result),
        Err(e) => println!("Parse int error: {}", e),
    }

    match get_number(String::from("3339")) {
        Ok(result) => println!("Parsed number: {}", result),
        Err(e) => println!("Parse int error: {}", e),
    }

    match read_file_content("Cargo.toml") {
        Ok(result) => println!("File content: {}", result),
        Err(e) => println!("Error reading file: {}", e),
    }

    // panic!("This is a catastrophic error!");
}

fn get_number(number: String) -> Result<i32, ParseIntError> {
    number.parse::<i32>()
}

fn read_file_content(file_path: &str) -> Result<String, io::Error> {
    let mut file = std::fs::File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?; // question mark here allows us to not need to handle the
                                         // error here
    Ok(contents)
}
