const Command = require('../../framework/Command');
const { start, end } = require('../../assets/json/smw-level');

module.exports = class SmwLevelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'smw-level',
			aliases: ['super-mario-world-level'],
			group: 'random-res',
			description: 'Responds with a random Super Mario World level name.',
			credit: [
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Original "Super Mario World" Game',
					reasonURL: 'https://www.nintendo.co.jp/n02/shvc/mw/index.html'
				},
				{
					name: 'SMWiki',
					url: 'http://www.smwiki.net/',
					reason: 'Level Name Data',
					reasonURL: 'http://old.smwiki.net/wiki/List_of_Super_Mario_World_levels'
				}
			]
		});
	}

	run(msg) {
		return msg.say(`${start[Math.floor(Math.random() * start.length)]} ${end[Math.floor(Math.random() * end.length)]}`);
	}
};
