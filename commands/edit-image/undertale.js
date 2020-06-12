const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { list } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');
const characters = require('../../assets/json/undertale');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'DeterminationMono.ttf'), {
	family: 'DeterminationMono'
});
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'UndertalePapyrus.ttf'), {
	family: 'UndertalePapyrus'
});
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'UndertaleSans.ttf'), { family: 'UndertaleSans' });

module.exports = class UndertaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'undertale',
			aliases: [
				'ut',
				'undertale-dialogue',
				'ut-dialogue',
				'undertale-dialog',
				'ut-dialog',
				'undertale-quote',
				'ut-quote'
			],
			group: 'edit-image',
			memberName: 'undertale',
			description: 'Sends a text box from Undertale with the quote and character of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'UNDERTALE',
					url: 'https://undertale.com/',
					reason: 'Original Game'
				},
				{
					name: 'Demirramon',
					url: 'https://www.demirramon.com/',
					reason: 'Images',
					reasonURL: 'https://www.demirramon.com/en/generators/undertale_text_box_generator'
				},
				{
					name: 'Carter Sande',
					url: 'https://gitlab.com/cartr',
					reason: 'Fonts',
					reasonURL: 'https://gitlab.com/cartr/undertale-fonts/tree/master'
				},
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'character',
					prompt: `What character do you want to use? Either ${list(characters, 'or')}.`,
					type: 'string',
					oneOf: characters,
					parse: character => character.toLowerCase()
				},
				{
					key: 'quote',
					prompt: 'What should the character say?',
					type: 'string',
					max: 250
				}
			]
		});
	}

	async run(msg, { character, quote }) {
		const base = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'undertale', `${character}.png`)
		);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		let font;
		switch (character) {
			case 'sans': font = 'UndertaleSans'; break;
			case 'papyrus': font = 'UndertalePapyrus'; break;
			default: font = 'DeterminationMono'; break;
		}
		ctx.font = `31px ${font}`;
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'top';
		let text = await wrapText(ctx, quote, 385);
		text = text.length > 3 ? `${text.slice(0, 3).join('\n')}...` : text.join('\n');
		ctx.fillText(text, 175, 20);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: `undertale-${character}.png` }] });
	}
};
