const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { THECATAPI_KEY } = process.env;

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['neko', 'kitty', 'meow'],
			group: 'random-img',
			memberName: 'cat',
			description: 'Responds with a random cat image.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'TheCatAPI',
					url: 'https://thecatapi.com/',
					reason: 'API',
					reasonURL: 'https://docs.thecatapi.com/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get('https://api.thecatapi.com/v1/images/search')
				.query({
					limit: 1,
					mime_types: 'jpg,png'
				})
				.set({ 'x-api-key': THECATAPI_KEY });
			return msg.say({ files: [body.images[0].url] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
