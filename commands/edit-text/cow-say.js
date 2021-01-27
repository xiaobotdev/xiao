const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class CowSayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cow-say',
			aliases: ['cow'],
			group: 'edit-text',
			memberName: 'cow-say',
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
					prompt: 'What text would you like the cow to say?',
					type: 'string',
					max: 1000
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			const { body } = await request
				.get('http://cowsay.morecode.org/say')
				.query({
					message: text,
					format: 'json'
				});
			return msg.code(null, body.cow);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
