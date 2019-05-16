const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { WEBSTER_KEY } = process.env;

module.exports = class DefineCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'define',
			aliases: ['dictionary', 'webster'],
			group: 'search',
			memberName: 'define',
			description: 'Defines a word.',
			credit: [
				{
					name: 'Merriam-Webster\'s Collegiate® Dictionary',
					url: 'https://dictionaryapi.com/products/api-collegiate-dictionary'
				}
			],
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to look up?',
					type: 'string',
					parse: word => encodeURIComponent(word)
				}
			]
		});
	}

	async run(msg, { word }) {
		try {
			const { body } = await request
				.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
				.query({ key: WEBSTER_KEY });
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			return msg.say(stripIndents`
				**${data.stems[0]}** (${data.fl})
				${data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
