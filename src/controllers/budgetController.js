<<<<<<< HEAD
const Budget = require('../models/Budget');

const createBudget = async (req, res) => {
const { trip, name, amount, category } = req.body;
const budget = await Budget.create({ user: req.user._id, trip, name, amount, category });
res.status(201).json(budget);
};

const getBudgets = async (req, res) => {
const budgets = await Budget.find({ user: req.user._id });
res.json(budgets);
};

const updateBudget = async (req, res) => {
const budget = await Budget.findById(req.params.id);
if (!budget) return res.status(404).json({ message: 'Budget not found' });
if (budget.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

budget.name = req.body.name || budget.name;
budget.amount = req.body.amount || budget.amount;
budget.category = req.body.category || budget.category;
await budget.save();
res.json(budget);
};

const deleteBudget = async (req, res) => {
const budget = await Budget.findById(req.params.id);
if (!budget) return res.status(404).json({ message: 'Budget not found' });
if (budget.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

await budget.remove();
res.json({ message: 'Budget removed' });
};


module.exports = { createBudget, getBudgets, updateBudget, deleteBudget };
=======
const Budget = require('../models/Budget');

const createBudget = async (req, res) => {
const { trip, amount } = req.body;
const budget = await Budget.create({ user: req.user._id, trip, amount });
res.status(201).json(budget);
};

const getBudgets = async (req, res) => {
const budgets = await Budget.find({ user: req.user._id });
res.json(budgets);
};

const updateBudget = async (req, res) => {
const budget = await Budget.findById(req.params.id);
if (!budget) return res.status(404).json({ message: 'Budget not found' });
if (budget.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

budget.amount = req.body.amount;
await budget.save();
res.json(budget);
};


module.exports = { createBudget, getBudgets, updateBudget };
>>>>>>> edc444351689a023e24478713c5f645222377be1
