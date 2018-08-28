const request = require('node-superfetch');
const Command = require('../Command');
const { IMGUR_KEY } = process.env;

module.exports = class RoleplayCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.albumID = info.albumID;
		this.cache = null;
	}

	async run(msg, { user }) {
		try {
			const image = await this.random();
			if (!image) return msg.reply('This album has no images...');
			return msg.say(this.generateText(msg, user), { files: [image] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async random() {
		if (this.cache) return this.cache[Math.floor(Math.random() * this.cache.length)].link;
		const { body } = await request
			.get(`https://api.imgur.com/3/album/${this.albumID}`)
			.set({ Authorization: `Client-ID ${IMGUR_KEY}` });
		if (!body.data.images.length) return null;
		this.cache = body.data.images;
		setTimeout(() => { this.cache = null; }, 3.6e+6);
		return body.data.images[Math.floor(Math.random() * body.data.images.length)].link;
	}
};
