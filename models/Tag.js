const Sequelize = require('sequelize');
const Database = require('../structures/PostgreSQL');

const Tag = Database.db.define('tag', {
	userID: {
		type: Sequelize.STRING,
		allowNull: false
	},
	guildID: {
		type: Sequelize.STRING,
		allowNull: false
	},
	text: {
		type: Sequelize.STRING,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, { timestamps: true });

module.exports = Tag;
