const passport = require('passport');
const Doctor = require('../models/doc');
const passwordUtils = require('../functions/passwordUtils');
// index controller

//Question
const Question = require('../models/questions');
const doc_index = (req, res) => {
	res.render('doc/index', {title:"AnteCare", loginError: req.flash('loginError')});
}

//login controller
const doc_login = passport.authenticate('local', 
	{ 
		failureRedirect: '/doc',
		// successRedirect: '/doc/dashboard' 
	}
)

// dash controller
const doc_dash = (req, res) => {
	res.render('doc/dashboard', {title:"AnteCare", messages: req.flash('alert')});
}

//question endpoint
//delete blog
const delete_question = (req, res) => {
	const id = req.params.id;
	Question.findByIdAndDelete(id)
		.then((result) => {
			req.flash('alert', `Deleted successfully.`)
			res.json({redirect: '/doc/view-training'});
		})
		.catch((error) => console.log(error));
}

//training
const training = (req, res) => {
	//fetch Questions
	Question.find().sort({createdAt: -1})
		.then((result) => {
			console.log(result)
			res.render('doc/view-training', {layout:'train-layout.hbs', title:"AnteCare", messages: req.flash('alert'), questions:result});
		})
		.catch((error) => console.log(error))
}

const logout = (req, res) => {
	req.logout()
	res.redirect('/doc');
}

const new_doc = (req, res) => {
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let middlename = req.body.middlename;

	const saltHash = passwordUtils.genPassword(lastname+firstname);
	const salt = saltHash.salt;
	const hash = saltHash.hash;

	let newDoc = new Doctor({
		username: lastname+firstname,
		firstname: firstname,
		lastname: lastname,
		middlename: middlename,
		password: hash,
		salt: salt,
  })

	newDoc.save()
  .then((doc) => {
      console.log(doc);
  });
  
  req.flash('alert', `Dr. ${firstname} added successfully`)
	res.redirect('/doc/dashboard');
}

module.exports = {
	doc_index,
	doc_login,
	doc_dash,
	training,
	new_doc,
	logout,
	delete_question
}
