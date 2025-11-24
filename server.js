const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('public')); // Removed for separate deployment

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Create a new expense
app.post('/api/expenses', async (req, res) => {
    const { description, amount, category } = req.body;
    try {
        const expense = await prisma.expense.create({
            data: {
                description,
                amount: parseFloat(amount),
                category,
            },
        });
        res.json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.expense.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Export the Express API
module.exports = app;

// Start the server if running directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
