var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcryptjs')

var UserSchema = new Schema({
	local: {
		name: { type: String, required: true, unique: true },
		password: { type: String },
		group: { type: String, required: false }
	}
})

UserSchema.statics.findAll = async function() {
	return await this.find({})
		.exec()
}

UserSchema.statics.findSingle = async function(userId) {
	return this.findOne({ _id: userId})
		.exec()
}

UserSchema.statics.findSingleByName = async function(userName) {
	return this.findOne({ 'local.name': userName})
		.exec()
}

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password)
}

mongoose.model('User', UserSchema)