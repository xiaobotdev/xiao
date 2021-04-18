const Command = require('../../structures/Command');

module.exports = class FrogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frog',
			aliases: ['ribbit'],
			group: 'random-img',
			memberName: 'frog',
			description: 'Responds with a random frog image.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'FROGLAND!',
					url: 'http://allaboutfrogs.org/froglnd.shtml',
					reason: 'API',
					reasonURL: 'http://allaboutfrogs.org/funstuff/randomfrog.html'
				}
			]
		});
	}

	async run(msg) {
		try {
			const chosen = Math.floor(Math.random() * 54) + 1;
			const str = chosen.toString().padStart(4, '0');
			return msg.say({ files: [`http://www.allaboutfrogs.org/funstuff/random/${str}.jpg`] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
