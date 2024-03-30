const Command = require('../../framework/Command');
const request = require('node-superfetch');
const fs = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');
const images = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'xiao'));
const { SAUCENAO_KEY } = process.env;
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
				},
				{
					name: 'SauceNAO',
					url: 'https://saucenao.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const image = images[Math.floor(Math.random() * images.length)];
		return msg.say(await this.getSource(image), {
			files: [path.join(__dirname, '..', '..', 'assets', 'images', 'xiao', image)]
		});
	}

	async getSource(img) {
		const source = img.match(sourceRegex);
		const site = source[1];
		if (site === 'official') return 'Official Art';
		let data;
		try {
			data = await this.sauceNao(img);
			if (!data) return 'Artist Unknown';
			return `Art Source: ${data.ext_urls[0]}`;
		} catch {
			if (site === 'unknown') return 'Artist Unknown';
			if (site === 'deviant') return `Art by <https://www.deviantart.com/${source[2]}>`;
			if (site === 'pixiv') return `Art Source: <https://www.pixiv.net/en/artworks/${source[2]}>`;
			return `Art by ${site}`;
		}
	}

	async sauceNao(img) {
		const { body } = await request.post('https://saucenao.com/search.php')
			.query({
				api_key: SAUCENAO_KEY,
				db: 999,
				output_type: 2,
				numres: 16
			})
			.attach('file', await readFile(path.join(__dirname, '..', '..', 'assets', 'images', 'xiao', img)));
		console.log(body.header.message);
		if (!body.results || !body.results.length) return null;
		const result = body.results[0];
		if (Number.parseFloat(result.header.similarity) < 90) return null;
		return body.results[0].data;
	}
};
