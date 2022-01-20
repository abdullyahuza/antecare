const isAuth = function(req, res, next){
	if (req.isAuthenticated()) {
		next()
	}else{
		res.status(401).json({message: 'You are not authorized to view this page.'})
	}
}


const isAdmin = function(req, res, next){
	if (req.isAuthenticated() && req.user.admin) {
		next()
	}else{
		res.status(401).json({message: 'You are not authorized to view this page.'})
	}	
}

module.exports = {
	isAuth,
	isAdmin
}