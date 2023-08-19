const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Bootcamps = require('../models/Bootcamps');
const Reviews = require('../models/Review');

//@desc - Get all Reviews
//@route - /api/v1/reviews
//@route - /api/v1/bootcamps/:bootcampId/reviews
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
//@route - /api/v1/reviews/:id
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
//@route - /api/v1/bootcamp/:bootcampId/reviews/
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
