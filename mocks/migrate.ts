import dotenv from 'dotenv';

dotenv.config();

import * as mongodb from '../src/lib/mongodb';
import accommodationModel from '../src/models/accommodationModel';
import destinationModel from '../src/models/destinationModel';
import guideModel from '../src/models/guideModel';
import transportationModel from '../src/models/transportationModel';
// import userModel from '../src/models/userModel';

import accommodations from './accommodations.json';
import destinations from './destinations.json';
import guides from './guides.json';
import transportations from './transportations.json';
// import users from './users.json'

mongodb
  .connect()
  .then(() => {
    console.log('Connected to MongoDB! 🔥');
  })
  .catch((error) => {
    console.log(error);
  });

const up = async () => {
  try {
    await accommodationModel.createMany(accommodations);
    await destinationModel.createMany(destinations);
    await guideModel.createMany(guides);
    await transportationModel.createMany(transportations);
    // await userModel.createMany(users);

    console.log('Data inserted successfully! 🚀');
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

const down = async () => {
  try {
    await accommodationModel.deleteMany();
    await destinationModel.deleteMany();
    await guideModel.deleteMany();
    await transportationModel.deleteMany();

    console.log('Data deleted successfully! 🚀');
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

if (process.argv[2] === '--up') {
  up();
} else if (process.argv[2] === '--down') {
  down();
} else {
  console.log('Invalid command! Please use "--up" or "--down" flag.');
  process.exit();
}
