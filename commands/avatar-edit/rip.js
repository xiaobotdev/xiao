const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');
const { greyscale } = require('../../util/Util');

module.exports = class RIPCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rip',
			aliases: ['grave', 'grave-stone'],
			group: 'avatar-edit',
			memberName: 'rip',
			description: 'Draws a user\'s avatar over a gravestone.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 256
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rip.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 158, 51, 200, 200);
			greyscale(ctx, 158, 51, 200, 200);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
