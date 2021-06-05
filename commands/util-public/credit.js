const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const { embedURL } = require('../../util/Util');

module.exports = class CreditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'credit',
			group: 'util-public',
			memberName: 'credit',
			description: 'Responds with a command\'s credits list.',
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the credits list of?',
					type: 'command'
				},
				{
					key: 'page',
					prompt: 'What page do you want to view?',
					type: 'integer',
					default: 1,
					min: 1
				}
			]
		});
	}

	run(msg, { command, page }) {
		if (!command.credit) return msg.say('This command is credited to no one. It just appeared.');
		const totalPages = Math.ceil(command.credit.length / 10);
		if (page > totalPages) return msg.say(`Page ${page} does not exist (yet).`);
		const embed = new MessageEmbed()
			.setTitle(`${command.name} (Page ${page}/${totalPages})`)
			.setColor(0x7289DA)
			.setDescription(command.credit.slice((page - 1) * 10, page * 10).map(credit => {
				if (!credit.reasonURL) return `${embedURL(credit.name, credit.url)} (${credit.reason})`;
				return `${embedURL(credit.name, credit.url)} (${embedURL(credit.reason, credit.reasonURL)})`;
			}).join('\n'))
			.setFooter(`${command.credit.length} Total Credit${command.credit.length === 1 ? '' : 's'}`);
		return msg.embed(embed);
	}
};
