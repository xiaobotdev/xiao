const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { list } = require('../../util/Util');
const hats = require('../../assets/json/hat');

module.exports = class HatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hat',
			group: 'avatar-edit',
			memberName: 'hat',
			description: 'Draws a hat over a user\'s avatar.',
			details: `**Hats:** ${hats.join(', ')}`,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'ClipArtHut',
					url: 'http://www.cliparthut.com/'
				},
				{
					name: 'PNG Arts',
					url: 'https://www.pngarts.com/'
				},
				{
					name: 'misskatecuttables.com',
					url: 'https://www.misskatecuttables.com/'
				},
				{
					name: 'WorldArtsMe',
					url: 'http://worldartsme.com/'
				},
				{
					name: 'PinClipart',
					url: 'https://www.pinclipart.com/'
				},
				{
					name: 'RedBubble - Akbar Mna',
					url: 'https://www.redbubble.com/en/people/akbarmna/shop'
				},
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/'
				}
			],
			args: [
				{
					key: 'type',
					prompt: `What type of hat would you like to use? Either ${list(hats, 'or')}.`,
					type: 'string',
					oneOf: hats,
					parse: type => type.toLowerCase()
				},
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { type, user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hat', `${type}.png`));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(avatar.width, avatar.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(avatar, 0, 0);
			ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: `${type}-hat.png` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
