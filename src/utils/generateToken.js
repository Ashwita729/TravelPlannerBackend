<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
module.exports = generateToken;

=======
const jwt = require('jsonwebtoken');
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
module.exports = generateToken;

>>>>>>> edc444351689a023e24478713c5f645222377be1
