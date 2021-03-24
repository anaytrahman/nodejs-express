module.exports = {
	genericMessage: (req, res, resObj) => {
		return res.status(400).json(resObj);
	},
	
	successMessage: (req, res, resObj) => {
		return res.status(200).json(resObj);resObj
	}
}