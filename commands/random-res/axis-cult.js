const Command = require('../../framework/Command');
const teachings = require('../../assets/json/axis-cult');

module.exports = class AxisCultCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'axis-cult',
			aliases: ['axis', 'axis-pray'],
			group: 'random-res',
			description: 'Responds with a teaching of the Axis Cult.',
			credit: [
				{
					name: 'Axis Order Bot',
					url: 'https://www.reddit.com/r/axisorderbot/wiki/index',
					reason: 'Prayer Data'
				},
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/',
					reason: 'Original Anime'
				}
			]
		});
	}

	run(msg) {
		return msg.say(teachings[Math.floor(Math.random() * teachings.length)]);
	}
};
