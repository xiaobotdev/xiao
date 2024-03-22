const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const { list } = require('../../util/Util');
const types = ['reject', 'info', 'approve'];
const typesColors = ['RED', 'YELLOW', 'GREEN'];
const displaytypes = ['❌ Rejected', '❓ Need More Info', '✅ Accepted/Fixed'];

module.exports = class ReportRespondCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'report-respond',
			aliases: ['report-res'],
			group: 'util',
			memberName: 'report-respond',
			description: 'Responds to a submitted report.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to respond to?',
					type: 'user'
				},
				{
					key: 'type',
					prompt: `What is the reason for your report? Either ${list(types, 'or')}.`,
					type: 'string',
					oneOf: types,
					parse: type => types.indexOf(type.toLowerCase())
				},
				{
					key: 'message',
					prompt: 'What response do you want to send?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { user, type, message }) {
		const embed = new MessageEmbed()
			.setDescription(message)
			.setTitle(displaytypes[type])
			.setAuthor(msg.author.tag)
			.setFooter(`ID: ${msg.author.id}`)
			.setTimestamp()
			.setColor(typesColors[type]);
		try {
			await user.send({
				content: 'Your report has been evaluated with the following message:',
				embeds: [embed]
			});
			return msg.say(`${displaytypes[type]} sent to ${user.tag}.`);
		} catch {
			return msg.say(`Could not send ${displaytypes[type]} to ${user.tag}. Probably blocked me.`);
		}
	}
};
