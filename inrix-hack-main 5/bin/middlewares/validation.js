const { validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(417).json({
      success: false,
      details: errors.array()[0].msg,
    });
  }
  next();
};
