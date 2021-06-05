const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class ThisForThatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'this-for-that',
			aliases: ['its-this-for-that'],
			group: 'random-res',
			memberName: 'this-for-that',
			description: 'So, basically, it\'s like a bot command for this dumb meme.',
			credit: [
				{
					name: 'Wait, what does your startup do?',
					url: 'http://itsthisforthat.com/',
					reason: 'API',
					reasonURL: 'http://itsthisforthat.com/api.php'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('http://itsthisforthat.com/api.php?json');
			const body = JSON.parse(text);
			return msg.say(`So, basically, it's like a ${body.this} for ${body.that}.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
