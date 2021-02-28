const Command = require('../../structures/Command');
const request = require('node-superfetch');
const url = require('url');
const validURL = require('valid-url');

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
				}
			],
			args: [
				{
					key: 'site',
					prompt: 'What webpage do you want to take a screenshot of?',
					type: 'string',
					validate: site => validURL.isWebUri(site)
				}
			]
		});
	}

	async run(msg, { site }) {
		try {
			const parsed = url.parse(site);
			if (!msg.channel.nsfw && this.client.adultSiteList.some(pornURL => parsed.host === pornURL)) {
				return msg.reply('This site is NSFW.');
			}
			const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`);
			return msg.say({ files: [{ attachment: body, name: 'screenshot.png' }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results. Invalid URL?');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
