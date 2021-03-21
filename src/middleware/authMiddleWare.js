const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1];
		
		const decoded = jwt.verify(token, "mysecretkey");
		req.user = decoded;
		
		next();
		
	} catch (error){
		res.status(401).json({
			message: "you are not a authorized for this",
		});
	}
};