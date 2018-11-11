var mongoose = require('mongoose'),
	Schema = mongoose.Schema

var chatSchema = new Schema({
    userIds: [ { id: { type: String, required: true } } ],
	messages: [
        {
            userId: { type: String, required: true },
            message: { 
                id: {
                    type: Schema.Types.ObjectId, 
                    ref: 'Message', 
                    required: true 
                },
                message: {
                    type: String,
                    required: true
                }
            }
        }
    ],
})

chatSchema.statics.findSingle = async function(chatId) {
	return await this.findOne({ _id: chatId})
}

chatSchema.statics.findChatByUser = async function(userId) {
	return await this.find({ userIds: userId})
}

chatSchema.statics.findAll = async function() {
	return await this.find({})
		.exec()
}

module.exports = mongoose.model('Chat', chatSchema)