const mongoose = require('mongoose');

// schema object
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
	pid: {type: String, required: true},
	message: {type: String, required: true, unique: true},
});

const Question = mongoose.model('Questions', QuestionSchema);


module.exports = Question;