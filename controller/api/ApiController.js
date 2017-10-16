var router = require('express').Router(),
	passport = require('passport'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	bodyParser = require('body-parser'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcryptjs'),
	messagesController = require('./MessageController'),
	userController = require('./UserController'),
	mongoose = require('mongoose'),
	User = mongoose.model('User')

router.get('/', function(req, res, next) {
	res.status(404).json({ message: "Not a valid route"})
})

router.post('/auth', function(req, res, next) {
	var jwtOptions = {}

	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
	jwtOptions.secretOrKey = '342ee2ced6c09fb0e0afbd08f2f43a9e'

	if(req.body.user && req.body.password) {
		var userName = req.body.user
		var password = req.body.password
	} else {
		res.status(401)
	}

	User.findOne({"local.name": userName}, function(err, user) {
		if (err) {
			return next(err)
		}

		if(!user) {
			console.log(userName)
			res.status(401).json({message: "No such user found"})
		}

		if (user) {
			if(bcrypt.compareSync(password, user.local.password)) {
				var payload = {id: user.id}
				var token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1d' } )
				res.json({token: token})
			}
			else {
				res.status(401).json({message: "passwords did not match"})
			}
		} 
		next()
	})
})

router.get('/success', function(req, res, next) {
	res.status(200).json({ message: "Signed up successful"})
})

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/api/success',
	failureRedirect: '/api/signup'
}))

router.basePath = '/api'

router.use(passport.authenticate('jwt', { session: false }))
router.use(messagesController.basePath, messagesController)
router.use(userController.basePath, userController)
router.use('/', function(req, res) {
	res.json({message: "Not allowed"})
})

module.exports = router