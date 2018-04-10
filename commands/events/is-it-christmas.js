const { Command } = require('discord.js-commando');

module.exports = class IsItChristmasCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'is-it-christmas',
			group: 'events',
			memberName: 'is-it-christmas',
			description: 'Responds with whether or not it\'s Christmas.'
		});
	}

	run(msg) {
		const today = new Date();
		if (today.getMonth() === 11 && today.getDate() === 25) {
			return msg.reply('YES!!!', { files: ['https://i.imgur.com/B1fyMlc.jpg'] });
		}
		return msg.reply('No, not yet...');
	}
};
