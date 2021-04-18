const Command = require('../../structures/Command');
const request = require('node-superfetch');
const JSZip = require('jszip');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID } = process.env;

module.exports = class EmojiZipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-zip',
			aliases: ['emojis-zip', 'emotes-zip', 'e-zip'],
			group: 'info',
			memberName: 'emoji-zip',
			description: 'Responds with a ZIP file of the server\'s custom emoji.',
			throttling: {
				usages: 1,
				duration: 60
			},
			guildOnly: true
		});
	}

	async run(msg) {
		if (!msg.guild.emojis.cache.size) return msg.say('This server has no custom emoji.');
		const emojis = msg.guild.emojis.cache.filter(emoji => !emoji.animated);
		await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
		const zip = new JSZip();
		await Promise.all(emojis.map(async emoji => {
			const { body } = await request.get(emoji.url);
			const format = emoji.animated ? 'gif' : 'png';
			zip.file(`${emoji.id}.${format}`, body);
		}));
		const zipped = await zip.generateAsync({ type: 'nodebuffer' });
		await reactIfAble(msg, this.client.user, SUCCESS_EMOJI_ID, '✅');
		return msg.say('_Note: Due to file size concerns, animated emoji are not included._', {
			files: [{ attachment: zipped, name: 'emoji.zip' }]
		});
	}
};
