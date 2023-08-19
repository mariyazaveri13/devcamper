const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Bootcamps = require('../models/Bootcamps');
const Reviews = require('../models/Review');

//@desc - Get all Reviews
//@route - GET /api/v1/reviews
//@route - GET /api/v1/bootcamps/:bootcampId/reviews
//@access - Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Reviews.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc - Get single review
//@route - GET /api/v1/reviews/:id
//@access - Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    next(new ErrorResponse(`Review not found with ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc - Create review
//@route - POST /api/v1/bootcamp/:bootcampId/reviews/
//@access - Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamps.findById(req.params.bootcampId);
  if (!bootcamp) {
    next(new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`));
  }

  const review = await Reviews.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

//@desc - Update review
//@route - PUT /api/v1/reviews/:id
//@access - Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Reviews.findById(req.params.id);

  //check if the logged in user actually posted the review
  if (review.user.toString() !== req.user.id && !req.user.role !== 'admin') {
    next(new ErrorResponse('Not authorized', 401));
  }

  const updateReview = {
    text: req.body.text,
    title: req.body.title,
    rating: req.body.rating,
  };

  review = await Reviews.findByIdAndUpdate(req.params.id, updateReview, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc - delete review
//@route - PUT /api/v1/reviews/:id
//@access - Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Reviews.findById(req.params.id);

  //check if the logged in user actually posted the review
  if (review.user.toString() !== req.user.id && !req.user.role !== 'admin') {
    next(new ErrorResponse('Not authorized', 401));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
