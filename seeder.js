
const fs = require('fs');
require('dotenv').config({ path: './config/config.env' });
const mongoose = require('mongoose');
const Bootcamps = require('./model/Bootcamps');
const Courses = require('./model/Courses');

mongoose.connect(process.env.DATABASE_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
},
  console.log('Seeder Database Connected!')
);

const bootcampData = fs.readFileSync('./data/bootcamps.json', 'utf-8');
const coursedata = fs.readFileSync('./data/courses.json', 'utf-8');

const importData = async () => {
  try {
    await Bootcamps.create(JSON.parse(bootcampData));
    await Courses.create(JSON.parse(coursedata));
    console.log('Bootcamp successfuly imported');
  } catch (error) {
    console.log(error);
  }

};

const deletData = async () => {
  try {
    await Bootcamps.deleteMany();
    await Courses.deleteMany();
    console.log("Data successfully deleted");
  } catch (error) {
    console.log(error);
  }

};

if (process.argv[2] === '-i') {
  importData();
}

if (process.argv[2] === '-d') {
  deletData();
}