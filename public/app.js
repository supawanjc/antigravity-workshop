document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expensesContainer = document.getElementById('expenses-container');
    const totalAmountElement = document.getElementById('total-amount');

    // Fetch and display expenses on load
    fetchExpenses();

    // Handle form submission
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;

        if (!description || !amount || !category) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, amount, category }),
            });

            if (response.ok) {
                expenseForm.reset();
                fetchExpenses();
            } else {
                alert('Failed to add expense');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    });

    async function fetchExpenses() {
        try {
            expensesContainer.innerHTML = '<div class="loading-spinner"></div>';
            const response = await fetch(`${config.API_BASE_URL}/api/expenses`);
            const expenses = await response.json();

            renderExpenses(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            expensesContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">Failed to load expenses</p>';
        }
    }

    function renderExpenses(expenses) {
        expensesContainer.innerHTML = '';
        let total = 0;

        if (expenses.length === 0) {
            expensesContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">No expenses recorded yet.</p>';
            totalAmountElement.textContent = 'Total: $0.00';
            return;
        }

        expenses.forEach(expense => {
            total += expense.amount;
            const date = new Date(expense.createdAt).toLocaleDateString();

            const item = document.createElement('div');
            item.className = 'expense-item';
            item.innerHTML = `
                <div class="expense-info">
                    <span class="expense-desc">${escapeHtml(expense.description)}</span>
                    <div class="expense-meta">
                        <span class="expense-category">${escapeHtml(expense.category)}</span>
                        <span class="expense-date">${date}</span>
                    </div>
                </div>
                <div class="expense-amount-actions">
                    <span class="expense-amount">-$${expense.amount.toFixed(2)}</span>
                    <button class="btn-delete" onclick="deleteExpense(${expense.id})" title="Delete">
                        &times;
                    </button>
                </div>
            `;
            expensesContainer.appendChild(item);
        });

        totalAmountElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Expose delete function to global scope
    window.deleteExpense = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/expenses/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchExpenses();
            } else {
                alert('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
