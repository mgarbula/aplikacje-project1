const { Sequelize } = require('sequelize');

async function registerUser(req, res, sequelize) {
    const User = require('../models/user')(sequelize);
    const {username, email, name, surname, password_hash} = req.body;
    try {
        const existingUser = await User.findOne({where: { [Sequelize.Op.or]: [{ username }, { email }] }});
        if (existingUser) {
            return res.status(409).json({ success: false, error: 'Username albo email już istnieją.' });
        }

        const newUser = await User.create({
            username,
            email,
            name,
            surname,
            is_admin: 0,
            password_hash
        });
        res.status(201).json({ success: true, message: 'Rejestracja powiodła się!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function loginUser(req, res, sequelize) {
    const User = require('../models/user')(sequelize);
    const { username, password_hash } = req.body;
	try {
		const user = await User.findOne({ where: { [Sequelize.Op.or]: [{username}] } });
		if (user && password_hash === user.password_hash) {
			req.session.userID = user.id;
            req.session.username = user.username;
            req.session.isAdmin = user.is_admin;
            res.status(200).json({ success: true, message: 'Zalogowano!' });
		} else {
            res.status(401).json({ success: false, message: 'Invalid username or password!' });
        }
	} catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
}

async function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Błąd serwera' });
        }
        //res.clear
        res.status(200).json({ success: true, message: 'Wylogowano poprawnie!' });
    });
}

module.exports = {registerUser, loginUser, logoutUser};