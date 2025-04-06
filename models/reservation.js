const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        date_from: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        date_to: {
          type: DataTypes.DATE,
          allowNull: false,
        },
    });
    return Reservation;
};