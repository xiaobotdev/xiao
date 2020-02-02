const Command = require('../../structures/Command');
const request = require('node-superfetch');
const moment = require('moment');

module.exports = class FrinkiacCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frinkiac',
			aliases: ['the-simpsons', 'simpsons', 'simpson'],
			group: 'search',
			memberName: 'frinkiac',
			description: 'Input a line from the Simpsons to get the episode/season.',
			credit: [
				{
					name: 'Frinkiac',
					url: 'https://frinkiac.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What line would you like to look up?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://frinkiac.com/api/search')
				.query({ q: query });
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const url = `https://frinkiac.com/caption/${data.Episode}/${data.Timestamp}`;
			const [, season, episode] = data.Episode.match(/S([0-9]+)E([0-9]+)/i);
			const time = moment.duration(data.Timestamp).format();
			return msg.say(
				`I think this is from **Season ${season} Episode ${episode} @ ${time}**.`,
				{ files: [`https://frinkiac.com/img/${data.Episode}/${data.Timestamp}.jpg`] }
			);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
