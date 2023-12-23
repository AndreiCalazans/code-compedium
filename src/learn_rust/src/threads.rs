use std::{thread, time::Duration, sync::{Arc, Mutex}};

fn do_work(thread_id: &str) {
    for i in 1..10 {
        println!("hi number {} from {}!", i, thread_id);
        thread::sleep(Duration::from_millis(1));
    }
}

pub fn threads_example() {
    println!("------ Running the threads example ------");
    let handle = thread::spawn(|| {
        do_work("FIRST THREAD");
    });

    let handle_two = thread::spawn(|| {
        do_work("SECOND THREAD");
    });

    do_work("MAIN THREAD");

    handle.join().unwrap();
    handle_two.join().unwrap();

    println!("------ Running the threads with state example ------");
    sharing_state_with_mutex();
}

pub fn sharing_state_with_mutex() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
