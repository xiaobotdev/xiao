const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { IMGUR_KEY, FIDGET_ALBUM_ID } = process.env;

module.exports = class FidgetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fidget',
			aliases: ['nimbat'],
			group: 'random',
			memberName: 'fidget',
			description: 'Responds with a random image of Fidget.',
			clientPermissions: ['ATTACH_FILES']
		});

		this.cache = null;
	}

	async run(msg) {
		try {
			const nimbat = await this.random();
			if (!nimbat) return msg.reply('This album has no images...');
			return msg.say({ files: [nimbat] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async random() {
		if (this.cache) return this.cache[Math.floor(Math.random() * this.cache.length)].link;
		const { body } = await request
			.get(`https://api.imgur.com/3/album/${FIDGET_ALBUM_ID}`)
			.set({ Authorization: `Client-ID ${IMGUR_KEY}` });
		if (!body.data.images.length) return null;
		this.cache = body.data.images;
		setTimeout(() => { this.cache = null; }, 3.6e+6);
		return body.data.images[Math.floor(Math.random() * body.data.images.length)].link;
	}
};
