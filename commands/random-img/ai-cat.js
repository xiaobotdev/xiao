const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class AiCatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ai-cat',
			aliases: ['this-cat-does-not-exist', 'ai-neko', 'ai-kitty', 'ai-meow'],
			group: 'random-img',
			memberName: 'ai-cat',
			description: 'Responds with a randomly generated cat.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'This Cat Does Not Exist',
					url: 'https://thiscatdoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thiscatdoesnotexist.com/');
		return msg.say('AI-Generated Cat', { files: [{ attachment: body, name: 'ai-cat.jpg' }] });
	}
};
