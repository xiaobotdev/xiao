const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class YodaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoda',
			group: 'edit-text',
			memberName: 'yoda',
			description: 'Converts text to Yoda speak.',
			credit: [
				{
					name: 'The Yoda-Speak Generator',
					url: 'http://www.yodaspeak.co.uk/index.php',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'message',
					label: 'text',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { message }) {
		const data = new URLSearchParams();
		data.append('YodaMe', message);
		const { text } = await request
			.post('http://yodaspeak.co.uk/index.php')
			.send(data, true)
			.set({ 'Content-Type': 'application/x-www-form-urlencoded' });
		const $ = cheerio.load(text);
		return msg.say($('textarea[name="YodaSpeak"]').first().text().trim());
	}
};
