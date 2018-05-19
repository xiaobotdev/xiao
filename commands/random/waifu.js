const { Command } = require('discord.js-commando');
const { randomFromImgurAlbum } = require('../../util/Util');
const waifus = require('../../assets/json/waifu');

module.exports = class WaifuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'waifu',
			group: 'random',
			memberName: 'waifu',
			description: 'Responds with a random image of one of dragonfire535\'s waifu.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		const waifuKeys = Object.keys(waifus);
		const waifu = waifuKeys[Math.floor(Math.random() * waifuKeys.length)];
		try {
			const waifuImage = await randomFromImgurAlbum(waifus[waifu]);
			return msg.say(waifu, { files: [waifuImage] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
