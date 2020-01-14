const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class DrakepostingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'drakeposting',
			aliases: ['drake'],
			group: 'meme-gen',
			memberName: 'drakeposting',
			description: 'Draws two user\'s avatars over the "Drakeposting" meme.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Drake',
					url: 'https://drakeofficial.com/',
					reason: 'Original "Hotline Bling" Music Video',
					reasonURL: 'https://youtu.be/uxpDa-c-4Mc'
				}
			],
			args: [
				{
					key: 'nah',
					prompt: 'Which user should be the "nah"?',
					type: 'user'
				},
				{
					key: 'yeah',
					prompt: 'Which user should be the "yeah"?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { nah, yeah }) {
		const nahAvatarURL = nah.displayAvatarURL({ format: 'png', size: 512 });
		const yeahAvatarURL = yeah.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'drakeposting.png'));
			const nahAvatarData = await request.get(nahAvatarURL);
			const nahAvatar = await loadImage(nahAvatarData.body);
			const yeahAvatarData = await request.get(yeahAvatarURL);
			const yeahAvatar = await loadImage(yeahAvatarData.body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(nahAvatar, 512, 0, 512, 512);
			ctx.drawImage(yeahAvatar, 512, 512, 512, 512);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'drakeposting.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
