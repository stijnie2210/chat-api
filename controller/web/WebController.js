var express = require('express'),
	router = require('express').Router(),
	passport = require('passport'),
	messageController = require('./MessageController'),
	userController = require('./UserController')


function isAuth(req, res, next) {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/web/login')
	}
}

router.get('/', function(req, res, next) {
	if(req.isAuthenticated()) {
		res.render('home.ejs', { user: req.user.local.name })
	} else {
		res.redirect('/web/login')
	}
})

router.get('/login', function(req, res) {
	res.render('login.ejs', { message: req.flash('loginMessage')})
})

router.get('/signup', function(req, res) {
	res.render('signup.ejs', { message: req.flash('signupMessage') })
})

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/web',
	failureRedirect: '/web/login',
	failureFlash: true
}))

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/web',
	failureRedirect: '/web/signup',
	failureFlash: true
}))

router.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/web/login')
})

router.get('/404', function(req, res) {
	if(req.isAuthenticated()) {
		res.render('notfound.ejs')
	} else {
		res.redirect('/web/login')
	}
})

router.basePath = '/web'

router.use(isAuth)
router.use(messageController.basePath, messageController)
router.use(userController.basePath, userController)
router.use(passport.authenticate('local-login', {
	successRedirect: '/web',
	failureRedirect: '/web/404',
	failureFlash: false
}))


module.exports = router