const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class NASACommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nasa',
			aliases: ['nasa-image'],
			group: 'search',
			memberName: 'nasa',
			description: 'Searches NASA\'s image archive for your query.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://images-api.nasa.gov/search')
				.query({
					q: query,
					media_type: 'image'
				});
			const images = body.collection.items;
			if (!images.length) return msg.say('Could not find any results.');
			const data = images[Math.floor(Math.random() * images.length)];
			return msg.say(shorten(data.data[0].description), { files: [data.links[0].href] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
