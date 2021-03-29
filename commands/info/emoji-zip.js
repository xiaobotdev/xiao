const Command = require('../../structures/Command');
const request = require('node-superfetch');
const JSZip = require('jszip');

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
		const emojis = msg.guild.emojis.cache;
		if (!emojis.size) return msg.say('This server has no custom emoji.');
		const zip = new JSZip();
		await Promise.all(emojis.map(async emoji => {
			const { body } = await request.get(emoji.url);
			const format = emoji.animated ? 'gif' : 'png';
			zip.file(`${emoji.id}.${format}`, body);
		}));
		const zipped = await zip.generateAsync({ type: 'nodebuffer' });
		return msg.say({ files: [{ attachment: zipped, name: 'emoji.zip' }] });
	}
};
