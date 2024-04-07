const Command = require('../../framework/Command');
const { EmbedBuilder } = require('discord.js');
const reasons = ['bug', 'feedback', 'suggestion', 'abuse'];
const reasonColors = ['Red', 'Green', 'Yellow', 'Orange'];
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
					type: 'string',
					oneOf: reasons,
					parse: reason => reasons.indexOf(reason.toLowerCase())
				},
				{
					key: 'message',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { reason, message }) {
		const embed = new EmbedBuilder()
			.setDescription(message)
			.setTitle(displayReasons[reason])
			.setAuthor({ name: msg.author.tag })
			.setFooter({ text: `ID: ${msg.author.id}` })
			.setTimestamp()
			.setColor(reasonColors[reason]);
		const channel = await this.client.fetchReportChannel();
		if (channel) {
			try {
				await channel.send({ embeds: [embed] });
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
				await this.client.users.cache.get(owner).send({ embeds: [embed] });
			} catch {
				continue;
			}
		}
		return null;
	}
};
