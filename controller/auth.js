const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

//@desc - Forgot password
//@route - POST /api/v1/auth/forgotpassword
//@access - Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('No user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Please make a PUT request to : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset Token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (e) {
    console.log(e);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc - Reset password
//@route - PUT /api/v1/auth/resetpassword/:resettoken
//@access - Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  //set new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc - Update logged in user details
//@route - PUT /api/v1/auth/updatedetails
//@access - Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const detailsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, detailsToUpdate, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: user });
});

//@desc - Update Password for logged in user
//@route - PUT /api/v1/auth/updatepassword
//@access - Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
