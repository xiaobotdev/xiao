const Command = require('../../structures/Command');
const request = require('node-superfetch');
const moment = require('moment');

module.exports = class NewspaperCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'newspaper',
			group: 'image-edit',
			memberName: 'newspaper',
			description: 'Creates a fake newspaper with the headline and body of your choice.',
			credit: [
				{
					name: 'The Newspaper Clipping Generator',
					url: 'https://www.fodey.com/generators/newspaper/snippet.asp',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'headline',
					prompt: 'What do you want the headline to be?',
					type: 'string',
					max: 20
				},
				{
					key: 'body',
					prompt: 'What should the body of the article be?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { headline, body }) {
		try {
			const { text } = await request
				.post('https://www.fodey.com/generators/newspaper/snippet.asp')
				.attach('name', 'The Daily Whatever')
				.attach('date', moment().format('dddd, MMMM D, YYYY'))
				.attach('headline', headline)
				.attach('text', body);
			const newspaperURL = text.match(/<img src="(https:\/\/r[0-9]+\.fodey\.com\/[0-9]+\/.+\.jpg)"/i)[1];
			return msg.channel.send({ files: [newspaperURL] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
