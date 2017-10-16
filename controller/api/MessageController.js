var router = require('express').Router(),
	mongoose = require('mongoose'),
	Message = mongoose.model('Message'),
	User = mongoose.model('User')

router.get('/', async function(req, res, next) {
	var messages = await Message.findAll()

	res.json(messages)
})

router.get('/:messageId', async function(req, res, next) {
	var messageId = req.params.messageId
	var message = await Message.findSingle(messageId)

	if(!message) {
		res.sendStatus(400)
	}

	res.json(message)
})

router.post('/', async function(req, res, next) {
	var message = req.body.message
	var user = req.body.user

	try {
		var validUser = await User.findSingleByName(user)
	} catch(err) {
		console.log(err)
	}

	if(!validUser) {
		res.json({ "message": "User is not valid!"})
	}

	if(!message) {
		res.sendStatus(400)
	}

	var today = new Date()
	var newMessage = new Message({user: user, message: message, time: (today.getHours() + 2) + ':' + today.getMinutes() })

	try {
		await newMessage.save()
	} catch(err) {

	}
	
	newMessage.notifyMessageSent()

	res.json(newMessage)
})

router.delete('/:messageId', async function(req, res, next) {
	var messageId = req.params.messageId

	try {
		console.log(messageId)
		await Message.remove({ _id: mongoose.Types.ObjectId(messageId) })
	} catch(e) {
		res.json({ "error": e})
	}

	res.status(200).json({ message: "Message deleted." })
})

router.basePath = '/messages'

module.exports = router