const { Sequelize } = require('sequelize');
const { getTime, getDate } = require('./time');

async function registerUser(req, res, User) {
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

async function loginUser(req, res, User) {
    const { username, password_hash } = req.body;
	try {
		const user = await User.findOne({ where: { [Sequelize.Op.or]: [{username}] } });
		if (user && password_hash === user.password_hash) {
			req.session.userID = user.id;
            req.session.username = user.username;
            req.session.isAdmin = user.is_admin;
            res.status(200).json({ success: true, message: 'Zalogowano!' });
		} else {
            res.status(401).json({ success: false, error: 'Niepoprawna nazwa użytkownika lub hasło!' });
        }
	} catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
}

async function logout(req, res, message) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Błąd serwera' });
        }
        res.status(200).json({ success: true, message: message });
    });
}

async function logoutUser(req, res) {
    logout(req, res, 'Wylogowano poprawnie!');
}

function resesrvationsDates(reservations) {
    // show only reservations that are not finished yet
    if (reservations.length === 0) {
        return { dates_from: [], dates_to: [], res_filtered: [] };
    }

    const today = getDate(new Date().toString());
    const res_filtered = reservations.filter(r => getDate(r.date_to.toString()) > today);

    res_filtered.sort(function(a, b) {return (a.date_from > b.date_from) ? 1 : (b.date_from > a.date_from) ? -1 : 0})
    const dates_from = res_filtered.map(r => getTime(r.date_from));
    const dates_to = res_filtered.map(r => getTime(r.date_to));

    return { dates_from: dates_from, dates_to: dates_to, res_filtered: res_filtered };
}

async function getMachine(req, res, User, Reservation, Machine) {
    const id = req.params.id;
    try {
        const machine = await Machine.findOne({ where: { [Sequelize.Op.or]: [ {id} ] } });
        const reservations = await Reservation.findAll({
            where: {
                machine_id: id
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
            ],
        });

        const { dates_from, dates_to, res_filtered } = resesrvationsDates(reservations);

        res.render('machine', {
            username: req.session.username,
            machine: machine,
            reservations: res_filtered,
            dates_from: dates_from,
            dates_to: dates_to,
            is_admin: req.session.isAdmin === 1
        });
    } catch (error) {
        console.error('Error during fetching machine:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function getReserveMachine(req, res, Reservation, Machine) {
    const id = req.params.id;
    try {
        const reservations = await Reservation.findAll({
            where: {
                machine_id: id
            }
        });
        const machine = await Machine.findOne({
            where: { id: id }
        });
        const today = new Date();
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        const days = Array.from(
            Array(120).keys()
        ).map(i => getDate(today.addDays(i).toString()));
        
        res.render('reserve', {
            username: req.session.username,
            is_admin: req.session.isAdmin === 1,
            machines: [],
            show_machines: false,
            machine_name: machine.name,
            days: days,
        });
    } catch (error) {
        console.error('Error during fetching reservations:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function makeReservation(req, res, Reservation) {
    const id = req.params.id;
    const { from, to } = req.body;
    try {

        const reservations = await Reservation.findAll({
            where: {
                machine_id: id
            }
        });

        const froms = reservations.map(r =>  getDate(r.date_from.toString()));

        for (f of froms) {
            if (f >= from && f <= to) {
                res.status(401).json({ 
                    success: false,
                    error: "Wybrany zakres dat jest już zajęty",
                });
                return;
            }
        }

        await Reservation.create({
            date_from: new Date(from),
            date_to: new Date(to),
            user_id: req.session.userID,
            machine_id: id,
        });

        res.status(200).json({ success: true, message: 'Rezerwacja udana' });
    } catch (error) {
        console.error('Error during making reservation:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function getMyMachines(req, res, Machine, Reservation) {
    try {
        const reservations = await Reservation.findAll({
            where: {
                user_id: req.session.userID,
            },
            include: [
                {
                    model: Machine,
                    as: 'machine'
                },
            ],
        });

        const { dates_from, dates_to, res_filtered } = resesrvationsDates(reservations);
        res.render('my-machines', {
            username: req.session.username,
            reservations: res_filtered,
            dates_from: dates_from,
            dates_to: dates_to,
            is_admin: req.session.isAdmin === 1
        });
    } catch (error) {
        console.error('Error during fetching my reservations:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function deleteReservation(req, res, Reservation) {
    const { id } = req.body;
    try {
        await Reservation.destroy({
            where: {
                id: id,
            },
        });
        res.status(200).json({ success: true, message: 'Rezerwacja usunięta' });
    } catch (error) {
        console.error('Error during deleting reservation');
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function myAccount(req, res, User) {
    try {
        const me = await User.findOne({
            where: {
                id: req.session.userID,
            },
        });
        res.render('my-account', {
            username: req.session.username,
            me: me,
            is_admin: req.session.isAdmin === 1
        })
    } catch (error) {
        console.error('Error during fetching account:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function editAccount(req, res, User) {
    const {username, email, name, surname, password_hash} = req.body;
    try {
        const user = await User.findOne({
            where: {
                id: req.session.userID,
            },
        });
        const userPass = user.password_hash;
        var passToPut;
        if (password_hash === '') {
            passToPut = userPass;
        } else {
            passToPut = password_hash;
        }

        user.set({
            username: username,
            email: email,
            name: name,
            surname: surname,
            password_hash: passToPut,
        });
        await user.save();
        
        req.session.username = user.username;
        res.status(201).json({ success: true, message: 'Konto zostało zedytowane' });
    } catch (error) {
        console.error('Error during editing account:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function deleteAccount(req, res, User) {
    try {
        await User.destroy({
            where: {
                id: req.session.userID,
            },
        });

        logout(req, res, 'Konto zostało usunięte');
    } catch (error) {
        console.error('Error during deleting account:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMachine,
    getReserveMachine,
    makeReservation,
    getMyMachines,
    deleteReservation,
    myAccount,
    editAccount,
    deleteAccount,
};