const { Sequelize } = require('sequelize');

async function addMachine(req, res, Machine) {
    const { name, serial_number, description } = req.body;
    try {
        const existingMachine = await Machine.findOne({ where: { [Sequelize.Op.or]: [ {serial_number} ] } });
        if (existingMachine) {
            return res.status(409).json({ success: false, error: 'Maszyna o tym numerze seryjnym istnieje.' });
        }

        const newMachine = await Machine.create({
            name,
            serial_number,
            description
        });
        res.status(201).json({ success: true, message: 'Maszyna została dodana!' });
    } catch (error) {
        console.error('Error during machine add:', err);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function modifyMachine(req, res, Machine) {
    const { id, name, serial_number, description } = req.body;
    try {
        const machine = await Machine.findOne({ where: { [Sequelize.Op.or]: [ {id} ] } });
        machine.set({
            name: name,
            serial_number: serial_number,
            description: description,
        });
        await machine.save();
        res.status(201).json({ success: true, message: 'Maszyna została zmodyfikowana!' });
    } catch (error) {
        console.error('Error during machine modification:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function deleteMachine(req, res, Machine) {
    const { id } = req.body;
    try {
        await Machine.destroy({
            where: {
                id: id,
            },
        });
        res.status(201).json({ success: true, message: 'Maszyna została usunięta!' });
    } catch (error) {
        console.error('Error during machine deletion:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

async function modifyUser(req, res, User) {
    const { id, is_admin } = req.body;
    try {
        const user = await User.findOne({ where: { [Sequelize.Op.or]: [ {id} ] } });
        user.set({
            is_admin: is_admin,
        });
        await user.save();
        res.status(201).json({ success: true, message: 'Prawa użytkownika zostały zmienione!' });
    } catch (error) {
        console.error('Error during user modification:', error);
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
}

module.exports = {addMachine, modifyMachine, deleteMachine, modifyUser};