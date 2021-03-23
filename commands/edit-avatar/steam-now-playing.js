const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { shortenText } = require('../../util/Canvas');

module.exports = class SteamNowPlayingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-now-playing',
			aliases: ['now-playing'],
			group: 'edit-avatar',
			memberName: 'steam-now-playing',
			description: 'Draws a user\'s avatar over a Steam "now playing" notification.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Steam',
					url: 'https://store.steampowered.com/',
					reason: 'Original Design'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'game',
					prompt: 'Which game would you like the user to be playing?',
					type: 'string'
				},
				{
					key: 'user',
					prompt: 'Which user would you like to be playing the game?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { game, user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 64 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-now-playing.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 26, 26, 41, 42);
			ctx.fillStyle = '#90b93c';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(14);
			ctx.fillText(user.username, 80, 34);
			ctx.fillText(shortenText(ctx, game, 200), 80, 70);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-now-playing.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
