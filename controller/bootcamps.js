const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');

//@desc - Get all Bootcamps
//@route - /api/v1/bootcamps
//@access - Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  console.log(req.query);

  //advanced query - /api/v1/bootcamps?location.state=MA ==== { 'location.state': 'MA' }
  ///api/v1/bootcamps?averageCost[lte]=1000 ===== { averageCost: { lte: '1000' } }
  // /api/v1/bootcamps?select=name,description
  let query;

  //copy req.query made so we can remove the fields that we dont need for filtering
  const reqQuery = { ...req.query };

  //fields to exclude from match for filtering
  const removeFields = ['select', 'sort', 'limit', 'page'];

  //loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //advanced quering with gt gte etc
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //select fields to return
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //executing query
  const bootcamps = await query;

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (!bootcamps) {
    return res.status(400).json({ success: false });
  }

  res
    .status(200)
    .json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
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

//@desc - Get Bootcamps within a radius
//@route - /api/v1/bootcamps/radius/:zipcode/:distance
//@access - Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //get lat and lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //divde dist by radius of earth
  //Radius of earth 3963 mi / 6378 km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
