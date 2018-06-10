const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { THE_CAT_API_KEY } = process.env;

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['neko', 'kitty'],
			group: 'random',
			memberName: 'cat',
			description: 'Responds with a random cat image.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const { body, headers } = await request
				.get('http://thecatapi.com/api/images/get')
				.query({ api_key: THE_CAT_API_KEY });
			const format = headers['content-type'].replace(/image\//i, '');
			return msg.say({ files: [{ attachment: body, name: `cat.${format}` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
