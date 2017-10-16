'use strict'

let io = null
var mongoose = require('mongoose')
var Message = mongoose.model('Message')

module.exports = {
	init: function(http) {
		io = new require('socket.io').listen(http)

		io.on('connection', function(socket) {
			console.log('connect')
		})

		io.on('message', function(message) {
			console.log(message)
		})
	},
	sendMessage: function(message) {
		const data = {
			user: message.user,
			message: message.message
		}

		io.emit('message', data)
	},
	deleteMessage: function() {
		io.emit('delete-message')
	}
}