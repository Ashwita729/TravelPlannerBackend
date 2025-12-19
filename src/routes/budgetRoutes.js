const Express = require('express');
const { createBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');
const router = Express.Router();

router.route('/').get(protect, getBudgets).post(protect, createBudget);
router.route('/:id').put(protect, updateBudget).delete(protect, deleteBudget);

module.exports = router;