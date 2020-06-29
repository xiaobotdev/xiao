const Command = require('../../structures/Command');

module.exports = class RickrollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rickroll',
			aliases: ['never-gonna-give-you-up', 'rick-astley'],
			group: 'single',
			memberName: 'rickroll',
			description: 'Sends a link to the "Never Gonna Give You Up" music video.',
			credit: [
				{
					name: 'Rick Astley',
					url: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw',
					reason: 'Original Music Video',
					reasonURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
				}
			]
		});
	}

	run(msg) {
		return msg.say('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
	}
};
