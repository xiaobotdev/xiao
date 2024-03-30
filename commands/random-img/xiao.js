const Command = require('../../framework/Command');
const fs = require('fs');
const path = require('path');
const images = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'xiao'));
const sourceRegex = /([A-Z ]+)-?([0-9A-Z]+)?(-[0-9]+)?(\.[A-Z])?/i;

module.exports = class XiaoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xiao',
			aliases: ['xiao-pai', 'iao'],
			group: 'random-img',
			memberName: 'xiao',
			description: 'Responds with a random image of Xiao Pai.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Marvelous',
					url: 'http://www.marv.jp/',
					reasonURL: 'http://www.runefactory4.com/index1.html',
					reason: 'Images, Original "Rune Factory 4" Game'
				}
			]
		});
	}

	run(msg) {
		const image = images[Math.floor(Math.random() * images.length)];
		return msg.say(this.getSource(image), {
			files: [path.join(__dirname, '..', '..', 'assets', 'images', 'xiao', image)]
		});
	}

	getSource(img) {
		const source = img.match(sourceRegex);
		const site = source[1];
		if (site === 'unknown') return 'Artist Unknown';
		if (site === 'official') return 'Official Art';
		if (site === 'deviant') return `Art by <https://www.deviantart.com/${source[2]}>`;
		if (site === 'pixiv') return `Art Source: <https://www.pixiv.net/en/artworks/${source[2]}>`;
		return `Art by ${site}`;
	}
};
