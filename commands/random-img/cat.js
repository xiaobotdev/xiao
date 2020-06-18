const Command = require('../../structures/Command');
const request = require('node-superfetch');

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
					name: 'random.cat',
					url: 'https://random.cat/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://aws.random.cat/meow');
			return msg.say({ files: [body.file] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
