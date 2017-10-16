var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	date = new Date()

var messageSchema = new Schema({
	message: { type: String, required: true },
	user: { type: String, ref: 'User', required: true },
	time : { type : String, default: new Date().getHours() + ':' + new Date().getMinutes() }
})

messageSchema.statics.findSingle = async function(messageId) {
	return this.findOne({ _id: messageId})
}

messageSchema.statics.findMessageByUser = async function(userId) {
	return this.find({ user: userId})
}

messageSchema.statics.findAll = async function() {
	return await this.find({})
		.exec()
}

messageSchema.methods.notifyMessageSent = function() {
	const socket = require('../socket')
	socket.sendMessage(this)
}

messageSchema.methods.notifyMessageDeleted = function() {
	const socket = require('../socket')
	socket.deleteMessage(this)
}

module.exports = mongoose.model('Message', messageSchema)