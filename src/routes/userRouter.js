const userController = require('../controller/userController');

const isAuth = require('../middleware/authMiddleWare')

module.exports = (app) =>{
	app.get('/user', isAuth,  userController.getUser);
	app.get('/user/:email', isAuth, userController.getMe);
	app.post('/user', userController.createUser);
	app.post('/user/verifyEmail/', userController.verifyEmail);
	app.post('/user/update', isAuth, userController.updateUser);
	app.post('/user/login/', userController.login);
	app.post('/user/deactivate/', userController.deactivateUser);
	app.delete('/user/:id', isAuth, userController.deleteUser);
}