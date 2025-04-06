const express = require('express');
const { Sequelize } = require('sequelize');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express()
const path = require('path');
const servUser = require('./server/user.js');
const port = 3000

const sequelize =  new Sequelize({
	dialect: 'sqlite',
	storage: 'database.db'
});

const User = require('./models/user')(sequelize);
const Machine = require('./models/machine')(sequelize);
const Reservation = require('./models/reservation')(sequelize);

Reservation.belongsTo(Machine, { foreignKey: 'machine_id', allowNull: false });
Reservation.belongsTo(User, { foreignKey: 'user_id', allowNull: false });
Machine.hasMany(Reservation, { foreignKey: 'machine_id' });
User.hasMany(Reservation, { foreignKey: 'user_id' });

async function syncDatabase() {
	try {
		await sequelize.sync();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Error connecting to the database:', error);
	}
}

syncDatabase();

module.exports = {
	sequelize,
	User,
	Machine,
	Reservation,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'some_secret',
	resave: false,
	saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	if (req.session.userID) {
		res.render('main_logged_in', {username: req.session.username});
	} else {
		res.render('main_logged_out');
	}
});

app.get('/login', (_, res) => {
	res.render('login');
});

app.get('/register', (req, res) => {
	// user cannot register when is logged in
	if (req.session.userID) {
		res.redirect('/');
	} else {
		res.render('register');
	}
});

app.post('/register', async (req, res) => {
	servUser.registerUser(req, res, sequelize);
});

app.post('/login', async (req, res) => {
	servUser.loginUser(req, res, sequelize);
});

app.post('/logout', async (req, res) => {
	servUser.logoutUser(req, res);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});