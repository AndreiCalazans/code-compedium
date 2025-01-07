// Bad approach - predefined error
const VALIDATION_ERROR = new Error("Invalid input");

function validateInput(input) {
  if (typeof input !== "string") {
    // When thrown, stack trace will point to line 2 where error was created
    // instead of here where the error actually occurred
    throw VALIDATION_ERROR;
  }
  return input.trim();
}

// Better approach - create error when throwing
function validateInputBetter(input) {
  if (typeof input !== "string") {
    // Stack trace will correctly point to this line
    throw new Error("Invalid input");
  }
  return input.trim();
}

// Example usage showing the difference
try {
  validateInput(123); // Will throw with confusing stack trace
} catch (error) {
  console.log("Bad approach stack trace:");
  console.log(error.stack);
}

try {
  validateInputBetter(123); // Will throw with accurate stack trace
} catch (error) {
  console.log("\nBetter approach stack trace:");
  console.log(error.stack);
}
