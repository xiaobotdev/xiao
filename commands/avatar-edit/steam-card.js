const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class SteamCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-card',
			aliases: ['valve-card'],
			group: 'avatar-edit',
			memberName: 'steam-card',
			description: 'Draws a user\'s avatar on a Steam Trading Card.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'member',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, { member }) {
		if (!member) member = msg.member;
		const avatarURL = member.user.displayAvatarURL({
			format: 'png',
			size: 512
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-card.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(avatar, 25, 25, 450, 450);
			ctx.drawImage(base, 0, 0);
			ctx.font = '30px Noto';
			ctx.fillText(member.displayName, 35, 48);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-card.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
