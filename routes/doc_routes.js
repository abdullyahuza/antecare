const express = require('express');

const docController = require('../controllers/doc_controller');

const router = express.Router();

const isAuth = require('../middlewares/authenticate').isAuth
const isAdmin = require('../middlewares/authenticate').isAdmin


//index route
router.get('/', docController.doc_index);


router.post('/login', function(req, res, next){

	req.flash('loginError', `Invalid Credentials`)
	next()
	
}, docController.doc_login,function(req, res){
	req.flash('alert', `Welcome back Dr. ${req.user.firstname}`)
	req.flash('loginError', '')
	res.redirect('/doc/dashboard');
});

router.get('/dashboard',isAuth, docController.doc_dash);

router.get('/logout', docController.logout);

router.post('/new-doc', docController.new_doc);

module.exports = router;
