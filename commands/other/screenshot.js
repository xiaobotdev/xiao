const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { URL } = require('url');
const { isImageNSFW } = require('../../util/Util');

module.exports = class ScreenshotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'screenshot',
			aliases: ['capture', 'ss'],
			group: 'other',
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
				let nsfw;
				if (this.client.adultSiteList.includes(url.host)) {
					nsfw = true;
				} else {
					try {
						const { url: newURL } = await request.get(url);
						const parsedNewURL = new URL(newURL);
						if (this.client.adultSiteList.includes(parsedNewURL.host)) nsfw = true;
					} catch {
						return msg.reply('This site did not respond, or sent an error.');
					}
				}
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
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
