const Command = require('../../structures/Command');
const { createCanvas, loadImage, parseFont } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class SteamCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-card',
			group: 'avatar-edit',
			memberName: 'steam-card',
			description: 'Draws a user\'s avatar over a Steam card.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
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

	async run(msg, args) {
		const member = args.member || msg.member;
		const avatarURL = member.user.displayAvatarURL({
			format: 'png',
			size: 512
		});
		try {
			parseFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Roboto.ttf'), { family: 'Roboto' });
			const canvas = createCanvas(494, 568);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-card.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 494, 568);
			ctx.drawImage(avatar, 25, 25, 450, 450);
			ctx.drawImage(base, 0, 0);
			ctx.font = '30px Roboto';
			ctx.fillText(member.displayName, 35, 48);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-card.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
