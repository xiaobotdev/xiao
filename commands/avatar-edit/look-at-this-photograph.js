const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class LookAtThisPhotographCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'look-at-this-photograph',
			aliases: ['photo', 'nickelback'],
			group: 'avatar-edit',
			memberName: 'look-at-this-photograph',
			description: 'Draws a user\'s avatar over Nickelback\'s photograph.',
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
			const canvas = createCanvas(620, 349);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'look-at-this-photograph.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(base, 0, 0);
			ctx.rotate(-13.5 * (Math.PI / 180));
			ctx.drawImage(avatar, 280, 225, 175, 125);
			ctx.rotate(13.5 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'look-at-this-photograph.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
