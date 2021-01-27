const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { shortenText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SteamNowPlayingClassicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-now-playing-classic',
			aliases: ['now-playing-classic', 'steam-now-playing-c', 'now-playing-c'],
			group: 'edit-avatar',
			memberName: 'steam-now-playing-classic',
			description: 'Draws a user\'s avatar over a Steam "now playing" notification (old skin).',
			throttling: {
				usages: 1,
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
			const base = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'steam-now-playing-classic.png')
			);
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 21, 21, 32, 32);
			ctx.fillStyle = '#90ba3c';
			ctx.font = '10px Noto';
			ctx.fillText(user.username, 63, 26);
			ctx.fillText(shortenText(ctx, game, 160), 63, 54);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-now-playing-classic.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
