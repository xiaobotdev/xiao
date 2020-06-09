const Command = require('../../structures/Command');

module.exports = class FursonaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fursona',
			aliases: ['this-fursona-does-not-exist'],
			group: 'random-img',
			memberName: 'fursona',
			description: 'Responds with a randomly generated fursona.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'This Fursona Does Not Exist',
					url: 'https://thisfursonadoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	run(msg) {
		const num = Math.floor(Math.random() * 100000);
		return msg.say(`AI-Generated Fursona #${num}`, {
			files: [`https://thisfursonadoesnotexist.com/v2/jpgs/seed${num.toString().padStart(5, '0')}.jpg`]
		});
	}
};
