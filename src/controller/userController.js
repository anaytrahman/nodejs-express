const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = require('../schema/userSchema');

const userUtils = require('../core/userUtils');
const messageUtils = require('../core/messageUtils');

module.exports = {
	getUser: async (req, res) => {
		const showResult = await userSchema.find();
			res.json({
			message: "user loaded",
			data: showResult
		});
	},
	
	getMe: async (req, res) => {
		const email = req.body.email;
		const users = await userUtils.getUsersByEmail(email);
		
		if(users.length > 0) {
			return messageUtils.successMessage(req, res, {
				message: "user confirmed",
				data: users[0]
			});
			
		} else{
			messageUtils.genericMessage(req, res, {
				alert: "this user is not exist"
			})
		}
	},
	
	//user registration 
	createUser: async (req, res) => {
		
	const users = await userUtils.getUsersByEmail(req.body.email);
	
	if(users.length >0) {
		return messageUtils.genericMessage(req, res, {
			message: "this user already in record"
		});

	} else {
		
		const hash = await userUtils.getHashPassword(req.body.password);
		
		const users = new userSchema({
		  name: req.body.name,
          userid: req.body.userid,
          password: hash,
		  email: req.body.email
	});
	
		await users.save((err, showResult) => {
			if(err){
				return messageUtils.genericMessage(req, res, {
					message: err.message
				});
			}
			return messageUtils.successMessage(req, res, {
				message: `hii ${req.body.name}, you have been registered, check your email to get token and verify you`,
				token: "abc1"
			});
			
		});
	
	}
},
//user registration ends


//user update
	updateUser:	async (req, res) => {
			const email = req.user.email;
			
			//user exist or not
				const users = await userUtils.getUsersByEmail(email);
				const hash = await userUtils.getHashPassword(req.body.password);
				console.log(users);
				if(users.length > 0){
					await userSchema.findOneAndUpdate({
						_id: users[0]._id
					}, {
						name: req.body.name,
					//userid: req.body.userid,
					password: hash
					}, (err,showResult) => {
						if(err){
							return messageUtils.genericMessage(req, res, {
								alert: err.message
							});
						}
						return res.json({
							message: `hi ${req.body.name}, your profile has been updated`
						});
					})
				} else{
					return res.json({
					message: "user not exists"
					});
				}
	},
	
	//user update ends
	
	//user delete
	
	deleteUser:	async (req, res) => {
		const id = req.params.id;
		
		//const ObjId = userSchemaObjectId.find();
		
		if(mongoose.Types.ObjectId.isValid(req.params.id)){
			//check user exist or not
			const users = await userUtils.getUsersByEmail(req.user.email);
			
			
			if(users.length > 0 ){
			await userSchema.findOneAndDelete({
				_id: users[0]._id
				}, (err, showResult) => {
				 if(err){
					 return res.json({
						 message: err.message
					 });
				 }
				 
				 return res.json({
					 message: "user has been deleted"
				 });
		 
			});
			
			
			} else {
				return res.json({
					 message: "this user is not exist"
				 });
			}
		} else {
			return res.json({
					 message: "enter your valid id and password"
				 });
			}
		
		},
		 
	
	
	//verify 
	verifyEmail: async (req, res) => {
		//user exist or not
		const users = await userUtils.getUsersByEmail (req.body.email);
		
		if(users.length > 0){
			
			if(!users[0].active) {
				//token verifyEmail
				if(req.body.token == 'abc1'){
					await userSchema.findOneAndUpdate({email: req.body.email}, {
					 active: true	
					}, (err, showResult) => {
						if(err){
							return res.json({
								message: err.message
							});
						}
							return res.json({
							message: `your account has been activated now`
					});
				});
				}
				else{
				return res.json({
					message: `invalid token`
				});
				} 
				
			} else{
				return res.json({
					message: "you are already activated"
				})
			}
				
			}
		
		else{
		return res.json({
			message: "no record found"
			});
		}
		
		
	},
	
	//deactivate user
	
	deactivateUser: async (req, res) => {
		
		//check if user exist or not
		
		const users = await userUtils.getUsersByEmail(req.body.email);
			if(users.length > 0 ){
				
				if(users[0].active) {
					await userSchema.findOneAndUpdate({
						email: req.body.email
					},{
					 active: false
					}, (err, showResult) => {
						if(err){
							return res.json({
								message: err.message
							});
						}
						
						return messageUtils.successMessage(req, res, {
							message: "your account has been deactivate"
						});
					});
				}
				else {
					return messageUtils.successMessage(req, res, {
						message: "you are already deactivate"
					});
				}
			} else {
				return messageUtils.successMessage(req, res, {
						message: "Email doesnt exist"
					});
			}
	},
			
	// login
	login: async (req, res) => {
		//check user exists or not 
		const users = await userUtils.getUsersByEmail(req.body.email);
		
		if(users.length > 0){
			//check if user is activate or not
			
			if(users[0].active){
				
				const isValPassword = bcrypt.compareSync(req.body.password, users[0].password)
				//check password of user
				
				if(isValPassword){
					let playLoad = {email: req.body.email}
					const accessToken = jwt.sign(playLoad, 'mysecretkey', {
						algorithm: "HS256",
						expiresIn: "2h"
					});
					return messageUtils.successMessage(req, res, {
						 message: "user is logged in",
						 token: accessToken
					 })
					
				} else {
					//checking maximum attemp
					
					const currentAttempt = users[0].loginAttempt;
					if(currentAttempt >2) {
						return res.json({
							alert: "your account has been blocked "
						});
					} else {
						let attempt = currentAttempt + 1;
						await userSchema.findOneAndUpdate({
							_id: users[0]._id
						}, {
							loginAttempt: attempt
						});
						
						return res.json({
							message: "email/password is incorrct",
							limit: attempt
						});
					}
					
				}
			} else{
				return res.json({
					message: "user is not activated, check your email"
				});
			}
		} 
		else{
			return res.json({
				message: "user doesnt exist"
			});
		}
	}
		
}

