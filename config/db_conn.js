const mongoose = require('mongoose');
const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient();

// Promisify Redis functions for async/await usage
// const getAsync = promisify(redisClient.get).bind(redisClient);
// const setAsync = promisify(redisClient.set).bind(redisClient);

const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_cluster = process.env.MONGO_CLUSTER;
const mongo_database = process.env.MONGO_DBNAME || 'test';

// Prefer a full URI if provided (e.g. for Atlas), otherwise build one from parts,
// and finally fall back to a local MongoDB instance.
const mongoUri = process.env.MONGODB_URI || (
	(mongo_username && mongo_password && mongo_cluster)
		? `mongodb+srv://greatstack:NSDUEyIzn09WiOuL@cluster0.mq74tik.mongodb.net/?appName=Cluster0`
		: `mongodb://localhost:27017/${mongo_database}`
);

console.log('Using Mongo URI from environment?:', !!process.env.MONGODB_URI);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log(`Connected to: ${mongoose.connection.name}`))
.catch(err => console.log('Mongo connection error:', err));



// async function getDataFromDatabase(id) {
//     // Check if the data is already cached
//     const cachedData = await getAsync(id);
//     if (cachedData) {
//       console.log('Fetching data from cache');
//       return JSON.parse(cachedData);
//     }
  
//     // If not cached, fetch data from the database
//     console.log('Fetching data from the database');
//     const data = await MyModel.findById(id).exec();
  
//     // Cache the fetched data
//     await setAsync(id, JSON.stringify(data));
  
//     return data;
//   }



//   async function main() {
//     const data1 = await getDataFromDatabase();
//     console.log(data1);
  
//     // Fetch the same data again to demonstrate caching
//     const data2 = await getDataFromDatabase();
//     console.log(data2);
//   }
  
//   main().catch(console.error);


// mongoose.connect(`mongodb://localhost:27017`
// , { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log(`Connected to: DB`))
// .catch(err => console.log(err));


module.exports = mongoose;