const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { TWITCH_ID, TWITCH_SECRET } = process.env;

module.exports = class TwitchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'twitch',
			group: 'search',
			memberName: 'twitch',
			description: 'Responds with information on a Twitch user.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Twitch',
					url: 'https://www.twitch.tv/',
					reason: 'API',
					reasonURL: 'https://dev.twitch.tv/'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to get information on?',
					type: 'string'
				}
			]
		});

		this.token = null;
	}

	async run(msg, { user }) {
		try {
			if (!this.token) await this.fetchToken();
			const { body } = await request
				.get('https://api.twitch.tv/helix/search/channels')
				.set({
					Authorization: `Bearer ${this.token}`,
					'client-id': TWITCH_ID
				})
				.query({
					query: user,
					first: 1
				});
			if (!body.data.length) return msg.say('Could not find any results.');
			const data = body.data[0];
			const embed = new MessageEmbed()
				.setColor(0x9147FF)
				.setAuthor('Twitch', 'https://i.imgur.com/6l1pPMI.jpg', 'https://www.twitch.tv/')
				.setThumbnail(data.thumbnail_url || null)
				.setURL(`https://twitch.tv/${data.broadcaster_login}`)
				.setTitle(data.display_name)
				.setDescription(data.is_live ? data.title : 'Not live')
				.setFooter(data.id)
				.addField('❯ Live?', data.is_live ? 'Yes' : 'No', true)
				.addField('❯ Start Date', data.is_live
					? moment.utc(new Date(data.started_at)).format('MM/DD/YYYY h:mm A')
					: '???', true)
				.addField('❯ Game', data.is_live ? data.game_name : '???', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 401) await this.fetchToken();
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchToken() {
		const { body } = await request
			.post('https://id.twitch.tv/oauth2/token')
			.query({
				client_id: TWITCH_ID,
				client_secret: TWITCH_SECRET,
				grant_type: 'client_credentials'
			});
		this.token = body.access_token;
		setTimeout(() => { this.token = null; }, body.expires_in);
		return body;
	}
};
