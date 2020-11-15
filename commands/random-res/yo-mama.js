const Command = require('../../structures/Command');
const jokes = require('../../assets/json/yo-mama');

module.exports = class YoMamaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yo-mama',
			aliases: ['your-mama'],
			group: 'random-res',
			memberName: 'yo-mama',
			description: 'Responds with a random "Yo Mama" joke.',
			credit: [
				{
					name: 'rdegges',
					url: 'https://github.com/rdegges',
					reason: 'Joke Data',
					reasonURL: 'https://github.com/rdegges/yomomma-api/blob/master/jokes.txt'
				}
			]
		});
	}

	run(msg) {
		return msg.say(jokes[Math.floor(Math.random() * jokes.length)]);
	}
};
