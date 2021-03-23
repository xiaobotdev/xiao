const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sip',
			aliases: ['tea', 'sip-tea'],
			group: 'edit-avatar',
			memberName: 'sip',
			description: 'Draws a user\'s avatar sipping tea.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'CoolClips.com',
					url: 'http://search.coolclips.com/',
					reason: 'Image',
					reasonURL: 'http://search.coolclips.com/m/vector/hand0007/Hands-holding-mug/'
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
					key: 'direction',
					prompt: 'What direction should the avatar face? Either right or left.',
					type: 'string',
					oneOf: ['left', 'right'],
					default: 'left',
					parse: direction => direction.toLowerCase()
				}
			]
		});
	}

	async run(msg, { user, direction }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sip.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillRect(0, 0, base.width, base.height);
			if (direction === 'right') {
				ctx.translate(base.width, 0);
				ctx.scale(-1, 1);
			}
			ctx.drawImage(avatar, 0, 0, 512, 512);
			if (direction === 'right') ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sip.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
