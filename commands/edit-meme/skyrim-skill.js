const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Futura Condensed.ttf'), { family: 'Futura' });

module.exports = class SkyrimSkillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'skyrim-skill',
			aliases: ['skyrim-level', 'skyrim'],
			group: 'edit-meme',
			memberName: 'skyrim-skill',
			description: 'Sends a "Skyrim Skill" meme with the skill and image of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Bethesda',
					url: 'https://bethesda.net/en/dashboard',
					reason: 'Image, Original "The Elder Scrolls V: Skyrim" Game',
					reasonURL: 'https://elderscrolls.bethesda.net/en/skyrim'
				},
				{
					name: 'Fontsgeek',
					url: 'http://fontsgeek.com/',
					reason: 'Futura Condensed Font',
					reasonURL: 'http://fontsgeek.com/fonts/Futura-Condensed-Regular'
				}
			],
			args: [
				{
					key: 'skill',
					prompt: 'What skill should be used?',
					type: 'string',
					max: 10,
					parse: skill => skill.toUpperCase()
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { skill, image }) {
		try {
			const { body } = await request.get(image);
			const base = await loadImage(body);
			const plate = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'skyrim-skill.png'));
			const ratio = base.width / base.height;
			const height = Math.round(plate.width / ratio);
			const canvas = createCanvas(base.width, base.height + height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const fontSize = Math.round(77 / ratio);
			ctx.font = `normal bold ${fontSize}px Futura`;
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 10;
			ctx.strokeText(skill, 189, base.height + 84);
			ctx.fillText(skill, 189, base.height + 84);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'skyrim-skill.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
