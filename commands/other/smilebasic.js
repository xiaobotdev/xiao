const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class SmilebasicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'smilebasic',
			group: 'other',
			memberName: 'smilebasic',
			description: 'Responds with a ZIP file for a SmileBASIC project.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'SmileBASIC Source',
					url: 'https://smilebasicsource.com/',
					reason: 'API',
					reasonURL: 'https://smilebasicsource.com/page?pid=1360'
				}
			],
			args: [
				{
					key: 'key',
					prompt: 'What project key would you like to get a ZIP for?',
					type: 'string',
					parse: key => key.toUpperCase()
				}
			]
		});
	}

	async run(msg, { key }) {
		try {
			const { body } = await request.get(`http://sbapi.me/get/${key}/zip`);
			return msg.say({ files: [{ attachment: body, name: `${key}.zip` }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results. Invalid key?');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
