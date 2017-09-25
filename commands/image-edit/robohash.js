const Command = require('../../structures/Command');

module.exports = class RobohashCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'robohash',
			group: 'image-edit',
			memberName: 'robohash',
			description: 'Creates a robot based on the text you provide.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What text should be used for generation?',
					type: 'string',
					parse: text => encodeURIComponent(text)
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say({ files: [`https://robohash.org/${text}`] });
	}
};
