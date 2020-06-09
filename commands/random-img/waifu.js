const Command = require('../../structures/Command');

module.exports = class WaifuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'waifu',
			aliases: ['this-waifu-does-not-exist'],
			group: 'random-img',
			memberName: 'waifu',
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

	async run(msg) {
		const num = Math.floor(Math.random() * 100000);
		return msg.say({ files: [`https://www.thiswaifudoesnotexist.net/example-${num}.jpg`] });
	}
};
