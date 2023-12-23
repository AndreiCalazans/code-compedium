use tokio;
use reqwest; // Import reqwest for making HTTP requests

async fn perform_task() {
    println!("Performing a task...");
    // Perform task
}

#[tokio::main]
pub async fn async_example() {
    println!("------ Running the async example ------");
    perform_task().await;
    fetch_google().await.unwrap();
}

async fn fetch_google() -> Result<(), Box<dyn std::error::Error>> {
    let url = "https://google.com";
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    println!("Response body:\n{}", body);
    Ok(())
}
