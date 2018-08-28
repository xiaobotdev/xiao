const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { IMGUR_KEY, POSTER_ALBUM_ID } = process.env;

module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'random',
			memberName: 'meme',
			description: 'Responds with a random meme.',
			clientPermissions: ['ATTACH_FILES']
		});

		this.cache = null;
	}

	async run(msg) {
		try {
			const meme = await this.random();
			if (!meme) return msg.reply('This album has no images...');
			return msg.say({ files: [meme] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async random() {
		if (this.cache) return this.cache[Math.floor(Math.random() * this.cache.length)].link;
		const { body } = await request
			.get(`https://api.imgur.com/3/album/${POSTER_ALBUM_ID}`)
			.set({ Authorization: `Client-ID ${IMGUR_KEY}` });
		if (!body.data.images.length) return null;
		this.cache = body.data.images;
		setTimeout(() => { this.cache = null; }, 3.6e+6);
		return body.data.images[Math.floor(Math.random() * body.data.images.length)].link;
	}
};
