 HEAD
const Express = require('express');
const { getAllUsers, updateUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = Express.Router();

router.get('/all', getAllUsers);
router.route('/').put(protect, updateUser);


const Express = require('express');
const { getAllUsers, updateUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = Express.Router();

router.get('/all', getAllUsers);
router.route('/').put(protect, updateUser);

 edc444351689a023e24478713c5f645222377be1
module.exports = router;