
trait SpecialPrint {
    fn print_details(&self);
}

struct Person {
    name: String,
    age: u32,
}

impl SpecialPrint for Person {
    fn print_details(&self) {
        println!("Name: {}, Age: {}", self.name, self.age);
    }
}

fn debug_log<T: SpecialPrint>(item: T) {
    println!("Debug log:");
    item.print_details();
}

pub fn traits_example() {
    println!("------ Running the traits example ------");
    let person = Person {
        name: String::from("Andrei"),
        age: 30,
    };
    person.print_details();
    debug_log(person);
}
