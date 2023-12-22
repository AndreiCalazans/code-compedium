
pub enum WebEvent {
    PageLoad,
    PageUnload,
    KeyPress(char),
    Paste(String),
    Click { x: i64, y: i64 },
}

pub fn enums_example() {
    println!("------ Running the enums & pattern matching example ------");
    let pressed = WebEvent::KeyPress('x');

    match pressed {
        WebEvent::PageLoad => println!("page loaded"),
        WebEvent::KeyPress(c) => println!("pressed '{}'", c),
        _ => (), // handling all other cases
    }

    classify(WebEvent::PageLoad);


    // if let is a shorthand for handling only one pattern and ignoring the rest.
    if let WebEvent::KeyPress(c) = pressed {
        println!("also pressed '{}'", c);
    }

    // this is specially useful for Some and Error values I guess:
    let some_number = Some(5);
    if let Some(any_number) = some_number {
        println!("Some number: {}", any_number);
    }
}

pub fn classify(event: WebEvent) {
    match event {
        WebEvent::PageLoad => println!("page loaded"),
        WebEvent::PageUnload => println!("page unloaded"),
        _ => (), // handling all other cases
    }
}
