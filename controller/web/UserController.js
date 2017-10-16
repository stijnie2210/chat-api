var router = require('express').Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User')

router.get('/me', async function(req, res) {
	try {
		var user = await User.findSingle(req.user.id)
	} catch(err) {
		console.log(err)
	}

	res.render('profile.ejs', { user })
})

router.basePath = '/users'

module.exports = router