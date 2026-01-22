import './style.css';
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app').innerHTML = `
    <body class="bg-gray-100 h-screen overflow-hidden">
      <div class="grid grid-cols-1 h-full">
        <header class="flex justify-between items-center p-4 bg-white shadow-md">
          <div class="flex space-x-2 sm:space-x-4">
            <span class="text-3xl font-bold text-blue-600">cashflow</span>
            <span class="text-gray-700 hover:text-blue-500 cursor-pointer">Help Center</span>
            <span class="text-gray-700 hover:text-blue-500 cursor-pointer">Business</span>
          </div>
          <div>
            <span id="login-button" class="rounded p-2 cursor-pointer hover:underline bg-blue-700 text-white">Login</span>
          </div>
        </header>
        <section class="p-2 h-full overflow-y-auto">
          <article class="mb-2 grid grid-cols-1 md:grid-cols-[1fr_300px] bg-white p-6 rounded-lg shadow-lg gap-6">
            <section id="home_display" class="grid">
              <div class="flex justify-between items-center mb-4">
                <h1 class="text-lg font-semibold mb-2">My Cash Low</h1>
                <div class="flex gap-3 justify-end mb-4">
                  <p class="text-gray-700 text-xs mt-2 font-bold mb-4">A simple tool to track your income and expenses</p>
                  <button id="payment-button" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add Payment</button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div class="border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" data-category="Income">
                  <p class="font-medium text-sm">Your Income</p>
                  <p class="text-2xl font-bold">$0 <span class="bg-green-600 text-[10px] p-1 rounded-full text-white">+0.0</span></p>
                  <p class="text-gray-500 text-[10px] font-bold">Your income amount</p>
                </div>
                <div class="border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" data-category="Food">
                  <p class="font-medium text-sm">Food</p>
                  <p class="text-2xl font-bold">$0 <span class="bg-red-600 text-[10px] p-1 rounded-full text-white">-0.0</span></p>
                  <p class="text-gray-500 text-[10px] font-bold">Your Food amount</p>
                </div>
                <div class="border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" data-category="Rent">
                  <p class="font-medium text-sm">Rent</p>
                  <p class="text-2xl font-bold">$0 <span class="bg-red-600 text-[10px] p-1 rounded-full text-white">-0.0</span></p>
                  <p class="text-gray-500 text-[10px] font-bold">Your income rent amount</p>
                </div>
                <div class="border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" data-category="Entertainment">
                  <p class="font-medium text-sm">Entertainment</p>
                  <p class="text-2xl font-bold">$0 <span class="bg-red-600 text-[10px] p-1 rounded-full text-white">-0.0</span></p>
                  <p class="text-gray-500 text-[10px] font-bold">Your Entertainment amount</p>
                </div>
                <div class="border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" data-category="Savings">
                  <p class="font-medium text-sm">Savings</p>
                  <p class="text-2xl font-bold">$0 <span class="bg-green-600 text-[10px] p-1 rounded-full text-white">+0.0</span></p>
                  <p class="text-gray-500 text-[10px] font-bold">Your Savings amount</p>
                </div>
                <div class="border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" data-category="Monthly spent">
                  <p class="font-medium text-sm">Monthly Spent</p>
                  <p class="text-2xl font-bold">$0 <span class="bg-red-600 text-[10px] p-1 rounded-full text-white">-0.0</span></p>
                  <p class="text-[10px] font-bold text-gray-500">Your Monthly spent amount</p>
                </div>
              </div>
            </section>
            <section id="card_display">
              <div class="mt-4 border-2 text-white p-4 rounded-lg h-[200px]" style="background: linear-gradient(to right, #1E3A8A, #60A5FA);">
                <div class="flex justify-between items-center">
                  <span id="card-account-number">**** **** 4223</span>
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-nfc"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8"/><path d="M16.37 2a20.16 20.16 0 0 1 0 20"/></svg></span>
                </div>
                <div class="mt-8 text-3xl font-bold" id="total-amount">$0</div>
                <p class="text-gray-300 text-[10px] font-bold mt-10">Cash Owner</p>
                <div class="flex justify-between items-center">
                  <span id="card-user-name" class="font-medium">Sunitha Reddy</span>
                  <span class="bg-green-500 text-black p-1 rounded-full text-[10px] font-bold">+23</span>
                </div>
              </div>
            </section>
          </article>
          <article class="bg-white p-3 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-3">
            <section class="shadow p-2" id="chart_display">
              <section class="h-[250px] sm:h-[200px] xs:h-[150px]" id="donutchart"></section>
            </section>

            <section class="shadow p-2  id="transactions">
              <div>
                <h1 class="text-xl font-semibold mb-2">All Transactions</h1>
                <div class="mb-4 flex justify-between">
                  <span class="text-gray-600">All your transactions recorded</span>
                  <div class="flex gap-5">
                    <span class="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
                    <span class="text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg></span>
                    <span class="text-gray-600">This Month</span>
                  </div> 
                </div>
                <div class=" transaction-history h-44 overflow-y-auto overflow-x-auto shadow p-2">
                  <section class="grid grid-cols-5 font-semibold border-b">
                    <span>#</span>
                    <span>Sender</span>
                    <span>Amount</span>
                    <span>Date</span>
                    <span>Status</span>
                  </section>
                  <div class="overflow-x-auto">
                  </div>
                </div>
              </div>
            </section>
          </article>
        </section>
      </div>
      <div id="payment-modal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <h2 class="text-lg font-semibold mb-4">Add Payment</h2>
          <form id="payment-form">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Name</label>
              <input type="text" id="payment-name" class="border border-gray-300 p-2 rounded-lg w-full" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Amount</label>
              <input type="number" id="payment-amount" class="border border-gray-300 p-2 rounded-lg w-full" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Date</label>
              <input type="date" id="payment-date" class="border border-gray-300 p-2 rounded-lg w-full" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Category</label>
              <select id="payment-category" class="border border-gray-300 p-2 rounded-lg w-full" required>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Savings">Savings</option>
                <option value="Income">Income</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button type="button" id="close-modal" class="bg-gray-300 text-black px-4 py-1 rounded-lg hover:bg-gray-400">Cancel</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 ml-2">Submit</button>
            </div>
          </form>
        </div>
      </div>

      <div id="login-modal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <h2 class="text-lg font-semibold mb-4">Login</h2>
          <form id="login-form">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Name</label>
              <input type="text" id="login-name" class="border border-gray-300 p-2 rounded-lg w-full" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Account Number</label>
              <input type="number" id="login-account" class="border border-gray-300 p-2 rounded-lg w-full" required />
            </div>
            <div class="flex justify-end">
              <button type="button" id="close-login-modal" class="bg-gray-300 text-black px-4 py-1 rounded-lg hover:bg-gray-400">Cancel</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 ml-2">Login</button>
            </div>
          </form>
        </div>
      </div>

      <footer class='flex bg-black justify-between p-2 text-white lg:hidden'>
        <div>
          <p id="home"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></p>
          <p>home</p>
        </div>
        <div>
          <p id="card"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></p>
          <p>card</p>
        </div>
        <div>
          <p  class="bg-purple-700 rounded-full p-4 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scan"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg></p>
        </div>
        <div>
          <p id="stats"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column-big"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="15" y="5" width="4" height="12" rx="1"/><rect x="7" y="8" width="4" height="9" rx="1"/></svg></p>
          <p>stats</p>
        </div>
        <div>
          <p id="profile"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg></p>
          <p>profile</p>
        </div>
      </footer>
    </body>
  `;

  const paymentButton = document.getElementById('payment-button');
  const paymentModal = document.getElementById('payment-modal');
  const closeModalButton = document.getElementById('close-modal');
  const paymentForm = document.getElementById('payment-form');

  const loginButton = document.getElementById('login-button');
  const loginModal = document.getElementById('login-modal');
  const closeLoginModalButton = document.getElementById('close-login-modal');
  const loginForm = document.getElementById('login-form');
  const cardUserName = document.getElementById('card-user-name');
  const accountNumber = document.getElementById('login-account').value;


  // Add event listeners for the footer buttons
  const homeButton = document.getElementById('home');
  const cardButton = document.getElementById('card');
  const scanButton = document.getElementById('scan');
  const statsButton = document.getElementById('stats');
  const profileButton = document.getElementById('profile');

  const homeSection = document.getElementById('home_display');
  const cardSection = document.getElementById('card_display');
  const transactionsSection = document.getElementById('transactions');

  paymentButton.addEventListener('click', () => {
    paymentModal.classList.remove('hidden');
  });

  closeModalButton.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
  });

  loginButton.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });

  closeLoginModalButton.addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const userName = document.getElementById('login-name').value;
    const accountNumber = document.getElementById('login-account').value; // Get account number
    
    // Format the account number to show only the last 4 digits
    const maskedAccountNumber = '**** **** ' + accountNumber.slice(-4);
    
    cardUserName.innerText = userName; // Update the card with the user's name
    document.getElementById('card-account-number').innerText = maskedAccountNumber; // Update card with masked account number

    // Store details in local storage
    localStorage.setItem('userName', userName);
    localStorage.setItem('accountNumber', accountNumber); // Store full account number for potential future use

    loginModal.classList.add('hidden'); // Hide the login modal
    loginForm.reset(); // Reset the login form
});
function loadUserDetailsFromLocalStorage() {
  const storedAccountNumber = localStorage.getItem('accountNumber');
  const storedUserName = localStorage.getItem('userName');

  if (storedAccountNumber) {
      document.getElementById('card-account-number').innerText = storedAccountNumber; // Display account number
  }
  if (storedUserName) {
      cardUserName.innerText = storedUserName; // Display user name on the card
  }
}
// Call this function when the page loads
loadUserDetailsFromLocalStorage();
loadMonthlySpentFromLocalStorage(); // Add this line
function updateTotalAmountInLocalStorage(totalAmount) {
  localStorage.setItem('totalAmount', totalAmount);
}

// Function to load the total amount from local storage
function loadTotalAmountFromLocalStorage() {
  const storedTotalAmount = localStorage.getItem('totalAmount');
  if (storedTotalAmount) {
      const totalAmountDiv = document.querySelector('#total-amount');
      totalAmountDiv.innerText = `$${parseFloat(storedTotalAmount).toLocaleString()}`; // Display the total amount
  }
}

// Call this function when the page loads
loadUserDetailsFromLocalStorage();

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const name = document.getElementById('payment-name').value;
  const amount = parseFloat(document.getElementById('payment-amount').value);
  const category = document.getElementById('payment-category').value;
  const date = document.getElementById('payment-date').value; // Get the date from the input field

  if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
  }

  const categoryDiv = document.querySelector(`[data-category="${category}"]`);
  if (!categoryDiv) {
      alert('Invalid category');
      return;
  }

  const totalAmountDiv = document.querySelector('#total-amount');
  let totalAmount = parseFloat(totalAmountDiv.innerText.replace(/[^0-9.-]+/g, ""));

  const currentAmountText = categoryDiv.querySelector('p.text-2xl'); 
  const currentAmount = parseFloat(currentAmountText.innerText.replace(/[^0-9.-]+/g,""));
  const newAmount = currentAmount + amount; 
  currentAmountText.innerHTML = `$${newAmount.toLocaleString()}`; 

  // Update total amount based on category
  if (category === 'Food' || category === 'Rent' || category === 'Entertainment') {
      totalAmount -= amount; // Decrease total amount for expenses
  } else {
      totalAmount += amount; // Increase total amount for income/savings
  }
  
  // Update the total amount displayed on the card
  totalAmountDiv.innerText = `$${totalAmount.toLocaleString()}`;
  updateTotalAmountInLocalStorage(totalAmount);

  // Update monthly spent amount in local storage
  if (category === 'Food' || category === 'Rent' || category === 'Entertainment') {
      const monthlySpentDiv = document.querySelector('[data-category="Monthly spent"]');
      const monthlySpentText = monthlySpentDiv.querySelector('p.text-2xl');
      const currentMonthlySpent = 0;
      const newMonthlySpent = currentMonthlySpent + amount;
      monthlySpentText.innerHTML = `$${newMonthlySpent.toLocaleString()}`;
      localStorage.setItem('monthlySpent', newMonthlySpent); // Update local storage
  }

  // Pass the date to the transaction history function
  addTransactionToHistory(name, amount, date, category);
  storeTransactionInLocalStorage(name, amount, date, category);
  
  // Reset the form and hide the modal
  paymentForm.reset();
  paymentModal.classList.add('hidden');

  drawChart(); // Call to update the chart
});
  loadTotalAmountFromLocalStorage();
  
  function addTransactionToHistory(name, amount, date, category, index) {
    const transcontainer = document.querySelector('.transaction-history');
    const transactionrow = document.createElement('section');
    transactionrow.className = "grid grid-cols-5 border-b p-2";
    transactionrow.innerHTML = `
    <span>${index}</span> <!-- Use the passed index -->
    <span>${name}</span>
    <span>$${amount.toLocaleString()}</span>
    <span>${date}</span>
    <span>${category}</span>
    </section>
    `;
    transcontainer.appendChild(transactionrow);
}

  function loadMonthlySpentFromLocalStorage() {
    const monthlySpent = localStorage.getItem('monthlySpent');
    if (monthlySpent) {
        const monthlySpentDiv = document.querySelector('[data-category="Monthly spent"]');
        const monthlySpentText = monthlySpentDiv.querySelector('p.text-2xl');
        monthlySpentText.innerHTML = `$${parseFloat(monthlySpent).toLocaleString()}`; // Display the monthly spent amount
    }
  }

  function storeTransactionInLocalStorage(name, amount, date, category) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ name, amount, date, category });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update category amounts in local storage
    const categoryAmounts = JSON.parse(localStorage.getItem('categoryAmounts')) || {};
    categoryAmounts[category] = (categoryAmounts[category] || 0) + amount; // Increment the category amount
    localStorage.setItem('categoryAmounts', JSON.stringify(categoryAmounts));

    // Store the added amount for the specific transaction
    const addedAmounts = JSON.parse(localStorage.getItem('addedAmounts')) || {};
    addedAmounts[category] = (addedAmounts[category] || 0) + amount; // Increment the added amount for the category
    localStorage.setItem('addedAmounts', JSON.stringify(addedAmounts));

    if (category === 'Food' || category === 'Rent' || category === 'Entertainment') {
      const monthlySpent = parseFloat(localStorage.getItem('monthlySpent')) || 0;
      localStorage.setItem('monthlySpent', monthlySpent + amount);
  }
}

function loadTransactionsFromLocalStorage() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.forEach((transaction, index) => {
      addTransactionToHistory(transaction.name, transaction.amount, transaction.date, transaction.category, index + 1); // Pass index + 1
  });

  // Load category amounts from local storage and update the UI
  const categoryAmounts = JSON.parse(localStorage.getItem('categoryAmounts')) || {};
  for (const category in categoryAmounts) {
      const categoryDiv = document.querySelector(`[data-category="${category}"]`);
      if (categoryDiv) {
          const currentAmountText = categoryDiv.querySelector('p.text-2xl');
          const currentAmount = parseFloat(currentAmountText.innerText.replace(/[^0-9.-]+/g, ""));
          const newAmount = currentAmount + categoryAmounts[category];
          currentAmountText.innerHTML = `$${newAmount.toLocaleString()}`;
      }
  }
  const addedAmounts = JSON.parse(localStorage.getItem('addedAmounts')) || {};
  for (const category in addedAmounts) {
      const categoryDiv = document.querySelector(`[data-category="${category}"]`);
      if (categoryDiv) {
          const addedAmountSpan = categoryDiv.querySelector('.added-amount');
          if (addedAmountSpan) {
              addedAmountSpan.innerText = `+${addedAmounts[category].toLocaleString()}`; // Display the added amount
          }
      }
  }
}

  // Call this function when the page loads
  loadTransactionsFromLocalStorage();

  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    // Gather data from the income and expense categories
    const incomeDiv = document.querySelector('[data-category="Income"]');
    const foodDiv = document.querySelector('[data-category="Food"]');
    const rentDiv = document.querySelector('[data-category="Rent"]');
    const entertainmentDiv = document.querySelector('[data-category="Entertainment"]');
    const savingsDiv = document.querySelector('[data-category="Savings"]');

    const incomeAmount = parseFloat(incomeDiv.querySelector('p.text-2xl').innerText.replace(/[^0-9.-]+/g, ""));
    const foodAmount = parseFloat(foodDiv.querySelector('p.text-2xl').innerText.replace(/[^0-9.-]+/g, ""));
    const rentAmount = parseFloat(rentDiv.querySelector('p.text-2xl').innerText.replace(/[^0-9.-]+/g, ""));
    const entertainmentAmount = parseFloat(entertainmentDiv.querySelector('p.text-2xl').innerText.replace(/[^0-9.-]+/g, ""));
    const savingsAmount = parseFloat(savingsDiv.querySelector('p.text-2xl').innerText.replace(/[^0-9.-]+/g, ""));

    // Create data array for pie chart
    var data = google.visualization.arrayToDataTable([
        ['Category', 'Amount'],
        ['Income', incomeAmount],
        ['Food', foodAmount],
        ['Rent', rentAmount],
        ['Entertainment', entertainmentAmount],
        ['Savings', savingsAmount]
    ]);

    var options = {
        title: 'Cash Flow Overview',
        backgroundColor: '#f9f9f9',
        pieHole: 0.5,
        pieSliceTextStyle: {
            color: 'black',
        },
        legend: { position: 'right' } // Display legend on the right
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
}
})


