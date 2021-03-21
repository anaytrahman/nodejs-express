const express = require('express');
const app = express();

const port = 6100;

//body req

app.use(express.json());

//database connect
const database = require('./src/config/database.config');
database();

//rotes

const userRouter = require('./src/routes/userRouter');
userRouter(app);

app.get('/', (req, res) => {
	res.json({
		message: "app loaded"
	});
});

app.listen(port, () => {
	console.log(`server started on localhost${port}`);
});