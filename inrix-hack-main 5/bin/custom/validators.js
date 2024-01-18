const { check } = require('express-validator');

exports.userSignup = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email Address'),
  check('number')
    .isMobilePhone(['en-PK', 'en-IN', 'en-HK'])
    .withMessage('Must be a valid Number'),
  check('password')
    .not()
    .isStrongPassword()
    .withMessage('Must be a valid password'),
];
