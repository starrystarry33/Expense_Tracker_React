const IncomeSchema= require("../models/IncomeModel")

// Incomes

// add a income
exports.addIncome = async (req, res) => {
    const {title, amount, category, description, date, location}  = req.body

    const income = IncomeSchema({
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
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)
}

//get all income records from database
exports.getIncomes = async (req, res) =>{
    try {
        const incomes = await IncomeSchema.find().sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

//delete income record by id
exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    IncomeSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Income Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}

//update income record by id
exports.editIncome = async (req, res) =>{
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
        await IncomeSchema.findByIdAndUpdate(id,req.body)
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}