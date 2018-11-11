var express = require('express'),
	cors = require('cors')
	app = express(),
	http = require('http'),
	mongoose = require('mongoose'),
	mongoose.Promise = global.Promise,
	bodyParser = require('body-parser'),
	passport = require('passport'),
	passportLocal = require('passport-local'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	flash = require('connect-flash')

require('json-env')('env.json')

const DATABASE_USER = process.env.DATABASE_USER && process.env.DATABASE_USER + '@' || ''
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost/chat-api'
const PORT = process.env.PORT || 3000

mongoose.connect('mongodb://' + DATABASE_USER + DATABASE_HOST)

app.set('view engine', 'ejs')

// Configure app

app.use(session({ secret: '342ee2ced6c09fb0e0afbd08f2f43a9e', resave: true, saveUninitialized: true}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(flash())

require('./model/User')
require('./model/Message')
require('./model/Chat')

// Configure passport

var passportconfig = require('./passport/passport')

var apiController = require('./controller/api/ApiController')
var webController = require('./controller/web/WebController')

// Set public directories

app.use('/scripts', express.static(__dirname + '/node_modules/bulma/css'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/socket', express.static(__dirname + '/socket'))

// Configure CORS

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE')
	res.header("Access-Control-Allow-Credentials", true)
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	res.header("Access-Control-Request-Method", "*")

	if ('OPTIONS' == req.method) {
		res.sendStatus(200)
	}
	else {
		next()
	}
}

app.use(allowCrossDomain)

app.use(webController.basePath, webController)
app.use(apiController.basePath, apiController)

app.get('/', function(req, res) {
	switch(req.headers['content-type']) {
		case 'application/json':
		res.status(401).json({ message: "Not allowed"})
		break
		default:
		res.redirect('/web')
		break
	}
})

// Initialize socket.io

const server = http.createServer(app)

const socket = require('./socket')
socket.init(server)

server.listen(PORT, function() {
	console.log('App is listening on port ' + PORT)
})

module.exports = app