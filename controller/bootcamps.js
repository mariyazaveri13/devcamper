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
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new request' });
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
