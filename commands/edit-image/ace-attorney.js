const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { firstUpperCase, list } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Ace-Attorney.ttf'), { family: 'Ace Attorney' });
const characters = {
	phoenix: ['phoenix', 'wright', 'naruhodo', 'ryuuichi', 'ryu', 'nick'],
	edgeworth: ['miles', 'edgeworth', 'mitsurugi', 'reiji', 'edgey'],
	godot: ['godot', 'diego', 'armando', 'souryuu', 'soryu', 'kaminogi'],
	apollo: ['apollo', 'justice', 'odoroki', 'housuke', 'hosuke']
};

module.exports = class AceAttorneyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ace-attorney',
			aliases: [
				'aa',
				'ace-attorney-dialogue',
				'aa-dialogue',
				'ace-attorney-dialog',
				'aa-dialog',
				'ace-attorney-quote',
				'aa-quote'
			],
			group: 'edit-image',
			memberName: 'ace-attorney',
			description: 'Sends a text box from Ace Attorney with the quote and character of your choice.',
			details: `**Characters:** ${Object.keys(characters).join(', ')}`,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Capcom',
					url: 'http://www.capcom.com/us/',
					reason: 'Images, Original "Ace Attorney" Game',
					reasonURL: 'http://www.ace-attorney.com/'
				},
				{
					name: 'Enkidulga',
					url: 'https://www.dafont.com/profile.php?user=736583',
					reason: 'Ace Attorney Font',
					reasonURL: 'https://www.dafont.com/ace-attorney.font'
				}
			],
			args: [
				{
					key: 'character',
					prompt: `What character do you want to use? Either ${list(Object.keys(characters), 'or')}.`,
					type: 'string',
					oneOf: Object.values(characters).reduce((a, b) => a.concat(b)),
					parse: character => {
						for (const [id, arr] of Object.entries(characters)) {
							if (!arr.includes(character.toLowerCase())) continue;
							return id;
						}
						return character.toLowerCase();
					}
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
			path.join(__dirname, '..', '..', 'assets', 'images', 'ace-attorney', `${character}.png`)
		);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '14px Ace Attorney';
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'top';
		ctx.fillText(firstUpperCase(character), 6, 176);
		let text = await wrapText(ctx, quote, 242);
		text = text.length > 5 ? `${text.slice(0, 5).join('\n')}...` : text.join('\n');
		ctx.fillText(text, 7, 199);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: `ace-attorney-${character}.png` }] });
	}
};
