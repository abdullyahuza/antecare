const mongoose = require('mongoose');

// schema object
const Schema = mongoose.Schema;

const guestSchema = new Schema({
	pid: {type: String, required: true},
	firstName: {type: String, required: true},
	lastName: {type: String,required: true},
	// password: {type: String, required: true},
	// salt: String
});

const Guest = mongoose.model('Guest', guestSchema);


module.exports = Guest;