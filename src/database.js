const mongoose = require("mongoose");
const config = require("../config");

mongoose.connect(config.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

module.exports = () => mongoose.connection.close();