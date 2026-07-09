const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");

const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");

const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

// Add Event
transactionFormEl.addEventListener("submit", addTransaction);

// Add Transaction
function addTransaction(e) {

    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    if (description === "" || isNaN(amount)) {
        return;
    }

    const transaction = {

        id: Date.now(),

        description,

        amount

    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateTransactionList();

    updateSummary();

    transactionFormEl.reset();

}

// Update Transaction List
function updateTransactionList() {

    transactionListEl.innerHTML = "";

    const reversed = [...transactions].reverse();

    reversed.forEach(transaction => {

        const li = createTransactionElement(transaction);

        transactionListEl.appendChild(li);

    });

}

// Create List Item
function createTransactionElement(transaction) {

    const li = document.createElement("li");

    li.classList.add("transaction");

    li.classList.add(

        transaction.amount > 0 ?

            "income"

            :

            "expense"

    );

    li.innerHTML = `

        <span>${transaction.description}</span>

        <span>

            ${formatCurrency(transaction.amount)}

            <button class="delete-btn"

            onclick="removeTransaction(${transaction.id})">

            ✖

            </button>

        </span>

    `;

    return li;

}

// Update Summary
function updateSummary() {

    const balance = transactions.reduce(

        (acc, item) => acc + item.amount,

        0

    );

    const income = transactions

        .filter(item => item.amount > 0)

        .reduce((acc, item) => acc + item.amount, 0);

    const expense = transactions

        .filter(item => item.amount < 0)

        .reduce((acc, item) => acc + item.amount, 0);

    balanceEl.textContent = formatCurrency(balance);

    incomeAmountEl.textContent = formatCurrency(income);

    expenseAmountEl.textContent = formatCurrency(Math.abs(expense));

}

// Remove Transaction
function removeTransaction(id) {

    transactions = transactions.filter(

        item => item.id !== id

    );

    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );

    updateTransactionList();

    updateSummary();

}

// Currency Format
function formatCurrency(number) {

    return new Intl.NumberFormat(

        "en-US",

        {

            style: "currency",

            currency: "USD"

        }

    ).format(number);

}

// Initial Load
updateTransactionList();

updateSummary();