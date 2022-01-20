const mongoose = require('mongoose');

// schema object
const Schema = mongoose.Schema;

const docSchema = new Schema({
	username: {type: String, unique: true, required: true},
	firstname: {type: String, required: true},
	lastname: {type: String,required: true},
	middlename: {type: String},
	password: {type: String, required: true},
	salt: String,
	admin: Boolean

},{timestamps: true});

const Doctor = mongoose.model('Doctor', docSchema);


module.exports = Doctor;