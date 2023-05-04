const { addExpense, getExpense, deleteExpense, editExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome,editIncome } = require('../controllers/income');

const router = require('express').Router();

// router category
router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .patch('/update-income/:id', editIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .patch('/update-expense/:id', editExpense)

module.exports = router