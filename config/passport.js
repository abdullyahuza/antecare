const passport = require('passport');
const LocalStrategy = require('passport-local');
const Doctor = require('../models/doc')
const validPassword = require('../functions/passwordUtils').validPassword;

const verifyCallBack = function(username, password, done){
	Doctor.findOne({username: username})
	.then((user)=> {
		if(!user) return done(null, false)
		const isValid = validPassword(password, user.password, user.salt)
		if(isValid){
			return done(null, user)
		}else{
			return done(null, false)
		}
	})
	.catch((error)=> {
		done(error)
	})
}


const strategy = new LocalStrategy(verifyCallBack);


passport.use(strategy);

passport.serializeUser((doc, done) => {
    done(null, doc.id);
});

passport.deserializeUser((docId, done) => {
    Doctor.findById(docId)
        .then((doc) => {
            done(null, doc);
        })
        .catch(err => done(err))
});