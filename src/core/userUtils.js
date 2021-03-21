const bcrypt = require('bcrypt');
const saltRounds = 10;
const userSchema = require('../schema/userSchema');
module.exports ={
	getUsersByEmail: async (email) => {
		//check users exists
		const users = await userSchema.find({
			email: email
		});
		return users;
	},
	
	getUserById: async (id) => {
		const users = await userSchema.find({
			_id: id
		});
		return users;
	},
	
	getHashPassword: async (password) => {
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(password, salt);
		return hash;
	}
	
	
}