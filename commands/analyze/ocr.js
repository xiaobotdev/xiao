const Command = require('../../structures/Command');
const { createWorker } = require('tesseract.js');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class OcrCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ocr',
			aliases: ['tesseract', 'optical-character-recognition'],
			group: 'analyze',
			memberName: 'ocr',
			description: 'Performs Optical Character Recognition on an image.',
			throttling: {
				usages: 1,
				duration: 60
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to perform OCR on?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		if (image.toLowerCase().endsWith('.gif')) return msg.reply('I cannot read text from GIF images.');
		await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
		const worker = createWorker();
		await worker.load();
		await worker.loadLanguage('eng');
		await worker.initialize('eng');
		let timedOut = false;
		setTimeout(async () => {
			timedOut = false;
			await worker.terminate();
		}, 30000);
		const { data: { text } } = await worker.recognize(image);
		if (timedOut) {
			await reactIfAble(res, res.author, FAILURE_EMOJI_ID, '❌');
			return msg.reply('Scanning took longer than 30 seconds, so I\'ve given up.');
		}
		await worker.terminate();
		await reactIfAble(msg, this.client.user, SUCCESS_EMOJI_ID, '✅');
		if (!text) return msg.reply('There is no text in this image.');
		if (text.length > 2000) {
			return msg.reply('The result was over 2000 characters, so here\'s a TXT file.', {
				files: [{ attachment: Buffer.from(text), name: 'ocr.txt' }]
			});
		}
		return msg.reply(text);
	}
};
