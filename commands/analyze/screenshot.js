const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { isImageNSFW, isUrlNSFW } = require('../../util/Util');

module.exports = class ScreenshotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'screenshot',
			aliases: ['capture', 'ss'],
			group: 'analyze',
			memberName: 'screenshot',
			description: 'Takes a screenshot of any webpage.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 2,
				duration: 30
			},
			credit: [
				{
					name: 'Thum.io',
					url: 'https://www.thum.io/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'url',
					prompt: 'What webpage do you want to take a screenshot of?',
					type: 'url'
				}
			]
		});
	}

	async run(msg, { url }) {
		try {
			if (!msg.channel.nsfw) {
				const nsfw = await isUrlNSFW(url.href, this.client.adultSiteList);
				if (nsfw === null) return msg.reply('This site did not respond, or sent an error.');
				if (nsfw) return msg.reply('This site is NSFW.');
			}
			const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${url.href}`);
			if (!msg.channel.nsfw) {
				const aiDetect = await isImageNSFW(this.client.nsfwModel, body);
				if (aiDetect) return msg.reply('This site isn\'t NSFW, but the resulting image was.');
			}
			return msg.say({ files: [{ attachment: body, name: 'screenshot.png' }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results. Invalid URL?');
			throw err;
		}
	}
};
