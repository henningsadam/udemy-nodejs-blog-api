const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('invalid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('email already in use');
          }
        });
      }).withMessage('email in use')
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
);

router.put('/login', authController.login)

module.exports = router;
