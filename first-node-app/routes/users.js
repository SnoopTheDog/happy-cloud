const express = require('express');
const router = express.Router();
const debug = require('debug')('first-node-app:users-router'); 
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../src/models/user.model');
const auth = require('../src/handlers/auth'); 

const validationSchema = Joi.object({
	username: Joi.string().alphanum().min(2).max(255).required(),
	password: Joi.string().min(12).max(1024).required()
}); 

router.get('/', auth('admin'), async (req, res) => {
	try
	{
		const users = await User.find(); //.find() returns a promise
		res.send(users);
	}
	catch (e) //e = error
	{
		debug(e);
		res.status(500).end();
	}
	
});

router.post('/login', async (req, res) => {
	try
	{
		const loginSchema = validationSchema.keys({ password: Joi.string().max(1024).required() });		

		await loginSchema.validateAsync(req.body);

		const { body: { username, password } } = req;

		const user = await User.findOne({ username });

		if(!user) return res.status(404).end();
		
		const match = await bcrypt.compare(password, user.password);

		if(!match) return res.status(403).end();

		const token = jwt.sign({ id: user._id, type: user.type }, 'kawaiidesusediiawak');

		res.send({ token });
	}
	catch (e)
	{
		if (e && e.isJoi)
		{
			res.status(400).send({ errors: e.details.map(el => el.message) });
			return;
		}
	}
});

router.post('/', async (req, res) => {
	try
	{
		const registrationSchema = validationSchema.keys({ password_confirmation: Joi.ref('password') });
		await registrationSchema.validateAsync(req.body);

		const user = new User({ 
			username: req.body.username, 
			password: req.body.password, 
		});

		await user.save();
		res.send(user);
	}
	catch (e)
	{
		if(e && e.message && e.message.includes('E11000')) 
		{
			res.status(418).end();
			return;
		}
		else if (e && e.isJoi)
		{
			res.status(400).send({ errors: e.details.map(el => el.message) });
			return;
		}
		debug(e);
		res.status(500).end();
	}
});

router.get('/me', auth('admin', 'pimp', 'pleb'), (req, res) => res.send(req.user));

router.get('/:username', auth('admin'), async (req, res) => {
	const { username } = req.params;
	try
	{
		const user = await User.findOne({ username });
		
		if(!user) res.status(404).send('Not found');
		else res.send(user);
	}
	catch (e)
	{
		debug(e);
		res.status(500).send('Internal error');
	}
});

router.delete('/me', auth('admin', 'pimp', 'pleb'), async (req, res) =>  {
	try
	{
		const { username } = req.params;
		await User.delete({ username });
		res.send(req.user);	
	}
	catch (e)
	{
		debug(e);
		res.status(500).end();
	}
});

router.delete('/:username', auth('admin'), async (req, res) => {
	try
	{
		const { username } = req.params;
		await User.delete({ usernames });
		res.send(req.user);	
	}
	catch (e)
	{
		debug(e);
		res.status(500).end();
	}
});

module.exports = router;