const mongoose = require('mongoose');
const colors = require('colors');

const CourseScheme = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

//statics are directly called on model
//methods are where we created query what we did with our controllers

//Static method to get average of course tuitions
CourseScheme.statics.getAverageCost = async function (bootcampId) {
  console.log('Calculating avg cost'.blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  // obj = [
  //   { _id: new ObjectId("5d725a037b292f5f8ceff787"), averageCost: 9000 }
  // ]

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

//call getAverageCost after save
CourseScheme.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

//call getAverageCost after save
CourseScheme.pre('deleteOne', { document: true }, function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseScheme);
