const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

//@desc - Register a user
//@route - POST /api/v1/auth/register
//@access - Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

//@desc - Login a user
//@route - POST /api/v1/auth/login
//@access - Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check if the body contains email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter email and password', 401));
  }

  // Get user from DB
  const user = await User.findOne({ email }).select('+password');

  //If user email does not exist throw an error
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //Check password
  const isCompared = await user.comparePassword(password);
  if (!isCompared) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

//@desc - Get logged in user's details
//@route - POST /api/v1/auth/me
//@access - Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});
