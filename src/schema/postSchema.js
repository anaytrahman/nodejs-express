const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema =  new Schema({
	userId: {type: String, required: true},
	about: {type: String, required: true},
	description {type: String, required: true}
})  