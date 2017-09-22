const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class BeLikeBillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'be-like-bill',
			aliases: ['be-like'],
			group: 'image-edit',
			memberName: 'be-like-bill',
			description: 'Sends a "Be Like Bill" meme with the name of your choice.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'name',
					prompt: 'What should the name on the meme be?',
					type: 'string',
					default: 'Bill'
				}
			]
		});
	}

	async run(msg, { name }) {
		try {
			const { body } = await snekfetch
				.get('http://belikebill.azurewebsites.net/billgen-API.php')
				.query({
					default: 1,
					name
				});
			return msg.say({ files: [{ attachment: body, name: 'be-like-bill.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

