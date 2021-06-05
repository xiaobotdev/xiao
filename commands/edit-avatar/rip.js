const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { greyscale } = require('../../util/Canvas');

module.exports = class RipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rip',
			aliases: ['grave', 'grave-stone', 'rest-in-peace'],
			group: 'edit-avatar',
			memberName: 'rip',
			description: 'Draws a user\'s avatar over a gravestone.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'vician',
					url: 'https://www.123rf.com/profile_vician',
					reason: 'Image',
					reasonURL: 'https://www.123rf.com/profile_vician?mediapopup=13181623'
				},
				{
					name: 'Iconian Fonts',
					url: 'https://www.fontspace.com/iconian-fonts',
					reason: 'Coffin Stone Font',
					reasonURL: 'https://www.fontspace.com/coffin-stone-font-f40998'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				},
				{
					key: 'cause',
					label: 'cause of death',
					prompt: 'What was the cause of death?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { user, cause }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rip.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 194, 399, 500, 500);
			greyscale(ctx, 194, 399, 500, 500);
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
			ctx.font = this.client.fonts.get('CoffinStone.otf').toCanvasString(62);
			ctx.fillStyle = 'black';
			ctx.fillText(user.username, 438, 330, 500);
			ctx.fillStyle = 'white';
			if (cause) ctx.fillText(cause, 438, 910, 500);
			ctx.font = this.client.fonts.get('CoffinStone.otf').toCanvasString(37);
			ctx.fillText('In Loving Memory of', 438, 292);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
