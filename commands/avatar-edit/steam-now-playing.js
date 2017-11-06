const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class SteamNowPlayingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-now-playing',
			aliases: ['now-playing'],
			group: 'avatar-edit',
			memberName: 'steam-now-playing',
			description: 'Draws a user\'s avatar and the game of your choice over a Steam "now playing" notification.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'game',
					prompt: 'Which game would you like the user to be playing?',
					type: 'string'
				},
				{
					key: 'member',
					prompt: 'Which user would you like to be playing the game?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, { game, member }) {
		if (!member) member = msg.member;
		const avatarURL = member.user.displayAvatarURL({
			format: 'png',
			size: 64
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-now-playing.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 21, 21, 32, 32);
			ctx.fillStyle = '#90ba3c';
			ctx.font = '10px Noto';
			ctx.fillText(member.displayName, 63, 26);
			let shorten;
			if (ctx.measureText(game).width > 160) shorten = true;
			while (ctx.measureText(game).width > 160) game = game.substr(0, game.length - 1);
			ctx.fillText(shorten ? `${game}...` : game, 63, 54);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-now-playing.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
