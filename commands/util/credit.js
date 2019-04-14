const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class CreditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'credit',
			group: 'util',
			memberName: 'credit',
			description: 'Responds with a command\'s credits list.',
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the credits list of?',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		if (!command.credit) return msg.say('This command is credited to no one. It just appeared.');
		const embed = new MessageEmbed()
			.setTitle(command.name)
			.setColor(0x7289DA)
			.setDescription(command.credit.map(credit => `[${credit.name}](${credit.url})`).join('\n'));
		return msg.embed(embed);
	}
};
