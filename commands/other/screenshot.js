const Command = require('../../structures/Command');
const request = require('node-superfetch');
const url = require('url');

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
				},
				{
					name: 'Block List Project',
					url: 'https://blocklist.site/',
					reason: 'NSFW Site List',
					reasonURL: 'https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt'
				}
			],
			args: [
				{
					key: 'site',
					prompt: 'What webpage do you want to take a screenshot of?',
					type: 'string',
					parse: site => /^(https?:\/\/)/i.test(site) ? site : `http://${site}`
				}
			]
		});

		this.pornList = null;
	}

	async run(msg, { site }) {
		try {
			if (!this.pornList) await this.fetchPornList();
			const parsed = url.parse(site);
			if (this.pornList.some(pornURL => parsed.host === pornURL) && !msg.channel.nsfw) {
				return msg.reply('This site is NSFW.');
			}
			const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`);
			return msg.say({ files: [{ attachment: body, name: 'screenshot.png' }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results. Invalid URL?');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchPornList(force = false) {
		if (!force && this.pornList) return this.pornList;
		const { text } = await request.get('https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt');
		this.pornList = text.split('\n')
			.filter(site => site && !site.startsWith('#'))
			.map(site => site.replace(/^(0.0.0.0 )/, '')); // eslint-disable-line no-control-regex
		return this.pornList;
	}
};
