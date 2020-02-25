const Command = require('../../structures/Command');
const MessageEmbed = require('../../structures/MessageEmbed');
const { list } = require('../../util/Util');
const reasons = ['bug', 'feedback', 'suggestion'];
const reasonColors = ['red', 'green', 'yellow'];
const displayReasons = ['Bug Report', 'Feedback', 'Suggestion'];

module.exports = class ReportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'report',
			aliases: ['bug', 'report-bug', 'feedback', 'contact', 'suggest', 'suggestion'],
			group: 'util',
			memberName: 'report',
			description: 'Reports something to the bot owner(s).',
			guarded: true,
			clientPermissions: ['EMBED_LINKS'],
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
					prompt: 'What is the message of your report?',
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
			.setTimestamp()
			.setColor(reasonColors[reason]);
		for (const owner of this.client.owners) {
			try {
				await owner.send(embed);
			} catch (err) {
				console.log(err);
				continue;
			}
		}
		return msg.say(`**${displayReasons[reason]}** sent! Thank you!`);
	}
};
