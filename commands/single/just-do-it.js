const Command = require('../../structures/Command');

module.exports = class JustDoItCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'just-do-it',
			aliases: ['motivate'],
			group: 'single',
			memberName: 'just-do-it',
			description: 'Sends a link to the "Just Do It!" motivational speech.',
			credit: [
				{
					name: 'MotivaShian',
					url: 'https://www.youtube.com/channel/UC0yDCpC_UaXEdL6Zc4715rg',
					reason: 'Original Motivational Speech',
					reasonURL: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0'
				}
			]
		});
	}

	run(msg) {
		return msg.say('https://www.youtube.com/watch?v=ZXsQAXx_ao0');
	}
};
