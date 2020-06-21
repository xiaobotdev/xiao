const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class ScreenshotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'screenshot',
			aliases: ['capture', 'ss'],
			group: 'other',
			memberName: 'screenshot',
			description: 'Takes a screenshot of any webpage.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Thum.io',
					url: 'https://www.thum.io/',
					reason: 'API'
				},
				{
					name: 'AzuraApple',
					url: 'https://github.com/AzuraApple',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'url',
					prompt: 'What webpage do you want to take a screenshot of?',
					type: 'string',
					parse: url => encodeURIComponent(url)
				}
			]
		});
	}

	async run(msg, { url }) {
		try {
			const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${url}`);
			return msg.say({ files: [{ attachment: body, name: 'screenshot.png' }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results. Invalid URL?');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
