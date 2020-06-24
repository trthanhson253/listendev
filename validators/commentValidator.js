const { check } = require('express-validator');

exports.commentCreateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('content').not().isEmpty().withMessage('Comment is required'),
  // check('content')
  //   .isLength({ min: 10 })
  //   .withMessage('Comment must be at least 10 characters long'),
  check('company').not().isEmpty().withMessage('Company is required'),
];
