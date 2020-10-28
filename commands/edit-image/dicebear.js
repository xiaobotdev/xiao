const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const { list } = require('../../util/Util');
const emotions = ['happy', 'sad', 'surprised'];

module.exports = class DicebearCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dicebear',
			aliases: ['dicebear-avatar'],
			group: 'edit-image',
			memberName: 'dicebear',
			description: 'Creates a DiceBear avatar based on the text you provide.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 10
			},
			credit: [
				{
					name: 'DiceBear Avatars',
					url: 'https://avatars.dicebear.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'gender',
					prompt: 'What gender do you want to use? Either male or female.',
					type: 'string',
					oneOf: ['male', 'female'],
					parse: gender => gender.toLowerCase()
				},
				{
					key: 'emotion',
					prompt: `What emotion should the avatar display? Either ${list(emotions, 'or')}.`,
					type: 'string',
					oneOf: emotions,
					parse: emotion => emotion.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What text should be used for generation?',
					type: 'string',
					parse: text => encodeURIComponent(text)
				}
			]
		});
	}

	async run(msg, { gender, emotion, text }) {
		try {
			const { body } = await request
				.get(`https://avatars.dicebear.com/api/${gender}/${text}.svg`)
				.query({
					width: 285,
					height: 285,
					'mood[]': emotion
				});
			const canvas = createCanvas(285, 285);
			const ctx = canvas.getContext('2d');
			const img = await loadImage(body);
			ctx.drawImage(img, 0, 0, 285, 285);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'dicebear.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
