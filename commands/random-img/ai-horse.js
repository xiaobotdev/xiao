const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class AiHorseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ai-horse',
			aliases: ['this-horse-does-not-exist'],
			group: 'random-img',
			memberName: 'ai-horse',
			description: 'Responds with a randomly generated horse.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'This Horse Does Not Exist',
					url: 'https://thishorsedoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thishorsedoesnotexist.com/');
		return msg.say('AI-Generated Horse', { files: [{ attachment: body, name: 'ai-horse.jpg' }] });
	}
};
