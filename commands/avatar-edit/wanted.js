const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');
const { sepia } = require('../../util/Util');

module.exports = class WantedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wanted',
			aliases: ['wanted-poster'],
			group: 'avatar-edit',
			memberName: 'wanted',
			description: 'Draws a user\'s avatar over a wanted poster.',
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
			size: 512
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wanted.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 150, 360, 430, 430);
			sepia(ctx, 150, 360, 430, 430);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'wanted.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
