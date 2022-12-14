const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
	const { username, name, password } = req.body

	const existingUser = await User.findOne({ username })
	if (existingUser) {
		return res.status(400).json({
			error: 'username must be unique',
		})
	}
	if (username.length < 3) {
		return res.status(400).json({error: 'username should be at least 3 characters long'})
	}
	if (password.length < 3) {
		return res.status(400).json({error: 'password should be at least 3 characters long'})
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash,
	})

	const savedUser = await user.save()

	res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs', {
		title: 1,
		url: 1,
		likes: 1,
	})
	res.json(users)
})

module.exports = usersRouter
