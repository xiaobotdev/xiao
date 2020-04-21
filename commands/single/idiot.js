const Command = require('../../structures/Command');
const IDIOT_PAGE_ID = process.env.IDIOT_PAGE_ID || 'Donald_Trump';

module.exports = class IdiotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'idiot',
			aliases: ['moron'],
			group: 'single',
			memberName: 'idiot',
			description: 'Responds with the Wikipedia page of an idiot.',
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reason: 'URL'
				}
			]
		});
	}

	run(msg) {
		return msg.say(`https://en.wikipedia.org/wiki/${IDIOT_PAGE_ID}`);
	}
};
