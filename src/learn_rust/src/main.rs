mod basics;
mod funcs;
mod ownership;
mod structs;
mod enums_and_pattern_matching;
mod error_handling;
mod collections;
mod mods;
mod traits;
mod lifetimes;
mod threads;
mod asynchronous;

fn main() {
    basics::the_basic();
    funcs::function_examples();
    ownership::ownership_examples();
    structs::test_structs();
    enums_and_pattern_matching::enums_example();
    error_handling::error_handling_example();
    collections::collections_example();
    mods::mods_example();
    mods::front_of_house::hosting::add_to_waitlist(); // You can access submods like this
    traits::traits_example();
    lifetimes::lifetimes_example();
    threads::threads_example();
    asynchronous::async_example();
}
