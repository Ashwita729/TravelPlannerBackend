<<<<<<< HEAD
const Express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const router = Express.Router();


router.post('/register', registerUser);
router.post('/login', authUser);


=======
const Express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const router = Express.Router();


router.post('/register', registerUser);
router.post('/login', authUser);


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = router;