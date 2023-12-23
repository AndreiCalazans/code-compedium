
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

pub fn lifetimes_example() {
    println!("------ Running the lifetimes example ------");
    let string1 = String::from("abcd");
    let string2 = String::from("xsdjflkjs");
    let result = longest(string1.as_str(), string2.as_str());
    println!("The longest string is {}", result);
}
