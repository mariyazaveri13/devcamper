const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');

//Load env variables
dotenv.config({ path: './config/config.env' });

//load bootcamps
const bootcamps = require('./routes/bootcamps');

//connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//load morgan loggers
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount bootcamps
app.use('/api/v1/bootcamps', bootcamps);

//custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on Port ${process.env.PORT}`
      .yellow.bold
  )
);

//handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  //close server and exit process
  server.close(() => process.exit(1));
});
