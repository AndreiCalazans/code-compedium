
pub mod front_of_house {
    // These are like namespaces
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("Adding to waitlist");
        }
    }
}

use front_of_house::hosting;

pub fn mods_example() {
    hosting::add_to_waitlist();
}
