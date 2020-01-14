const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class RobohashCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'robohash',
			group: 'image-edit',
			memberName: 'robohash',
			description: 'Creates a robot based on the text you provide.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'RoboHash',
					url: 'https://robohash.org/',
					reason: 'API'
				}
			],
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

	async run(msg, { text }) {
		try {
			const { body } = await request.get(`https://robohash.org/${text}`);
			return msg.say({ files: [{ attachment: body, name: 'robohash.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
