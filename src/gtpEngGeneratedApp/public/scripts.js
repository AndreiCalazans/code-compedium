// Utility functions to handle local storage
function getLocalStorageItem(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
}

function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Application state
const state = {
    totalBooks: getLocalStorageItem('totalBooks', 0),
    booksSold: getLocalStorageItem('booksSold', 0),
    booksTakenOut: getLocalStorageItem('booksTakenOut', 0),
    transactions: getLocalStorageItem('transactions', [])
};

// Update UI with the current state
function updateUI() {
    document.getElementById('total-books').textContent = state.totalBooks;
    document.getElementById('books-sold').textContent = state.booksSold;
    document.getElementById('books-taken-out').textContent = state.booksTakenOut;

    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';
    state.transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `${transaction.type}: ${transaction.amount}`;
        transactionList.appendChild(li);
    });
}

// Event handlers
function addBook() {
    state.totalBooks += 1;
    state.transactions.push({ type: 'Add', amount: 1 });
    setLocalStorageItem('totalBooks', state.totalBooks);
    setLocalStorageItem('transactions', state.transactions);
    updateUI();
}

function sellBook() {
    if (state.totalBooks <= 0) return;
    state.totalBooks -= 1;
    state.booksSold += 1;
    state.transactions.push({ type: 'Sell', amount: 1 });
    setLocalStorageItem('totalBooks', state.totalBooks);
    setLocalStorageItem('booksSold', state.booksSold);
    setLocalStorageItem('transactions', state.transactions);
    updateUI();
}

function takeOutBook() {
    if (state.totalBooks <= 0) return;
    state.totalBooks -= 1;
    state.booksTakenOut += 1;
    state.transactions.push({ type: 'Take Out', amount: 1 });
    setLocalStorageItem('totalBooks', state.totalBooks);
    setLocalStorageItem('booksTakenOut', state.booksTakenOut);
    setLocalStorageItem('transactions', state.transactions);
    updateUI();
}

// Attach event listeners to buttons
document.getElementById('add-book').addEventListener('click', addBook);
document.getElementById('sell-book').addEventListener('click', sellBook);
document.getElementById('takeout-book').addEventListener('click', takeOutBook);

// Initialize UI on load
updateUI();