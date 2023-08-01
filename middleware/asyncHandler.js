//created this method so we don't have to repeat ourselves
//DRY
//Try / catch

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
