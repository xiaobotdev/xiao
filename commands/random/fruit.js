const { Command } = require('discord.js-commando');
const fruits = require('../../assets/json/fruit');

module.exports = class FruitCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fruit',
			group: 'random',
			memberName: 'fruit',
			description: 'Responds with a random fruit.'
		});
	}

	run(msg) {
		return msg.say(fruits[Math.floor(Math.random() * fruits.length)]);
	}
};
