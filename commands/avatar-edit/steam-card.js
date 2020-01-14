const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SteamCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-card',
			aliases: ['valve-card'],
			group: 'avatar-edit',
			memberName: 'steam-card',
			description: 'Draws a user\'s avatar on a Steam Trading Card.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Steam',
					url: 'https://store.steampowered.com/',
					reason: 'Original Design',
					reasonURL: 'https://steamcommunity.com/tradingcards/'
				},
				{
					name: 'SinKillerJ Tachikawa',
					url: 'https://www.deviantart.com/sinkillerj',
					reason: 'Template',
					reasonURL: 'https://www.deviantart.com/sinkillerj/art/Steam-Trading-Card-Template-GIMP-372156984'
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
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-card.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = '#feb2c1';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(avatar, 12, 19, 205, 205);
			ctx.drawImage(base, 0, 0);
			ctx.font = '14px Noto';
			ctx.fillStyle = 'black';
			ctx.fillText(user.username, 16, 25);
			ctx.fillStyle = 'white';
			ctx.fillText(user.username, 15, 24);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-card.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
