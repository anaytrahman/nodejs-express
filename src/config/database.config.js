const mongoose = require('mongoose');

module.exports = () => {
	
	mongoose.connect('mongodb://localhost:27017/facebook', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	
	mongoose.connection.on('connected', () => {
		console.log(`Database is connected`);
	});
	
	mongoose.connection.on('error', (err) => {
		console.log(`database error`, err);
	});
	
}
