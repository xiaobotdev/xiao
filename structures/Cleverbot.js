const request = require('node-superfetch');
const { CLEVERBOT_KEY } = process.env;
const blankResponses = ['What?', 'Huh?', 'I don\'t understand.', 'Speak up, please.'];

module.exports = class Cleverbot {
	constructor(client, channelID, authorID, key = CLEVERBOT_KEY) {
		Object.defineProperty(this, 'client', { value: client });

		this.channelID = channelID;
		this.authorID = authorID;
		this.cs = null;
		this.timeout = this.setTimeout();
		this.key = key;
	}

	async respond(input) {
		if (!input) {
			clearTimeout(this.timeout);
			this.timeout = this.setTimeout();
			return blankResponses[Math.floor(Math.random() * blankResponses.length)];
		}
		const { body } = await request
			.get('https://www.cleverbot.com/getreply')
			.query({
				key: this.key,
				cs: this.cs || '',
				input
			});
		clearTimeout(this.timeout);
		this.timeout = this.setTimeout();
		this.cs = body.cs;
		return body.output || blankResponses[Math.floor(Math.random() * blankResponses.length)];
	}

	shouldRespond(msg) {
		return msg.channel.id === this.channelID && msg.author.id === this.authorID;
	}

	setTimeout() {
		return setTimeout(() => {
			this.manager.delete(this.channelID);
			if (!this.channel) return;
			this.channel.send('Conversation timed out.').catch(() => null);
		}, 600000);
	}

	get channel() {
		return this.client.channels.cache.get(this.channelID);
	}

	get author() {
		return this.client.users.cache.get(this.authorID);
	}
};
