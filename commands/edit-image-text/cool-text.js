const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { Agent } = require('https');
const { list } = require('../../util/Util');
const fonts = require('../../assets/json/cool-text');
const noRejectAgent = new Agent({ rejectUnauthorized: false });

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
			const { body, text: content } = await request
				.post('https://cooltext.com/PostChange')
				.attach({
					...fonts[font],
					Text: text
				});
			if (!content) return msg.say('Failed to create an image with this text.');
			const { body: imageBody } = await request.get(body.renderLocation, { agent: noRejectAgent });
			const format = body.isAnimated ? 'gif' : 'png';
			return msg.say({ files: [{ attachment: imageBody, name: `${font}.${format}` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
