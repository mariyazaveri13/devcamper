const Bootcamp = require('../models/Bootcamps');

//@desc - Get all Bootcamps
//@route - /api/v1/bootcamps
//@access - Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

//@desc - Get single Bootcamps
//@route - /api/v1/bootcamps/:id
//@access - Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp for Id ${req.params.id}` });
};

//@desc - Create Bootcamp
//@route - /api/v1/bootcamps
//@access - Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc - Delete Bootcamp
//@route - /api/v1/bootcamps/:id
//@access - Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};

//@desc - Update Bootcamps
//@route - /api/v1/bootcamps/:id
//@access - Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamp ${req.params.id}` });
};
