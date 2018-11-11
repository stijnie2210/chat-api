var router = require('express').Router(),
	mongoose = require('mongoose'),
	Message = mongoose.model('Message'),
    User = mongoose.model('User'),
    Chat = mongoose.model('Chat')

router.get('/', async function(req, res, next) {
	var chats = await Chat.findAll()

	res.json(chats)
})

router.get('/:chatId', async function(req, res, next) {
    var chatId = req.params.chatId
    var user = req.body.user
	var chat = await Chat.findSingle(chatId)

	if(!chat) {
		res.sendStatus(400)
	}

	res.json(chat)
})

function pad(n) {
    return n<10 ? '0'+n : n;
}

router.post('/:chatId', async function(req, res, next) {
    var user = req.body.user
    var chatId = req.params.chatId
    var message = req.body.message
    var chat = await Chat.findSingle(chatId)

    if(!chat || !message) {
        res.sendStatus(400)
    }

    try {
        var validUser = await User.findSingleByName(user)
	} catch(err) {
		console.log(err)
    }
    
    if(!validUser) {
        res.send(400, 'No valid user')
    }

    var today = new Date()
	var hours = pad(today.getHours() +1)
	if(hours == 24) hours = "00"
	var minutes = pad(today.getMinutes())

    var newMessage = new Message({user: user, message: message, time: hours + ":" + minutes})

    var savedMessage

    var chatMessages = chat.messages;

    try {
        savedMessage = await newMessage.save()
        console.log(savedMessage)
        if(savedMessage) {
            console.log(savedMessage._id)
            chatMessages.push({userId: validUser.id, message: {id: savedMessage._id, message: savedMessage.message}})
            chat.messages = chatMessages
            await chat.save()
        }
	} catch(err) {
        console.log(err)
    }

    res.json(chat)
})

router.post('/', async function(req, res, next) {
	var message = req.body.message
    var user = req.body.user
    var otherUser = req.body.otherUser

	try {
        var validUser = await User.findSingleByName(user)
	} catch(err) {
		console.log(err)
	}

	if(!validUser) {
		res.json({ "message": "User is not valid!"})
    }

    var validOtherUser
    var newChat

    try {      
        if(otherUser != undefined) {
            validOtherUser = await User.findSingleByName(otherUser)
        }
    } catch(err) {
        console.log(err)
    }

    if(validOtherUser != undefined) {
        newChat = new Chat({userIds: [{ 'id': validUser._id }, { 'id': validOtherUser._id }]})
    } else {
        console.log('oof')
        newChat = new Chat({userIds: { id: validUser._id }})
    }

	try {
        console.log('lol')
        await newChat.save()
        console.log('saved:')
	} catch(err) {
        console.log(err)
	}

	res.json(newChat)
})

router.delete('/:chatId', async function(req, res, next) {
	var chatId = req.params.chatId

	try {
		console.log(messageId)
		await Message.remove({ _id: mongoose.Types.ObjectId(chatId) })
	} catch(e) {
		res.json({ "error": e})
	}

	res.status(200).json({ message: "Chat deleted." })
})

router.basePath = '/chats'

module.exports = router