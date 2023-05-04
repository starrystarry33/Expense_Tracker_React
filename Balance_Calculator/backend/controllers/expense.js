const ExpenseSchema = require("../models/ExpenseModel")

// Expenses

//add a expense
exports.addExpense = async (req, res) => {
    const {title, amount, category, description, date, location}  = req.body

    const income = ExpenseSchema({
        title,
        amount,
        category,
        description,
        date,
        location
    })

    try {
        //validations
        if(!title || !category || !description || !date || !location){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await income.save()
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)
}

//get all expense record from database
exports.getExpense = async (req, res) =>{
    try {
        const incomes = await ExpenseSchema.find().sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

//delete expense record by id
exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Expense Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}

//edit expense record by id
exports.editExpense = async (req, res) =>{
    const {title, amount, category, description, date, location}  = req.body
    const {id} = req.params;
    try {
        //validations
        if(!title || !category || !description){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await ExpenseSchema.findByIdAndUpdate(id,req.body)
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}