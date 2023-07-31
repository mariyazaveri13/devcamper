const Bootcamp = require('../models/Bootcamps');

//@desc - Get all Bootcamps
//@route - /api/v1/bootcamps
//@access - Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    if (!bootcamps) {
      return res.status(400).json({ success: false });
    }

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc - Get single Bootcamps
//@route - /api/v1/bootcamps/:id
//@access - Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
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
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc - Update Bootcamps
//@route - /api/v1/bootcamps/:id
//@access - Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
