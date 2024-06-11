import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import app from './app';
import * as mongodb from './lib/mongodb';

const PORT = process.env.PORT || 3001;

mongodb.connect().then(() => {
  console.log('Connected to MongoDB! 🔥');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}! 🚀`);
});
