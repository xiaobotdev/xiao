const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { list } = require('../../util/Util');
const { DEVIANTART_ID, DEVIANTART_SECRET } = process.env;
const sections = ['dailydeviations', 'hot', 'newest', 'popular', 'undiscovered'];

module.exports = class DeviantartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deviantart',
			group: 'search',
			memberName: 'deviantart',
			description: 'Responds with an image from a DeviantArt section, with optional query.',
			args: [
				{
					key: 'section',
					prompt: `What section would you like to search? Either ${list(sections, 'or')}.`,
					type: 'string',
					validate: section => {
						if (sections.includes(section.toLowerCase())) return true;
						return `Invalid section, please enter either ${list(sections), 'or'}.`;
					},
					parse: section => section.toLowerCase()
				},
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string',
					default: ''
				}
			]
		});

		this.token = null;
	}

	async run(msg, { section, query }) {
		try {
			if (!this.token) await this.fetchToken();
			const { body } = await snekfetch
				.get(`https://www.deviantart.com/api/v1/oauth2/browse/${section}`)
				.query({
					q: query,
					limit: 120,
					access_token: this.token,
					mature_content: msg.channel.nsfw || false
				});
			const images = body.results.filter(image => image.content && image.content.src);
			if (!images.length) return msg.say('Could not find any results.');
			return msg.say(images[Math.floor(Math.random() * images.length)].content.src);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchToken() {
		const { body } = await snekfetch
			.get('https://www.deviantart.com/oauth2/token')
			.query({
				grant_type: 'client_credentials',
				client_id: DEVIANTART_ID,
				client_secret: DEVIANTART_SECRET
			});
		this.token = body.access_token;
		this.client.setTimeout(() => { this.token = null; }, body.expires_in * 1000);
		return body;
	}
};
