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
					key: 'url',
					prompt: 'What webpage do you want to take a screenshot of?',
					type: 'string'
				}
			]
		});

		this.pornList = null;
	}

	async run(msg, { url }) {
		try {
			if (!this.pornList) await this.fetchPornList();
			if (this.pornList.some(pornURL => url.includes(pornURL)) && !msg.channel.nsfw) {
				return msg.reply('This site is NSFW.');
			}
			const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${url}`);
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
			.filter(url => url && !url.startsWith('#'))
			.map(url => url.replace(/^(0.0.0.0	)/, ''));
		return this.postList;
	}
};
