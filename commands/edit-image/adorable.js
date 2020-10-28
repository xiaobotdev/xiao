const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class AdorableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'adorable',
			aliases: ['adorable-avatar'],
			group: 'edit-image',
			memberName: 'adorable',
			description: 'Creates an adorable avatar based on the text you provide.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Adorable Avatars',
					url: 'http://avatars.adorable.io/',
					reason: 'Original API'
				},
				{
					name: 'gfauchart',
					url: 'https://github.com/gfauchart',
					reason: 'API',
					reasonURL: 'https://github.com/adorableio/avatars-api-middleware/issues/108'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text should be used for generation?',
					type: 'string',
					parse: text => encodeURIComponent(text)
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			const { body } = await request.get(`https://api.hello-avatar.com/adorables/285/${text}.png`);
			return msg.say({ files: [{ attachment: body, name: 'adorable.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
