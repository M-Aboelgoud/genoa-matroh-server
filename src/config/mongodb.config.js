import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// mongoose options
const options = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     autoIndex: false,
     poolSize: 10,
     bufferMaxEntries: 0,
     useCreateIndex: true,  // Deprecated, but included for reference
     useFindAndModify: false  // Deprecated, but included for reference
};

// mongodb environment variables
const {
     MONGODB_URI
} = process.env;

// connection URL
const dbConnectionURL = MONGODB_URI || 'mongodb://localhost:27017/mydatabase';  // Fallback to local DB if not specified

mongoose.connect(dbConnectionURL, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb Connection Error:'));
db.once('open', () => {
     // we're connected !
     console.log('Mongodb Connection Successful');
});

export default db;
