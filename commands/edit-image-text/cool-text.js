const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const fonts = require('../../assets/json/cool-text');

module.exports = class CoolTextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cool-text',
			group: 'edit-image-text',
			memberName: 'cool-text',
			description: 'Writes text in some cool fonts.',
			details: `**Fonts:** ${Object.keys(fonts).join(', ')}`,
			credit: [
				{
					name: 'Cool Text Graphics Generator',
					url: 'https://cooltext.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'font',
					prompt: `What font do you want to use? Either ${list(Object.keys(fonts), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(fonts),
					parse: font => font.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What text do you want to write?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { font, text }) {
		try {
			const { body } = await request
				.post('https://cooltext.com/PostChange')
				.attach({
					...fonts[font],
					Text: text
				});
			return msg.say({ files: [body.renderLocation] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
