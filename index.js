const express = require('express');
const { Sequelize } = require('sequelize');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express()
const path = require('path');
const servUser = require('./server/user.js');
const servAdmin = require('./server/admin.js');
const port = 3000

const sequelize =  new Sequelize({
	dialect: 'sqlite',
	storage: 'database.db'
});

const User = require('./models/user')(sequelize);
const Machine = require('./models/machine')(sequelize);
const Reservation = require('./models/reservation')(sequelize);

Reservation.belongsTo(Machine, { foreignKey: 'machine_id', as: 'machine', allowNull: false });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user', allowNull: false });
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

app.get('/', async (req, res) => {
	if (req.session.userID) {
		const machines = await Machine.findAll();
		if (req.session.isAdmin === 1) {
			res.render('main_logged_in', {username: req.session.username, machines: machines, is_admin: true, show_machines: true});
		} else {
			res.render('main_logged_in', {username: req.session.username, machines: machines, is_admin: false, show_machines: true});
		}
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

app.get('/add-machine', (req, res) => {
	if (req.session.userID != null) {
		if (req.session.isAdmin === 1) {
			res.render('add-machine', {username: req.session.username, is_admin: true, show_machines: false});
		} else {
			res.send("Nie masz praw administratora!");
		}
	} else {
		res.redirect('/');
	}
});

app.get('/machine/:id', (req, res) => {
	//res.send(`Machine id = ${req.params.id}`)
	if (req.session.userID != null) {
		servUser.getMachine(req, res, User, Reservation, Machine);
	} else {
		res.render('main_logged_out');
	}
});

app.get('/machine/:id/reserve', (req, res) => {
	//res.send(`Machine id = ${req.params.id}`)
	if (req.session.userID != null) {
		servUser.getReserveMachine(req, res, Reservation, Machine);
	} else {
		res.redirect('/');
	}
});

app.post('/machine/:id/reserve', (req, res) => {
	//res.send(`Machine id = ${req.params.id}`)
	if (req.session.userID != null) {
		servUser.makeReservation(req, res, Reservation);
	} else {
		res.redirect('/');
	}
});

app.post('/add-machine', (req, res) => {
	if (req.session.userID != null) {
		if (req.session.isAdmin === 1) {
			servAdmin.addMachine(req, res, Machine);
		} else {
			res.send("Nie masz praw administratora!");
		}
	} else {
		res.redirect('/');
	}
});

app.get('/machines-management', async (req, res) => {
	if (req.session.userID != null) {
		if (req.session.isAdmin === 1) {
			const machines = await Machine.findAll();
			res.render('machine_management', {username: req.session.username, is_admin: true, machines: machines, show_machines: false});
		} else {
			res.send("Nie masz praw administratora!");
		}
	} else {
		res.redirect('/');
	}
});

app.put('/machines-management', async (req, res) => {
	if (req.session.userID != null) {
		if (req.session.isAdmin === 1) {
			servAdmin.modifyMachine(req, res, Machine);
		} else {
			res.send("Nie masz praw administratora!");
		}
	} else {
		res.redirect('/');
	}
});

app.delete('/machines-management', async (req, res) => {
	if (req.session.userID != null) {
		if (req.session.isAdmin === 1) {
			servAdmin.deleteMachine(req, res, Machine);
		} else {
			res.send("Nie masz praw administratora!");
		}
	} else {
		res.redirect('/');
	}
});

app.get('/users-management', (req, res) => {
	if (req.session.userID != null) {
		if (req.session.isAdmin === 1) {
			res.send("users management");
		} else {
			res.send("Nie masz praw administratora!");
		}
	} else {
		res.redirect('/');
	}
});

app.get('/my-machines', (req, res) => {
	if (req.session.userID != null) {
		servUser.getMyMachines(req, res, Machine, Reservation);
	} else {
		res.redirect('/')
	}
});

app.delete('/my-machines', (req, res) => {
	if (req.session.userID != null) {
		servUser.deleteReservation(req, res, Reservation);
	} else {
		res.redirect('/')
	}
});

app.get('/account', (req, res) => {
	if (req.session.userID != null) {
		servUser.myAccount(req, res, User);
	} else {
		res.redirect('/')
	}
});

app.put('/account', (req, res) => {
	if (req.session.userID != null) {
		servUser.editAccount(req, res, User);
	} else {
		res.redirect('/')
	}
});

app.post('/register', async (req, res) => {
	servUser.registerUser(req, res, User);
});

app.post('/login', async (req, res) => {
	servUser.loginUser(req, res, User);
});

app.post('/logout', async (req, res) => {
	servUser.logoutUser(req, res);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});