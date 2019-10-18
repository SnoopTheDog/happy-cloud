const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { __v:true } });
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 255
	},
	password: {
		type: String,
		required: true,
		hide: true,
		minlength: 50,
		maxlength: 72,
		set: value => bcrypt.hashSync(value, 10)
	},
	type: {
		type: String,
		enum: [ 'admin', 'pimp', 'pleb' ], //admin => admin, pimp => rw, pleb => r 
		default: 'pleb'
	}
}, 
{ timestamps: true });

schema.plugin(mongooseHidden);

module.exports = mongoose.model("users", schema);