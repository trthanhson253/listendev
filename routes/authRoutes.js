const express = require('express');
const router = express.Router();
const { signin, signout, signup } = require('../controllers/authController');

// validators
const { runValidation } = require('../validators');
const { userSigninValidator } = require('../validators/authValidator');

router.post('/signup', signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

module.exports = router;
