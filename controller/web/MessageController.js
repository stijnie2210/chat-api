var router = require('express').Router(),
	mongoose = require('mongoose'),
	Message = mongoose.model('Message'),
	User = mongoose.model('User')

router.get('/', async function(req, res, next) {

	var messages = await Message.findAll()

	res.render('messages.ejs', { user: req.user, messages })
})

router.get('/:messageId', async function(req, res, next) {

	if(req.query._method == 'DELETE') {
		req.method = 'DELETE'

		req.url = req.path
	}
	next()
})

router.post('/', async function(req, res, next) {
	var user = req.user.local.name
	var message = req.body.message

	if(!message) {
		res.sendStatus(400)
	}

	var today = new Date()
	var newMessage = new Message({user: user, message: message, time: (today.getHours() + 2) + ':' + today.getMinutes() })

	await newMessage.save()

	newMessage.notifyMessageSent()

	res.redirect('/web/messages')
})

router.delete('/:messageId', async function(req, res, next) {
	var messageId = req.params.messageId

	try {
		var message = await Message.findSingle(messageId)
		message.notifyMessageDeleted()
		await Message.remove({ _id: mongoose.Types.ObjectId(messageId) })
	} catch(e) {
		console.log(e)
	}

	res.redirect('/web/messages')
})

router.basePath = '/messages'


module.exports = router