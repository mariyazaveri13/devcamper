const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Bootcamps = require('../models/Bootcamps');

//@desc - Get all Courses
//@route - /api/v1/courses
//@route - /api/v1/bootcamps/:bootcampId/courses
//@access - Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc - Get all Courses
//@route - /api/v1/courses/:id
//@access - Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course found by ID ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc - Add new course
//@route - POST /api/v1/bootcamps/:bootcampId/courses
//@access - Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamps.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No available bootcamps for ID ${req.params.bootcampId}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`Unauthorized access`, 401));
  }

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

//@desc - Update Course
//@route -PUT /api/v1/courses/:id
//@access - Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found by ID ${req.params.id}`, 404)
    );
  }

  if (course.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized access', 401));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc - Delete Course
//@route - DELETE /api/v1/courses/:id
//@access - Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.id });

  if (!course) {
    return next(
      new ErrorResponse(`No courses found by ID ${req.params.id}`, 404)
    );
  }

  if (course.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized access', 401));
  }

  await Course.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
  });
});
