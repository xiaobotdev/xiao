const Command = require('../../structures/Command');

module.exports = class AiWaifuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ai-waifu',
			aliases: ['this-waifu-does-not-exist', 'waifu'],
			group: 'random-img',
			memberName: 'ai-waifu',
			description: 'Responds with a randomly generated waifu.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'This Waifu Does Not Exist',
					url: 'https://www.thiswaifudoesnotexist.net/',
					reason: 'API'
				}
			]
		});
	}

	run(msg) {
		const num = Math.floor(Math.random() * 100000);
		return msg.say(`AI-Generated Waifu #${num}`, {
			files: [`https://www.thiswaifudoesnotexist.net/example-${num}.jpg`]
		});
	}
};
