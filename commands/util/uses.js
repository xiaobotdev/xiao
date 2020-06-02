const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { embedURL } = require('../../util/Util');

module.exports = class UsesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uses',
			group: 'util',
			memberName: 'uses',
			description: 'Responds with a command\'s usage stats.',
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the uses of?',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		if (command.uses === undefined) return msg.say('This command\'s usage stats aren\'t being tracked.');
		return msg.say(`The \`${command.name}\` command has been used **${command.uses}** times.`);
	}
};
