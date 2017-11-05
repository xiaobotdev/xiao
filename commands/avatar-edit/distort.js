const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const { distort } = require('../../util/Canvas');

module.exports = class DistortCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'distort',
			aliases: ['under-water'],
			group: 'avatar-edit',
			memberName: 'distort',
			description: 'Draws a user\'s avatar but distorted.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'level',
					prompt: 'What level of distortion would you like to use?',
					type: 'integer'
				},
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { level, user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 512
		});
		try {
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(avatar.width, avatar.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(avatar, 0, 0);
			distort(ctx, level, 0, 0, avatar.width, avatar.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'distort.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
