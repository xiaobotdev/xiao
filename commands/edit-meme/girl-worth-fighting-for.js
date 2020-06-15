const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class GirlWorthFightingForCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'girl-worth-fighting-for',
			aliases: ['a-girl-worth-fighting-for', 'ling'],
			group: 'edit-meme',
			memberName: 'girl-worth-fighting-for',
			description: 'Draws an image or a user\'s avatar as the object of Ling\'s affection.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Mulan" Movie',
					reasonURL: 'https://movies.disney.com/mulan'
				},
				{
					name: 'u/SupremeMemesXD',
					url: 'https://www.reddit.com/user/SupremeMemesXD/',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/MemeTemplatesOfficial/comments/8h39vi/girl_worth_fighting_for_template/'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'girl-worth-fighting-for.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = centerImagePart(data, 150, 150, 380, 511);
			ctx.drawImage(data, x, y, width, height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'girl-worth-fighting-for.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
