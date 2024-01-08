
#[derive(Debug)]
pub struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

#[derive(Debug)]
pub struct Book {
    uuid: u32,
    author: String,
    title: String,
    description: String,
}

pub fn make_user() -> User {
    User {
        email: String::from("user@example.com"),
        username: String::from("user123"),
        active: true,
        sign_in_count: 1,
    }
}

pub fn make_book() -> Book {
    Book {
        uuid: 3242342342,
        author: String::from("Andrei"),
        title: String::from("The Book"),
        description: String::from("The description goes here somwhere"),
    }
}

#[derive(Debug)]
struct Color(i32, i32, i32);

pub fn test_structs() {
    let user = make_user();
    println!("User: {:?}", user);
    let book = make_book();
    println!("Book: {:?}", book);
    let user2 = User {
        email: String::from("user2@email.com"),
        username: String::from("Other"),
        ..user
    };
    println!("User two: {:?}", user2);

    let black = Color(0, 0, 0);
    println!("Tuple as color: {:?}", black);
}
