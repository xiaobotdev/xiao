const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const { list } = require('../../util/Util');
const reasons = ['bug', 'feedback', 'suggestion', 'abuse'];
const reasonColors = ['RED', 'GREEN', 'YELLOW', 'ORANGE'];
const displayReasons = ['🐛 Bug Report', '📬 Feedback', '❓ Suggestion', '⚠️ Abuse'];

module.exports = class ReportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'report',
			aliases: ['bug', 'report-bug', 'feedback', 'contact', 'suggest', 'suggestion', 'abuse', 'report-abuse'],
			group: 'util-public',
			memberName: 'report',
			description: 'Reports something to the bot owner(s).',
			guarded: true,
			args: [
				{
					key: 'reason',
					prompt: `What is the reason for your report? Either ${list(reasons, 'or')}.`,
					type: 'string',
					oneOf: reasons,
					parse: reason => reasons.indexOf(reason.toLowerCase())
				},
				{
					key: 'message',
					prompt: 'What is the message of your report? If you are reporting abuse, be sure to include IDs.',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { reason, message }) {
		const embed = new MessageEmbed()
			.setDescription(message)
			.setTitle(displayReasons[reason])
			.setAuthor(msg.author.tag)
			.setFooter(`ID: ${msg.author.id}`)
			.setTimestamp()
			.setColor(reasonColors[reason]);
		const channel = await this.client.fetchReportChannel();
		if (channel) {
			try {
				await channel.send({ embed });
			} catch {
				await this.sendOwnerDM(embed);
			}
		} else {
			await this.sendOwnerDM(embed);
		}
		return msg.say(`${displayReasons[reason]} sent! Thank you!`);
	}

	async sendOwnerDM(embed) {
		for (const owner of this.client.owner) {
			try {
				await this.client.users.cache.get(owner).send({ embed });
			} catch {
				continue;
			}
		}
		return null;
	}
};
