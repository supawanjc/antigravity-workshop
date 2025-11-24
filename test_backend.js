require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        // Try to create an expense
        const expense = await prisma.expense.create({
            data: {
                description: 'Test Expense',
                amount: 100.0,
                category: 'Test',
            },
        });
        console.log('Created expense:', expense);

        // Try to fetch expenses
        const expenses = await prisma.expense.findMany();
        console.log('Fetched expenses:', expenses);

        console.log('Backend verification successful!');
    } catch (error) {
        console.error('Backend verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
