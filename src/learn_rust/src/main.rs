mod basics;
mod funcs;
mod ownership;
mod structs;
mod enums_and_pattern_matching;
mod error_handling;

fn main() {
    println!("Hello Andrei!");
    basics::the_basic();
    funcs::function_examples();
    ownership::ownership_examples();
    structs::test_structs();
    enums_and_pattern_matching::enums_example();
    error_handling::error_handling_example();
}
