let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let chart;

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = document.getElementById('expense-amount').value;
    const date = document.getElementById('expense-date').value;
    const category = document.getElementById('expense-category').value;
    
    if (name && amount && date && category) {
        expenses.push({
            name,
            amount: parseFloat(amount),
            date: new Date(date).toLocaleDateString(),
            category
        });
        
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateUI();
        clearForm();
    }
}

function updateUI() {
    updateChart();
    updateExpenseList();
    updateTotalDisplay();
}

function updateExpenseList() {
    const list = document.getElementById('expenseList');
    list.innerHTML = expenses.map((exp, index) => `
        <div class="expense-item">
            <div style="display: flex; align-items: center;">
                <div class="category-marker" style="background: ${getCategoryColor(exp.category)}"></div>
                <div>
                    <h3>${exp.name}</h3>
                    <small>${exp.date} • ${exp.category}</small>
                </div>
            </div>
            <div>
                <h3>₹${exp.amount.toFixed(2)}</h3>
                <button style="background: #ff4757; padding: 0.5rem 1rem; margin-top: 0.5rem;" 
                        onclick="removeExpense(${index})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function removeExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateUI();
}

function getCategoryColor(category) {
    const colors = {
        'Food': '#FF6384',
        'Transport': '#36A2EB',
        'Entertainment': '#FFCE56',
        'Shopping': '#4CAF50',
        'Other': '#9966FF'
    };
    return colors[category];
}

function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categories = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: Object.keys(categories).map(getCategoryColor),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return ` ₹${context.parsed.toFixed(2)} (${Math.round(context.percent)}%)`;
                        }
                    }
                }
            }
        }
    });
}

function calculateTotalExpenses() {
    return expenses.reduce((total, exp) => total + exp.amount, 0);
}

function updateTotalDisplay() {
    const total = calculateTotalExpenses();
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('warningBanner').style.display = total > 2000 ? 'block' : 'none';
}

function clearForm() {
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = '';
    document.getElementById('expense-category').value = 'Food';
}

// Initial load
updateUI();