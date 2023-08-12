const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

//@desc - Register a user
//@route - POST /api/v1/auth/register
//@access - Public

exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
