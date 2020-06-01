const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class CursedSpongeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cursed-sponge',
			aliases: ['sponge-snail'],
			group: 'edit-meme',
			memberName: 'cursed-sponge',
			description: 'Sends a cursed sponge duplicated however many times you want.',
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Image, Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
				}
			],
			args: [
				{
					key: 'amount',
					prompt: 'How many times do you want to duplicate the cursed sponge?',
					type: 'integer',
					max: 100,
					min: 1
				}
			]
		});
	}

	async run(msg, { amount }) {
		const sponge = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'cursed-sponge.png'));
		const rows = Math.ceil(amount / 10);
		const canvas = createCanvas(sponge.width * (rows > 1 ? 10 : amount), sponge.height * rows);
		const ctx = canvas.getContext('2d');
		let width = 0;
		for (let i = 0; i < amount; i++) {
			const row = Math.ceil((i + 1) / 10);
			ctx.drawImage(sponge, width, sponge.height * (row - 1));
			if ((width + sponge.width) === (sponge.width * (rows > 1 ? 10 : amount))) width = 0;
			else width += sponge.width;
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'cursed-sponge.png' }] });
	}
};
