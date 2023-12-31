const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env var
dotenv.config({ path: './config/config.env' });

//load models
const Bootcamp = require('./models/Bootcamps');
const Course = require('./models/Course');
const Users = require('./models/User');
const Review = require('./models/Review');

//connect to db
mongoose.connect(process.env.MONGO_URI, {});

//read json file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

//import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await Users.create(users);
    await Review.create(reviews);

    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

//delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await Users.deleteMany();
    await Review.deleteMany();

    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
