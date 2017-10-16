function isAuth(req, res, next) {
	if(req.isAuthenticated()) {
		res.redirect('/web')
	} else {
		next()
	}
}