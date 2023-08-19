const express = require('express');

const {
  getReviews,
  getReview,
  createReview,
} = require('../controller/reviews');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/Review');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('admin', 'user'), createReview);

router.route('/:id').get(getReview);

module.exports = router;
