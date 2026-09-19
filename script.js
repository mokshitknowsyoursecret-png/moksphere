const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalAmountEl = document.getElementById('total-amount');
const ctx = document.getElementById('expenseChart').getContext('2d');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let chartInstance = null;

const colors = {
    'Food': '#f59e0b',
    'Transport': '#3b82f6',
    'Utilities': '#10b981',
    'Entertainment': '#8b5cf6',
    'Other': '#6b7280'
};

function init() {
    renderList();
    updateDashboard();
}

function addExpense(e) {
    e.preventDefault();
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;

    const expense = { id: Date.now(), name, amount, category };
    expenses.push(expense);
    saveData();
    form.reset();
    init();
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveData();
    init();
}

function renderList() {
    list.innerHTML = '';
    expenses.forEach(exp => {
        const li = document.createElement('li');
        li.style.borderLeftColor = colors[exp.category];
        li.innerHTML = `
            <div>
                <strong>${exp.name}</strong> <small style="color: #6b7280; margin-left: 5px;">(${exp.category})</small>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-weight: bold;">$${exp.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">X</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function updateDashboard() {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    totalAmountEl.textContent = `$${total.toFixed(2)}`;

    const categoryTotals = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const bgColors = labels.map(label => colors[label]);

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (data.length === 0) {
        labels.push('No Expenses');
        data.push(1);
        bgColors.push('#e5e7eb');
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data, backgroundColor: bgColors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function saveData() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

form.addEventListener('submit', addExpense);
init();
