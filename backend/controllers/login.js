const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!user) {
        return res
            .status(404)
            .json({ error: 'username does not exist' });
    }

    if (user && !passwordCorrect) {
        return res
            .status(401)
            .json({ error: 'invalid password' });
    }

    const tokenPayload = {
        id: user._id,
        username: user.username
    };

    const token = jwt.sign(
        tokenPayload,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
    );

    res
        .status(200)
        .send({
            token,
            username: user.username,
            name: user.name
        });
});

module.exports = loginRouter;