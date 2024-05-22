const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class CowSayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cow-say',
			aliases: ['cow'],
			group: 'edit-text',
			description: 'Makes a cow say your text.',
			credit: [
				{
					name: 'cowsay Online',
					url: 'http://cowsay.morecode.org/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 1000
				}
			]
		});
	}

	async run(msg, { text }) {
		const { body } = await request
			.get('http://cowsay.morecode.org/say')
			.query({
				message: text,
				format: 'json'
			});
		return msg.code(null, body.cow);
	}
};
