const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class KemonomimiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kemonomimi',
			aliases: ['cat-girl', 'nekomusume', '猫娘', '獣耳'],
			group: 'random-img',
			memberName: 'kemonomimi',
			description: 'Responds with a random kemonomimi image.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'noticeme.moe',
					url: 'https://noticeme.moe/',
					reason: 'API',
					reasonURL: 'https://noticeme.moe/kemonomimi.php'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://noticeme.moe/kemonomimi.php');
			return msg.say({ files: [body] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
