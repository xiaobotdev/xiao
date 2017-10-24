const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class KillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kill',
			group: 'roleplay',
			memberName: 'kill',
			description: 'Kills a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	run(msg, { user }) {
		return msg.say(stripIndents`
			_**${msg.author.username}** kills **${user.username}**._
			https://i.imgur.com/KqWkaTf.gif
		`);
	}
};
