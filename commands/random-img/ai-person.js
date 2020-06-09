const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class AiPersonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ai-person',
			aliases: ['this-person-does-not-exist', 'person'],
			group: 'random-img',
			memberName: 'ai-person',
			description: 'Responds with a randomly generated person.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'This Person Does Not Exist',
					url: 'https://thispersondoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thispersondoesnotexist.com/image');
		return msg.say('AI-Generated Person', { files: [{ attachment: body, name: 'this-person-does-not-exist.jpg' }] });
	}
};
