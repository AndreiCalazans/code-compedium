
pub fn ownership_examples() {
    println!("------ Running the ownership example ------");
    let s1 = String::from("hello");
    // let s2 = s1; // Ownership of the string is moved to s2

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
    // println!("{}, world!", s1); // This line will cause a compile-time error
    let mut s3 = String::from("ola ");
    append_world(&mut s3);
    println!("Mutated string: {}", s3);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}

fn append_world(s: &mut String) {
    s.push_str(" world");
}
