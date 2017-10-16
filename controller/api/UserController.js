var router = require('express').Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User')

router.get('/', async function(req, res, next) {
	try {
		var users = await User.findAll()
	} catch(err) {

	}

	res.json(users)
})

router.get('/me', async function(req, res) {
	try {
		var user = await User.findSingle(req.user.id)
	} catch(err) {
		console.log(err)
	}

	res.json(user)
})

router.basePath = '/users'

module.exports = router