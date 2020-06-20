const Command = require('../../structures/Command');
const { Command: CommandoCommand } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { trimArray, embedURL } = require('../../util/Util');

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
					type: 'command|string'
				}
			]
		});
	}

	run(msg, { command }) {
		if (command instanceof CommandoCommand) {
			if (!command.credit) return msg.say('This command is credited to no one. It just appeared.');
			const embed = new MessageEmbed()
				.setTitle(command.name)
				.setColor(0x7289DA)
				.setDescription(command.credit.map(credit => {
					if (!credit.reasonURL) return `${embedURL(credit.name, credit.url)} (${credit.reason})`;
					return `${embedURL(credit.name, credit.url)} (${embedURL(credit.reason, credit.reasonURL)})`;
				}).join('\n'));
			return msg.embed(embed);
		}
		const cmd = command.toLowerCase();
		const commands = this.client.registry.commands
			.filter(c => c.credit && c.credit.length && c.credit.find(cred => cred.name.toLowerCase().includes(cmd)))
			.map(com => {
				const credit = com.credit.find(cred => cred.name.toLowerCase().includes(cmd));
				if (!credit.reasonURL) return `\`${com.name}\`: ${embedURL(credit.name, credit.url)} (${credit.reason})`;
				return `\`${com.name}\`: ${embedURL(credit.name, credit.url)} (${embedURL(credit.reason, credit.reasonURL)})`;
			});
		if (!commands.length) return msg.say('Could not find any results.');
		const embed = new MessageEmbed()
			.setTitle(cmd)
			.setColor(0x7289DA)
			.setDescription(trimArray(commands, 15).join('\n'));
		return msg.embed(embed);
	}
};
