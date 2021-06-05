const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { elements, colors } = require('../../assets/json/periodic-table');

module.exports = class PeriodicTableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'periodic-table',
			aliases: ['element', 'p-table'],
			group: 'search',
			memberName: 'periodic-table',
			description: 'Finds an element on the periodic table.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Bowserinator',
					url: 'https://github.com/Bowserinator/',
					reason: 'Periodic Table Data',
					reasonURL: 'https://github.com/Bowserinator/Periodic-Table-JSON'
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
					key: 'element',
					prompt: 'What element do you want to find? You can enter the name, symbol, or atomic number.',
					type: 'string',
					validate: element => {
						const num = Number.parseInt(element, 10);
						if (!Number.isNaN(num) && num >= 0 && num <= elements.length - 1) return true;
						const search = element.toString().toLowerCase();
						if (elements.find(e => e.name.toLowerCase() === search || e.symbol.toLowerCase() === search)) return true;
						return 'Invalid element, please enter a valid element symbol, name, or atomic number.';
					},
					parse: element => {
						const num = Number.parseInt(element, 10);
						if (!Number.isNaN(num)) return elements[num];
						const search = element.toLowerCase();
						return elements.find(e => e.name.toLowerCase() === search || e.symbol.toLowerCase() === search);
					}
				}
			]
		});
	}

	async run(msg, { element }) {
		const canvas = createCanvas(500, 500);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'white';
		ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
		ctx.textAlign = 'center';
		if (element.number === 0) {
			const batman = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'batman.png'));
			ctx.drawImage(batman, 100, 166);
		} else {
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(210);
			ctx.fillStyle = colors[element.phase] || 'gray';
			ctx.fillText(element.symbol, 250, 320);
		}
		ctx.fillStyle = 'black';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(45);
		ctx.fillText(element.number, 250, 100);
		ctx.fillText(element.name, 250, 450);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(30);
		ctx.fillText(element.mass || '?', 250, 400);
		const period = element.number === 0 ? element.period : `period ${element.period}`;
		const phase = element.undiscovered ? `hypothetical ${element.phase || 'element'}` : element.phase;
		return msg.say(
			`**${element.name} (${element.symbol})** is a ${phase} in ${period}.`,
			{ files: [{ attachment: canvas.toBuffer(), name: `${element.name}.png` }] }
		);
	}
};
