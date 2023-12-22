use std::collections::HashMap;

pub fn collections_example() {
    println!("------ Running the error collections example ------");
    let mut numbers: Vec<i32> = Vec::new();
    numbers.push(1);
    numbers.push(2);
    numbers.push(3);

    for number in numbers.iter() {
        println!("{}", number);
    }

    // Strings are UTF8 encoded text collections.
    let mut greeting = String::from("Hello, ");
    greeting.push_str("world!");

    println!("{}", greeting);


    let mut book_reviews = HashMap::new();
    book_reviews.insert("Adventures of Rust", "Great read");
    book_reviews.insert("Rust in Action", "Highly recommended");

    // The reason we need to use the & here is because the HashMap takes ownership of the key
    for (book, review) in &book_reviews {
        println!("{}: {}", book, review);
    }
}

