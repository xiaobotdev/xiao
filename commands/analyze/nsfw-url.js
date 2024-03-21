const Command = require('../../framework/Command');
const { isUrlNSFW } = require('../../util/Util');

module.exports = class NsfwUrlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nsfw-url',
			aliases: ['nsfw-uri', 'url-nsfw', 'uri-nsfw'],
			group: 'analyze',
			memberName: 'nsfw-url',
			description: 'Determines if a URL is NSFW.',
			args: [
				{
					key: 'url',
					prompt: 'What URL would you like to test?',
					type: 'url'
				}
			]
		});
	}

	async run(msg, { url }) {
		const nsfw = await isUrlNSFW(url, this.client.adultSiteList);
		if (nsfw === null) return msg.reply('❔ This site sent an error, or just didn\'t respond.');
		if (!nsfw) return msg.reply('👍 This site is SFW!');
		return msg.reply('👎 This site is NSFW.');
	}
};
