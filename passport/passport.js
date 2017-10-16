var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var jwtStrategy = require('passport-jwt').Strategy
var extractJwt = require('passport-jwt').ExtractJwt
var mongoose = require('mongoose')
var User = mongoose.model('User')
var flash = require('connect-flash')

function exports() {
	local()
	jwt()
}

function local() {

	passport.serializeUser(function(user, done) {
		done(null, user.id)
	})

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user)
		})
	})

	passport.use('local-login', new localStrategy({
		nameField: 'name',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, name, password, done) {

		User.findOne({ 'local.name': name }, function(err, user) {

			if(err)
				return done(err)

			if(!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'))

			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! wrong password.'))

			return done(null, user)
		})
	}))

	passport.use('local-signup', new localStrategy({
		nameField: 'name',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, name, password, done) {
		process.nextTick(function() {

			User.findOne({ 'local.name': name}, function(err, user) {

				if(err) {
					return done(err)
				}

				if(user) {
					return done(null, false, req.flash('signupMessage', 'That user is already taken.'))
				} else {

					var newUser = new User()

					newUser.local.name = name
					newUser.local.password = newUser.generateHash(password)
					newUser.local.group = 'user'

					newUser.save(function(err) {
						if(err) {
							throw err
						}
						return done(null, newUser)
					})
				}
			})
		})
	}))
}

function jwt() {
	var jwtOptions = {}

    jwtOptions.jwtFromRequest = extractJwt.fromAuthHeader()
    jwtOptions.secretOrKey = '342ee2ced6c09fb0e0afbd08f2f43a9e'

	passport.use('jwt', new jwtStrategy(jwtOptions, function(jwt_payload, done) {
		User.findOne({_id: jwt_payload.id}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
            }
        })
	}))
}

module.exports = exports()