const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber, base64, embedURL } = require('../../util/Util');
const { TWITTER_KEY, TWITTER_SECRET } = process.env;
const retweetRegex = /^RT @([a-zA-Z0-9_]{1,15}):/;

module.exports = class TwitterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'twitter',
			group: 'search',
			memberName: 'twitter',
			description: 'Responds with information on a Twitter user.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Twitter',
					url: 'https://twitter.com/',
					reason: 'API',
					reasonURL: 'https://developer.twitter.com/en/docs.html'
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
				.get('https://api.twitter.com/1.1/users/show.json')
				.set({ Authorization: `Bearer ${this.token}` })
				.query({ screen_name: user });
			let latest = body.status;
			if (latest) {
				const statusUser = body.status.retweeted_status ? body.status.text.match(retweetRegex)[1] : body.screen_name;
				const statusID = body.status.retweeted_status ? body.status.retweeted_status.id_str : body.status.id_str;
				latest = embedURL(body.status.text, `https://twitter.com/${statusUser}/status/${statusID}`);
			} else {
				latest = body.protected ? '🔒 Protected' : 'No tweets found.';
			}
			const embed = new MessageEmbed()
				.setColor(0x55ADEE)
				.setAuthor('Twitter', 'https://i.imgur.com/QnfcO7y.png', 'https://twitter.com/')
				.setThumbnail(body.profile_image_url_https.replace('_normal', ''))
				.setURL(`https://twitter.com/${body.screen_name}`)
				.setTitle(`${body.name} (@${body.screen_name})`)
				.setDescription(body.description)
				.addField('❯ Tweets', formatNumber(body.statuses_count), true)
				.addField('❯ Followers', formatNumber(body.followers_count), true)
				.addField('❯ Following', formatNumber(body.friends_count), true)
				.addField('❯ Protected?', body.protected ? 'Yes' : 'No', true)
				.addField('❯ Verified?', body.verified ? 'Yes' : 'No', true)
				.addField('❯ Creation Date', moment.utc(new Date(body.created_at)).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Latest Tweet', latest);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 401) await this.fetchToken();
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchToken() {
		const { body } = await request
			.post('https://api.twitter.com/oauth2/token')
			.set({
				Authorization: `Basic ${base64(`${TWITTER_KEY}:${TWITTER_SECRET}`)}`,
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			})
			.send('grant_type=client_credentials');
		this.token = body.access_token;
		return body;
	}
};
