const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

//@desc - Get all Bootcamps
//@route - /api/v1/bootcamps
//@access - Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  if (!bootcamps) {
    return res.status(400).json({ success: false });
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@desc - Get single Bootcamps
//@route - /api/v1/bootcamps/:id
//@access - Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No data found for ${req.params.id}`, 404));
  }

  return res.status(200).json({ success: true, data: bootcamp });
});

//@desc - Create Bootcamp
//@route - /api/v1/bootcamps
//@access - Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

//@desc - Delete Bootcamp
//@route - /api/v1/bootcamps/:id
//@access - Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resourse not found for id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

//@desc - Update Bootcamps
//@route - /api/v1/bootcamps/:id
//@access - Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resourse not found for id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
