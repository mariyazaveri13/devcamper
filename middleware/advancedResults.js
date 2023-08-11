const advancedResults = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryStr));

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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

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

  res.advancedResults = {
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  };

  next();
};

module.exports = advancedResults;
