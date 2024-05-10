const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class JeopardyQuestionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jeopardy-question',
			aliases: ['clue-card', 'jeopardy-clue-card', 'jeopardy-clue'],
			group: 'edit-image-text',
			memberName: 'jeopardy-question',
			description: 'Sends a Jeopardy Question with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Jeopardy',
					url: 'https://www.jeopardy.com/',
					reason: 'Original Show'
				},
				{
					name: 'OPTIFONT',
					url: 'http://opti.netii.net/',
					reason: 'Korinna Agency Font',
					reasonURL: 'https://fontmeme.com/fonts/korinna-agency-font/'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { text }) {
		const attachment = this.client.registry.commands.get('jeopardy').generateClueCard(text);
		return msg.say({ files: [{ attachment, name: 'jeopardy-question.png' }] });
	}
};
