const { check } = require("express-validator");

exports.companyCreateValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Company's Name is required")
];
