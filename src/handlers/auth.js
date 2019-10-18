const debug = require('debug')('first-node-app:auth');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const User = require('../models/user.model');

const auth = (...authorizedAccountTypes) => async (req, res, next) => {
	
	const { headers } = req;

	if(!headers.hasOwnProperty('authorization'))
	{
		res.status(403).end();
		return;
	}

	const { authorization } = headers;
	const [ type, token ] = authorization.split(' ');

	if(type.toLowerCase() !== 'bearer') return res.status(403).end();

	const tokenVerPromise = new Promise((resolve, reject) => {
		jwt.verify(token, 'kawaiidesusediiawak', (err, decoded) => {
			if(err) reject(err);
			else resolve(decoded);
		});
	}); 

	try
	{
		const { id, type } = await tokenVerPromise;

		const accountTypes = authorizedAccountTypes.filter(accountType => typeof accountType === 'string');
		const middleware = authorizedAccountTypes.filter(accountType => typeof accountType === 'function');

		const isAuthorized = accountTypes.includes(type) && _.every(middleware, callback => callback(req));

		if(await User.countDocuments({ _id: id }) < 1)
		{
			res.status(403).send('Unauthorized');
			return;
		}

		req.user = await User.findById(id);

		next();
	}
	catch (err)
	{
		debug(err);
		res.status(500).end();
	}
}

module.exports = auth; 